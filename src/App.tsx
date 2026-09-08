import { useState, useEffect } from 'react';
import { MobileEnforcer } from './components/common/MobileEnforcer';
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { CampusMap } from './components/quest/CampusMap';
import { ActiveClueCard } from './components/quest/ActiveClueCard';
import { CheckInModal } from './components/quest/CheckInModal';
import { RiddleChainDrawer } from './components/quest/RiddleChainDrawer';
import { GuildHallView } from './components/guild/GuildHallView';
import { GuildDirectoryView } from './components/guild/GuildDirectoryView';
import { GuildCreateModal } from './components/guild/GuildCreateModal';
import { ChatView } from './components/chat/ChatView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminChamberModal } from './components/admin/AdminChamberModal';

import {
  initialWeeklyQuest,
  campusLandmarks,
  initialGuilds,
  initialUserProfile,
  initialChatMessages
} from './data/campusData';
import { dbService } from './services/dbService';
import type { Quest, Guild, UserProfile, CampusLandmark, ChatMessage } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'quest' | 'guild' | 'chat' | 'leaderboard' | 'profile'>('quest');
  const [guildSubView, setGuildSubView] = useState<'hall' | 'directory'>('hall');

  // Core State
  const [quest, setQuest] = useState<Quest>(initialWeeklyQuest);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [guilds, setGuilds] = useState<Guild[]>(initialGuilds);
  const [landmarks, setLandmarks] = useState<CampusLandmark[]>(campusLandmarks);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  // Modal State
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isChainDrawerOpen, setIsChainDrawerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCreateGuildOpen, setIsCreateGuildOpen] = useState(false);

  // Load from dbService on mount
  useEffect(() => {
    async function initData() {
      const [loadedUser, loadedQuest, loadedGuilds, loadedChat] = await Promise.all([
        dbService.loadUserProfile(),
        dbService.loadQuest(),
        dbService.loadGuilds(),
        dbService.loadChatMessages()
      ]);

      setUser(loadedUser);
      setQuest(loadedQuest);
      setGuilds(loadedGuilds);
      setChatMessages(loadedChat);
    }

    initData();

    // Setup realtime subscription for chat
    const unsubscribeChat = dbService.subscribeToChat((newMsg) => {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      unsubscribeChat();
    };
  }, []);

  const activeStop = quest.stops[quest.activeStopIndex];
  const userGuild = guilds.find((g) => g.id === user.guildId) || guilds[0];

  // Stop Unlock Handler
  const handleSuccessfulUnlock = async (stopId: string, earnedXp: number) => {
    // 1. Advance quest stops
    const updatedStops = quest.stops.map((s, idx) => {
      if (s.id === stopId) {
        return { ...s, status: 'completed' as const, unlockedAt: 'Just now' };
      }
      if (idx === quest.activeStopIndex + 1) {
        return { ...s, status: 'active' as const };
      }
      return s;
    });

    const nextIndex = Math.min(quest.stops.length - 1, quest.activeStopIndex + 1);
    const isFinished = quest.activeStopIndex + 1 >= quest.stops.length;

    const updatedQuest: Quest = {
      ...quest,
      stops: updatedStops,
      activeStopIndex: nextIndex,
      isCompleted: isFinished
    };

    setQuest(updatedQuest);
    await dbService.saveQuest(updatedQuest, user.id);

    // 2. Grant Player & Guild XP
    const newCurrentXp = user.currentXp + earnedXp;
    const hasLeveledUp = newCurrentXp >= user.nextLevelXp;

    const updatedUser: UserProfile = {
      ...user,
      currentXp: hasLeveledUp ? newCurrentXp - user.nextLevelXp : newCurrentXp,
      level: hasLeveledUp ? user.level + 1 : user.level,
      locationsDiscovered: user.locationsDiscovered + 1,
      completedQuestsCount: isFinished ? user.completedQuestsCount + 1 : user.completedQuestsCount
    };

    setUser(updatedUser);
    await dbService.saveUserProfile(updatedUser);

    // 3. Grant Guild XP
    const updatedGuilds = guilds.map((g) => {
      if (g.id === user.guildId) {
        return {
          ...g,
          currentXp: g.currentXp + earnedXp,
          weeklyXp: g.weeklyXp + earnedXp
        };
      }
      return g;
    });
    setGuilds(updatedGuilds);
    await dbService.saveGuilds(updatedGuilds);

    // 4. Update Landmark status
    setLandmarks((prevLandmarks) =>
      prevLandmarks.map((lm) => {
        if (lm.activeClueForStop === activeStop.stopNumber) {
          return { ...lm, isDiscovered: true };
        }
        return lm;
      })
    );
  };

  // Guild Creation Handler
  const handleGuildCreated = async (newGuildData: Partial<Guild>) => {
    const createdGuild: Guild = {
      id: `guild-${Date.now()}`,
      name: newGuildData.name || 'New Order',
      tag: newGuildData.tag || 'ORDER',
      motto: newGuildData.motto || 'Wisdom in Shadows',
      description: 'Newly chartered collegiate society.',
      crestId: newGuildData.crestId || 'gear',
      bannerGradient: newGuildData.bannerGradient || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      accentColor: '#e5c07b',
      level: 1,
      currentXp: 0,
      nextLevelXp: 1500,
      memberCount: 1,
      maxMembers: newGuildData.maxMembers || 25,
      campusRank: guilds.length + 1,
      weeklyXp: 0,
      allTimeXp: 0,
      recruitmentVibe: 'New Society',
      recruitmentTags: ['New Guild', 'Lore Seekers'],
      isOpen: true,
      members: [
        {
          id: user.id,
          name: user.name,
          handle: user.handle,
          avatarSeed: 'rowan',
          role: 'Grandmaster',
          level: user.level,
          title: user.title,
          weeklyXpContributed: 0,
          questsCompleted: user.completedQuestsCount,
          isOnline: true
        }
      ],
      perks: []
    };

    const updatedGuilds = [...guilds, createdGuild];
    setGuilds(updatedGuilds);
    await dbService.saveGuilds(updatedGuilds);

    const updatedUser: UserProfile = {
      ...user,
      guildId: createdGuild.id,
      guildName: createdGuild.name,
      guildTag: createdGuild.tag,
      guildRole: 'Grandmaster'
    };
    setUser(updatedUser);
    await dbService.saveUserProfile(updatedUser);

    setGuildSubView('hall');
  };

  return (
    <MobileEnforcer>
      {/* Persistent Top Navigation Bar */}
      <TopBar
        user={user}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Screen Views Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* TAB 1: QUEST / MAP (First Priority) */}
        {activeTab === 'quest' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              height: '100%'
            }}
          >
            {/* Living Interactive Campus Map */}
            <div style={{ flex: 1, position: 'relative' }}>
              <CampusMap
                landmarks={landmarks}
                activeStop={activeStop}
                onSelectLandmark={() => {}}
                onOpenCheckIn={() => setIsCheckInOpen(true)}
              />
            </div>

            {/* Active Clue Parchment HUD Card */}
            <ActiveClueCard
              questTitle={quest.title}
              episode={quest.episode}
              activeStop={activeStop}
              currentStopIndex={quest.activeStopIndex}
              totalStops={quest.stops.length}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onOpenChainDrawer={() => setIsChainDrawerOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: GUILDS (First Priority) */}
        {activeTab === 'guild' && (
          <>
            {guildSubView === 'hall' ? (
              <GuildHallView
                guild={userGuild}
                user={user}
                onOpenWarRoom={() => setActiveTab('chat')}
                onOpenDirectory={() => setGuildSubView('directory')}
              />
            ) : (
              <GuildDirectoryView
                guilds={guilds}
                currentGuildId={user.guildId}
                onBackToMyGuild={() => setGuildSubView('hall')}
                onOpenCreateGuild={() => setIsCreateGuildOpen(true)}
              />
            )}
          </>
        )}

        {/* TAB 3: CHAT (Campfire & War Room) */}
        {activeTab === 'chat' && (
          <ChatView user={user} initialMessages={chatMessages} />
        )}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === 'leaderboard' && <LeaderboardView />}

        {/* TAB 5: PROFILE & CHRONICLES */}
        {activeTab === 'profile' && <ProfileView user={user} />}
      </main>

      {/* Persistent Bottom Mobile Tab Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* MODALS */}
      {/* 1. Location Check-In Modal (GPS & QR) */}
      {isCheckInOpen && (
        <CheckInModal
          activeStop={activeStop}
          onClose={() => setIsCheckInOpen(false)}
          onSuccessfulUnlock={handleSuccessfulUnlock}
        />
      )}

      {/* 2. Story Clue Chain Drawer */}
      {isChainDrawerOpen && (
        <RiddleChainDrawer quest={quest} onClose={() => setIsChainDrawerOpen(false)} />
      )}

      {/* 3. Found a Guild Modal */}
      {isCreateGuildOpen && (
        <GuildCreateModal
          onClose={() => setIsCreateGuildOpen(false)}
          onGuildCreated={handleGuildCreated}
        />
      )}

      {/* 4. Admin Chamber Studio */}
      {isAdminOpen && (
        <AdminChamberModal
          quest={quest}
          onClose={() => setIsAdminOpen(false)}
          onSaveQuest={(updated) => {
            setQuest(updated);
            dbService.saveQuest(updated, user.id);
          }}
        />
      )}
    </MobileEnforcer>
  );
}

export default App;
