import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile } from '../types';

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

export const authService = {
  // Sign Up with Email, Password, Name, and Handle
  async signUp(email: string, password: string, name: string, handle: string) {
    if (!isSupabaseConfigured()) {
      // Local fallback account
      const demoId = `user-${Date.now()}`;
      const newProfile: UserProfile = {
        id: demoId,
        name: name || 'New Scholar',
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        title: 'Novice Initiate',
        level: 1,
        currentXp: 0,
        nextLevelXp: 1000,
        guildId: 'guild-chronos',
        guildName: 'Chronos Keepers',
        guildTag: 'CHRONO',
        guildRole: 'Scout',
        completedQuestsCount: 0,
        locationsDiscovered: 0,
        currentStreakDays: 1,
        badges: [
          {
            id: 'badge-initiate',
            name: 'The Maiden Seal',
            description: 'Enrolled into the Sidequest Society.',
            icon: 'Compass',
            rarity: 'Novice',
            unlockedDate: 'Today'
          }
        ]
      };
      localStorage.setItem('sideq_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('sideq_session', JSON.stringify({ user: { id: demoId, email } }));
      return { data: { user: { id: demoId, email } }, profile: newProfile, error: null };
    }

    // Real Supabase Auth SignUp
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          handle: handle.startsWith('@') ? handle : `@${handle}`
        }
      }
    });

    if (error) {
      return { data: null, profile: null, error: error.message };
    }

    if (data.user) {
      // Create or upsert profile in public.profiles table
      const newProfile: UserProfile = {
        id: data.user.id,
        name: name || 'New Scholar',
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        title: 'Novice Initiate',
        level: 1,
        currentXp: 0,
        nextLevelXp: 1000,
        guildId: 'guild-chronos',
        guildName: 'Chronos Keepers',
        guildTag: 'CHRONO',
        guildRole: 'Scout',
        completedQuestsCount: 0,
        locationsDiscovered: 0,
        currentStreakDays: 1,
        badges: [
          {
            id: 'badge-initiate',
            name: 'The Maiden Seal',
            description: 'Enrolled into the Sidequest Society.',
            icon: 'Compass',
            rarity: 'Novice',
            unlockedDate: 'Today'
          }
        ]
      };

      try {
        await supabase.from('profiles').upsert({
          id: newProfile.id,
          name: newProfile.name,
          handle: newProfile.handle,
          title: newProfile.title,
          level: newProfile.level,
          current_xp: newProfile.currentXp,
          next_level_xp: newProfile.nextLevelXp,
          guild_id: newProfile.guildId,
          guild_name: newProfile.guildName,
          guild_tag: newProfile.guildTag,
          guild_role: newProfile.guildRole,
          completed_quests_count: newProfile.completedQuestsCount,
          locations_discovered: newProfile.locationsDiscovered,
          current_streak_days: newProfile.currentStreakDays,
          badges: newProfile.badges,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Profile upsert warning:', err);
      }

      localStorage.setItem('sideq_user_profile', JSON.stringify(newProfile));
      return { data, profile: newProfile, error: null };
    }

    return { data, profile: null, error: null };
  },

  // Sign In with Email & Password
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      const demoId = `user-demo`;
      const profile: UserProfile = {
        id: demoId,
        name: email.split('@')[0] || 'Scholar',
        handle: `@${email.split('@')[0]}`,
        title: 'Apprentice Cryptographer',
        level: 2,
        currentXp: 450,
        nextLevelXp: 1200,
        guildId: 'guild-chronos',
        guildName: 'Chronos Keepers',
        guildTag: 'CHRONO',
        guildRole: 'Scout',
        completedQuestsCount: 1,
        locationsDiscovered: 3,
        currentStreakDays: 2,
        badges: []
      };
      localStorage.setItem('sideq_user_profile', JSON.stringify(profile));
      localStorage.setItem('sideq_session', JSON.stringify({ user: { id: demoId, email } }));
      return { data: { user: { id: demoId, email } }, profile, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { data: null, profile: null, error: error.message };
    }

    if (data.user) {
      // Fetch user profile from Supabase
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      let profile: UserProfile;
      if (profileData) {
        profile = {
          id: profileData.id,
          name: profileData.name,
          handle: profileData.handle,
          title: profileData.title,
          level: profileData.level,
          currentXp: profileData.current_xp,
          nextLevelXp: profileData.next_level_xp,
          guildId: profileData.guild_id,
          guildName: profileData.guild_name,
          guildTag: profileData.guild_tag,
          guildRole: profileData.guild_role,
          completedQuestsCount: profileData.completed_quests_count,
          locationsDiscovered: profileData.locations_discovered,
          currentStreakDays: profileData.current_streak_days,
          badges: profileData.badges || []
        };
      } else {
        // Create initial profile if first login
        profile = {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split('@')[0],
          handle: data.user.user_metadata?.handle || `@${email.split('@')[0]}`,
          title: 'Novice Initiate',
          level: 1,
          currentXp: 0,
          nextLevelXp: 1000,
          guildId: 'guild-chronos',
          guildName: 'Chronos Keepers',
          guildTag: 'CHRONO',
          guildRole: 'Scout',
          completedQuestsCount: 0,
          locationsDiscovered: 0,
          currentStreakDays: 1,
          badges: []
        };

        await supabase.from('profiles').insert({
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
          guild_role: profile.guildRole
        });
      }

      localStorage.setItem('sideq_user_profile', JSON.stringify(profile));
      return { data, profile, error: null };
    }

    return { data, profile: null, error: null };
  },

  // Fast 1-Tap Guest / Field Initiate Demo Login
  async signInDemo() {
    const demoId = `scholar-${Math.floor(1000 + Math.random() * 9000)}`;
    const profile: UserProfile = {
      id: demoId,
      name: 'Rowan Vance',
      handle: '@rvance',
      title: 'Apprentice Cryptographer',
      level: 7,
      currentXp: 1850,
      nextLevelXp: 2400,
      guildId: 'guild-chronos',
      guildName: 'Chronos Keepers',
      guildTag: 'CHRONO',
      guildRole: 'Officer',
      completedQuestsCount: 6,
      locationsDiscovered: 14,
      currentStreakDays: 5,
      badges: [
        {
          id: 'badge-night-owl',
          name: 'Night Inquirer',
          description: 'Checked into a campus stop past 10:00 PM under moonlight.',
          icon: 'Moon',
          rarity: 'Arcane',
          unlockedDate: 'Oct 12'
        },
        {
          id: 'badge-clockwork',
          name: 'Chronometer',
          description: 'Solved a riddle chain in under 45 minutes.',
          icon: 'Clock',
          rarity: 'Master',
          unlockedDate: 'Oct 19'
        }
      ]
    };

    localStorage.setItem('sideq_user_profile', JSON.stringify(profile));
    localStorage.setItem('sideq_session', JSON.stringify({ user: { id: demoId, email: 'rowan@sideq.edu' } }));
    return { profile, error: null };
  },

  // Get Current Session and Profile
  async getCurrentUser(): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            return {
              id: profileData.id,
              name: profileData.name,
              handle: profileData.handle,
              title: profileData.title,
              level: profileData.level,
              currentXp: profileData.current_xp,
              nextLevelXp: profileData.next_level_xp,
              guildId: profileData.guild_id,
              guildName: profileData.guild_name,
              guildTag: profileData.guild_tag,
              guildRole: profileData.guild_role,
              completedQuestsCount: profileData.completed_quests_count,
              locationsDiscovered: profileData.locations_discovered,
              currentStreakDays: profileData.current_streak_days,
              badges: profileData.badges || []
            };
          }
        }
      } catch (err) {
        console.warn('Session fetch error:', err);
      }
    }

    // Check local storage session
    const cached = localStorage.getItem('sideq_user_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return null;
  },

  // Sign Out
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    localStorage.removeItem('sideq_user_profile');
    localStorage.removeItem('sideq_session');
  }
};
