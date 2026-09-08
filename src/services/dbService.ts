import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Quest, Guild, UserProfile, ChatMessage } from '../types';
import { initialWeeklyQuest, initialGuilds, initialUserProfile, initialChatMessages } from '../data/campusData';

// Keys for local cache fallback
const CACHE_KEYS = {
  QUEST: 'sideq_quest_progress',
  USER: 'sideq_user_profile',
  GUILDS: 'sideq_guilds',
  CHAT: 'sideq_chat_messages'
};

export const dbService = {
  // Check if connected to real cloud Supabase
  isCloudConnected: () => isSupabaseConfigured(),

  // Load User Profile
  async loadUserProfile(): Promise<UserProfile> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', initialUserProfile.id)
          .single();

        if (data && !error) {
          return {
            id: data.id,
            name: data.name,
            handle: data.handle,
            title: data.title,
            level: data.level,
            currentXp: data.current_xp,
            nextLevelXp: data.next_level_xp,
            guildId: data.guild_id,
            guildName: data.guild_name,
            guildTag: data.guild_tag,
            guildRole: data.guild_role,
            completedQuestsCount: data.completed_quests_count,
            locationsDiscovered: data.locations_discovered,
            currentStreakDays: data.current_streak_days,
            badges: data.badges || []
          };
        }
      } catch (err) {
        console.warn('Supabase fetch profile error, using cache:', err);
      }
    }

    // Fallback to local storage or initial seed
    const cached = localStorage.getItem(CACHE_KEYS.USER);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return initialUserProfile;
  },

  // Save User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    localStorage.setItem(CACHE_KEYS.USER, JSON.stringify(profile));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('profiles').upsert({
          id: profile.id,
          name: profile.name,
          handle: profile.handle,
          title: profile.title,
          level: profile.level,
          current_xp: profile.currentXp,
          next_level_xp: profile.nextLevelXp,
          guild_id: profile.guildId,
          guild_name: profile.guildName,
          guild_tag: profile.guildTag,
          guild_role: profile.guildRole,
          completed_quests_count: profile.completedQuestsCount,
          locations_discovered: profile.locationsDiscovered,
          current_streak_days: profile.currentStreakDays,
          badges: profile.badges,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase save profile error:', err);
      }
    }
  },

  // Load Quest
  async loadQuest(): Promise<Quest> {
    if (isSupabaseConfigured()) {
      try {
        const { data: questData, error: qErr } = await supabase
          .from('quests')
          .select('*')
          .eq('id', initialWeeklyQuest.id)
          .single();

        const { data: stopsData, error: sErr } = await supabase
          .from('quest_stops')
          .select('*')
          .eq('quest_id', initialWeeklyQuest.id)
          .order('stop_number', { ascending: true });

        if (questData && stopsData && !qErr && !sErr) {
          return {
            id: questData.id,
            title: questData.title,
            episode: questData.episode,
            weekNumber: questData.week_number,
            theme: questData.theme,
            narrativeIntro: questData.narrative_intro,
            resolutionNarrative: questData.resolution_narrative,
            totalXp: questData.total_xp,
            publishedAt: questData.published_at,
            expiresAt: questData.expires_at,
            activeStopIndex: 1,
            isCompleted: false,
            stops: stopsData.map((s) => ({
              id: s.id,
              stopNumber: s.stop_number,
              title: s.title,
              locationName: s.location_name,
              metaphoricRiddle: s.metaphoric_riddle,
              storyLoreUnlock: s.story_lore_unlock,
              historicalNote: s.historical_note,
              status: s.stop_number === 1 ? 'completed' : s.stop_number === 2 ? 'active' : 'locked',
              unlockMethod: s.unlock_method,
              targetCoords: {
                lat: s.target_lat || 42.3615,
                lng: s.target_lng || -71.0928,
                campusX: s.campus_x,
                campusY: s.campus_y
              },
              qrPayload: s.qr_payload,
              xpReward: s.xp_reward
            }))
          };
        }
      } catch (err) {
        console.warn('Supabase fetch quest error, using cache:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.QUEST);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return initialWeeklyQuest;
  },

  // Save Quest Progress
  async saveQuest(quest: Quest, userId: string): Promise<void> {
    localStorage.setItem(CACHE_KEYS.QUEST, JSON.stringify(quest));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('user_quest_progress').upsert({
          id: `${userId}_${quest.id}`,
          user_id: userId,
          quest_id: quest.id,
          active_stop_index: quest.activeStopIndex,
          is_completed: quest.isCompleted,
          completed_stops: quest.stops.filter((s) => s.status === 'completed').map((s) => s.id),
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase save quest progress error:', err);
      }
    }
  },

  // Load Guilds
  async loadGuilds(): Promise<Guild[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('guilds').select('*');
        if (data && data.length > 0 && !error) {
          return data.map((g) => ({
            id: g.id,
            name: g.name,
            tag: g.tag,
            motto: g.motto || '',
            description: g.description || '',
            crestId: g.crest_id || 'gear',
            bannerGradient: g.banner_gradient || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            accentColor: g.accent_color || '#E5C07B',
            level: g.level || 1,
            currentXp: g.current_xp || 0,
            nextLevelXp: g.next_level_xp || 2000,
            memberCount: g.member_count || 1,
            maxMembers: g.max_members || 25,
            campusRank: g.campus_rank || 1,
            weeklyXp: g.weekly_xp || 0,
            allTimeXp: g.all_time_xp || 0,
            recruitmentVibe: g.recruitment_vibe || 'Campus Guild',
            recruitmentTags: g.recruitment_tags || [],
            isOpen: g.is_open ?? true,
            members: initialGuilds.find((ig) => ig.id === g.id)?.members || [],
            perks: initialGuilds.find((ig) => ig.id === g.id)?.perks || []
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch guilds error, using cache:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.GUILDS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return initialGuilds;
  },

  // Save Guilds
  async saveGuilds(guilds: Guild[]): Promise<void> {
    localStorage.setItem(CACHE_KEYS.GUILDS, JSON.stringify(guilds));
  },

  // Load Chat Messages
  async loadChatMessages(): Promise<ChatMessage[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(60);

        if (data && data.length > 0 && !error) {
          return data.map((m) => ({
            id: m.id,
            channelId: m.channel_id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderHandle: m.sender_handle,
            senderRole: m.sender_role,
            senderTitle: m.sender_title,
            guildTag: m.guild_tag,
            text: m.text,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch chat error:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.CHAT);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return initialChatMessages;
  },

  // Send Chat Message
  async sendChatMessage(msg: ChatMessage): Promise<void> {
    const existing = await this.loadChatMessages();
    const updated = [...existing, msg];
    localStorage.setItem(CACHE_KEYS.CHAT, JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('chat_messages').insert({
          id: msg.id,
          channel_id: msg.channelId,
          sender_id: msg.senderId,
          sender_name: msg.senderName,
          sender_handle: msg.senderHandle,
          sender_role: msg.senderRole,
          sender_title: msg.senderTitle,
          guild_tag: msg.guildTag,
          text: msg.text
        });
      } catch (err) {
        console.warn('Supabase insert chat error:', err);
      }
    }
  },

  // Subscribe to Realtime Chat (if Supabase is connected)
  subscribeToChat(onNewMessage: (msg: ChatMessage) => void) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel('realtime:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const m = payload.new as any;
          onNewMessage({
            id: m.id,
            channelId: m.channel_id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderHandle: m.sender_handle,
            senderRole: m.sender_role,
            senderTitle: m.sender_title,
            guildTag: m.guild_tag,
            text: m.text,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
