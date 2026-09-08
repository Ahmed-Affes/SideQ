import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Quest, Guild, UserProfile, ChatMessage, QuestStop } from '../types';

const CACHE_KEYS = {
  QUEST: 'sideq_quest_progress',
  USER: 'sideq_user_profile',
  GUILDS: 'sideq_guilds',
  CHAT: 'sideq_chat_messages'
};

export const dbService = {
  isCloudConnected: () => isSupabaseConfigured(),

  // Load User Profile
  async loadUserProfile(userId?: string): Promise<UserProfile | null> {
    if (!userId) {
      const cached = localStorage.getItem(CACHE_KEYS.USER);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
      return null;
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data && !error) {
          const profile: UserProfile = {
            id: data.id,
            name: data.name,
            handle: data.handle,
            title: data.title || 'Novice Initiate',
            level: data.level || 1,
            currentXp: data.current_xp || 0,
            nextLevelXp: data.next_level_xp || 1000,
            guildId: data.guild_id || '',
            guildName: data.guild_name || 'No Society Enrolled',
            guildTag: data.guild_tag || 'NONE',
            guildRole: data.guild_role || 'Scout',
            completedQuestsCount: data.completed_quests_count || 0,
            locationsDiscovered: data.locations_discovered || 0,
            currentStreakDays: data.current_streak_days || 1,
            badges: data.badges || []
          };
          localStorage.setItem(CACHE_KEYS.USER, JSON.stringify(profile));
          return profile;
        }
      } catch (err) {
        console.warn('Supabase fetch profile error:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.USER);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id === userId) return parsed;
      } catch {}
    }

    return null;
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

  // Load Real Quest Progress For Student
  async loadQuest(userId?: string): Promise<Quest | null> {
    if (isSupabaseConfigured()) {
      try {
        // 1. Fetch Quest from DB
        const { data: questData, error: qErr } = await supabase
          .from('quests')
          .select('*')
          .order('week_number', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (questData && !qErr) {
          // 2. Fetch Quest Stops from DB
          const { data: stopsData, error: sErr } = await supabase
            .from('quest_stops')
            .select('*')
            .eq('quest_id', questData.id)
            .order('stop_number', { ascending: true });

          // 3. Fetch Student's specific progress
          let activeStopIndex = 0;
          let completedStops: string[] = [];
          let isCompleted = false;

          if (userId) {
            const { data: progressData } = await supabase
              .from('user_quest_progress')
              .select('*')
              .eq('user_id', userId)
              .eq('quest_id', questData.id)
              .maybeSingle();

            if (progressData) {
              activeStopIndex = progressData.active_stop_index ?? 0;
              completedStops = progressData.completed_stops ?? [];
              isCompleted = progressData.is_completed ?? false;
            }
          }

          if (stopsData && !sErr && stopsData.length > 0) {
            const formattedStops: QuestStop[] = stopsData.map((s) => {
              const isDone = completedStops.includes(s.id);
              const isActive = !isDone && s.stop_number - 1 === activeStopIndex;
              return {
                id: s.id,
                stopNumber: s.stop_number,
                title: s.title,
                locationName: s.location_name,
                metaphoricRiddle: s.metaphoric_riddle,
                storyLoreUnlock: s.story_lore_unlock,
                historicalNote: s.historical_note,
                status: isDone ? 'completed' : isActive ? 'active' : 'locked',
                unlockMethod: s.unlock_method,
                targetCoords: {
                  lat: s.target_lat || 42.3601,
                  lng: s.target_lng || -71.0942,
                  campusX: s.campus_x,
                  campusY: s.campus_y
                },
                qrPayload: s.qr_payload,
                xpReward: s.xp_reward
              };
            });

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
              activeStopIndex,
              isCompleted,
              stops: formattedStops
            };
          }
        }
      } catch (err) {
        console.warn('Supabase fetch quest error:', err);
      }
    }

    // When admin hasn't created any quests yet, return null
    return null;
  },

  // Save Quest Progress & Quest Definitions
  async saveQuest(quest: Quest, userId?: string): Promise<void> {
    localStorage.setItem(CACHE_KEYS.QUEST, JSON.stringify(quest));

    if (isSupabaseConfigured()) {
      try {
        // 1. Upsert quest record
        await supabase.from('quests').upsert({
          id: quest.id,
          title: quest.title,
          episode: quest.episode,
          week_number: quest.weekNumber || 1,
          theme: quest.theme || 'Campus Mystery',
          narrative_intro: quest.narrativeIntro,
          resolution_narrative: quest.resolutionNarrative || '',
          total_xp: quest.totalXp || 400,
          published_at: quest.publishedAt || new Date().toISOString(),
          expires_at: quest.expiresAt || new Date(Date.now() + 7 * 86400000).toISOString()
        });

        // 2. Upsert stops
        if (quest.stops && quest.stops.length > 0) {
          const stopsToUpsert = quest.stops.map((s) => ({
            id: s.id,
            quest_id: quest.id,
            stop_number: s.stopNumber,
            title: s.title,
            location_name: s.locationName,
            metaphoric_riddle: s.metaphoricRiddle,
            story_lore_unlock: s.storyLoreUnlock,
            historical_note: s.historicalNote,
            unlock_method: s.unlockMethod,
            target_lat: s.targetCoords?.lat,
            target_lng: s.targetCoords?.lng,
            campus_x: s.targetCoords?.campusX,
            campus_y: s.targetCoords?.campusY,
            qr_payload: s.qrPayload,
            xp_reward: s.xpReward
          }));

          await supabase.from('quest_stops').upsert(stopsToUpsert);
        }

        // 3. Upsert user progress if userId provided
        if (userId) {
          await supabase.from('user_quest_progress').upsert({
            id: `${userId}_${quest.id}`,
            user_id: userId,
            quest_id: quest.id,
            active_stop_index: quest.activeStopIndex,
            is_completed: quest.isCompleted,
            completed_stops: quest.stops.filter((s) => s.status === 'completed').map((s) => s.id),
            updated_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Supabase save quest error:', err);
      }
    }
  },

  // Load Real Guilds from Supabase
  async loadGuilds(): Promise<Guild[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data: guildsData, error: gErr } = await supabase.from('guilds').select('*');
        const { data: membersData } = await supabase.from('guild_members').select('*, profiles(*)');

        if (guildsData && guildsData.length > 0 && !gErr) {
          return guildsData.map((g) => {
            const actualMembers = (membersData || [])
              .filter((m) => m.guild_id === g.id)
              .map((m) => ({
                id: m.user_id,
                name: m.profiles?.name || 'Scholar',
                handle: m.profiles?.handle || '@scholar',
                avatarSeed: m.user_id,
                role: m.role || 'Scout',
                level: m.profiles?.level || 1,
                title: m.profiles?.title || 'Novice Initiate',
                weeklyXpContributed: m.weekly_xp || 0,
                questsCompleted: m.quests_completed || 0,
                isOnline: false
              }));

            return {
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
              memberCount: actualMembers.length,
              maxMembers: g.max_members || 25,
              campusRank: g.campus_rank || 1,
              weeklyXp: g.weekly_xp || 0,
              allTimeXp: g.all_time_xp || 0,
              recruitmentVibe: g.recruitment_vibe || 'Campus Guild',
              recruitmentTags: g.recruitment_tags || [],
              isOpen: g.is_open ?? true,
              members: actualMembers,
              perks: []
            };
          });
        }
      } catch (err) {
        console.warn('Supabase fetch guilds error:', err);
      }
    }

    return [];
  },

  // Save Guilds locally
  async saveGuilds(guilds: Guild[]): Promise<void> {
    localStorage.setItem(CACHE_KEYS.GUILDS, JSON.stringify(guilds));
  },

  // Create & Charter a Guild in Supabase
  async createGuild(guild: Guild, founderId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('guilds').upsert({
          id: guild.id,
          name: guild.name,
          tag: guild.tag,
          motto: guild.motto,
          description: guild.description,
          crest_id: guild.crestId,
          banner_gradient: guild.bannerGradient,
          accent_color: guild.accentColor,
          level: guild.level,
          current_xp: guild.currentXp,
          next_level_xp: guild.nextLevelXp,
          max_members: guild.maxMembers,
          campus_rank: guild.campusRank,
          weekly_xp: guild.weeklyXp,
          all_time_xp: guild.allTimeXp,
          recruitment_vibe: guild.recruitmentVibe,
          recruitment_tags: guild.recruitmentTags,
          is_open: guild.isOpen
        });

        if (founderId) {
          await supabase.from('guild_members').upsert({
            guild_id: guild.id,
            user_id: founderId,
            role: 'Grandmaster'
          });

          await supabase.from('profiles').update({
            guild_id: guild.id,
            guild_name: guild.name,
            guild_tag: guild.tag,
            guild_role: 'Grandmaster'
          }).eq('id', founderId);
        }
      } catch (err) {
        console.warn('Supabase create guild error:', err);
      }
    }
  },

  // Join a Guild
  async joinGuild(userId: string, guildId: string): Promise<void> {
    if (isSupabaseConfigured() && userId && guildId) {
      try {
        await supabase.from('guild_members').upsert({
          guild_id: guildId,
          user_id: userId,
          role: 'Scout'
        });

        const { data: guildData } = await supabase.from('guilds').select('name, tag').eq('id', guildId).single();

        if (guildData) {
          await supabase.from('profiles').update({
            guild_id: guildId,
            guild_name: guildData.name,
            guild_tag: guildData.tag,
            guild_role: 'Scout'
          }).eq('id', userId);
        }
      } catch (err) {
        console.warn('Join guild error:', err);
      }
    }
  },

  // Load Real Chat Messages from Supabase
  async loadChatMessages(): Promise<ChatMessage[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(100);

        if (data && !error) {
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

    return [];
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

  // Realtime Chat Subscription
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
  },

  // Load Real Leaderboard Standings from Supabase Database
  async loadLeaderboards(currentUserId?: string) {
    if (isSupabaseConfigured()) {
      try {
        // 1. Solo Leaderboard from public.profiles
        const { data: profilesData, error: pErr } = await supabase
          .from('profiles')
          .select('id, name, handle, guild_tag, completed_quests_count, current_xp, badges')
          .order('completed_quests_count', { ascending: false })
          .order('current_xp', { ascending: false })
          .limit(50);

        // 2. Guild Leaderboard from public.guilds
        const { data: guildsData } = await supabase
          .from('guilds')
          .select('id, name, tag, weekly_xp, current_xp, campus_rank')
          .order('weekly_xp', { ascending: false })
          .order('current_xp', { ascending: false });

        if (profilesData && !pErr) {
          const soloList = profilesData.map((p, idx) => ({
            rank: idx + 1,
            id: p.id,
            name: p.name,
            guildTag: p.guild_tag || 'NONE',
            completionTimeFormatted: (p.completed_quests_count || 0) > 0 ? `${p.completed_quests_count} Quests Solved` : 'Induction Stage',
            score: p.current_xp || 0,
            badgesCount: Array.isArray(p.badges) ? p.badges.length : 0,
            isCurrentPlayer: currentUserId ? p.id === currentUserId : false
          }));

          const guildList = (guildsData || []).map((g, idx) => ({
            rank: idx + 1,
            id: g.id,
            name: g.name,
            guildTag: g.tag,
            score: g.weekly_xp || 0,
            isCurrentPlayer: false
          }));

          return {
            weeklySolo: soloList,
            guildDominion: guildList
          };
        }
      } catch (err) {
        console.warn('Supabase fetch leaderboard error:', err);
      }
    }

    return {
      weeklySolo: [],
      guildDominion: []
    };
  }
};
