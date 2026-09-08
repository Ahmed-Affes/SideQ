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
      return {
        data: null,
        profile: null,
        error: 'Supabase database is not connected. Please configure your Supabase Project URL and Anon Key to register real accounts.'
      };
    }

    const cleanEmail = email.trim();
    const cleanName = name.trim() || 'Scholar Initiate';
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;

    // Real Supabase Auth SignUp
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          handle: cleanHandle
        }
      }
    });

    if (error) {
      return { data: null, profile: null, error: error.message };
    }

    if (data.user) {
      // Create initial profile in public.profiles table
      const newProfile: UserProfile = {
        id: data.user.id,
        name: cleanName,
        handle: cleanHandle,
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
      return {
        data: null,
        profile: null,
        error: 'Supabase database is not connected. Please connect your Supabase project in the setup box to log in to real accounts.'
      };
    }

    const cleanEmail = email.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      return { data: null, profile: null, error: error.message };
    }

    if (data.user) {
      // Fetch user profile from Supabase
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      let profile: UserProfile;
      if (profileData && !profileErr) {
        profile = {
          id: profileData.id,
          name: profileData.name,
          handle: profileData.handle,
          title: profileData.title || 'Novice Initiate',
          level: profileData.level || 1,
          currentXp: profileData.current_xp || 0,
          nextLevelXp: profileData.next_level_xp || 1000,
          guildId: profileData.guild_id || 'guild-chronos',
          guildName: profileData.guild_name || 'Chronos Keepers',
          guildTag: profileData.guild_tag || 'CHRONO',
          guildRole: profileData.guild_role || 'Scout',
          completedQuestsCount: profileData.completed_quests_count || 0,
          locationsDiscovered: profileData.locations_discovered || 0,
          currentStreakDays: profileData.current_streak_days || 1,
          badges: profileData.badges || []
        };
      } else {
        // Create initial profile if first login
        profile = {
          id: data.user.id,
          name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
          handle: data.user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`,
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
            guild_role: profile.guildRole,
            completed_quests_count: 0,
            locations_discovered: 0,
            current_streak_days: 1,
            badges: profile.badges
          });
        } catch (insertErr) {
          console.warn('Profile insert warning:', insertErr);
        }
      }

      localStorage.setItem('sideq_user_profile', JSON.stringify(profile));
      return { data, profile, error: null };
    }

    return { data, profile: null, error: 'User session could not be established.' };
  },

  // Get Current Session and Profile
  async getCurrentUser(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) {
      // Clear out any old fake/mock cache from prior testing
      localStorage.removeItem('sideq_user_profile');
      localStorage.removeItem('sideq_session');
      return null;
    }

    try {
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr || !session?.user) {
        localStorage.removeItem('sideq_user_profile');
        localStorage.removeItem('sideq_session');
        return null;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        const profile: UserProfile = {
          id: profileData.id,
          name: profileData.name,
          handle: profileData.handle,
          title: profileData.title || 'Novice Initiate',
          level: profileData.level || 1,
          currentXp: profileData.current_xp || 0,
          nextLevelXp: profileData.next_level_xp || 1000,
          guildId: profileData.guild_id || 'guild-chronos',
          guildName: profileData.guild_name || 'Chronos Keepers',
          guildTag: profileData.guild_tag || 'CHRONO',
          guildRole: profileData.guild_role || 'Scout',
          completedQuestsCount: profileData.completed_quests_count || 0,
          locationsDiscovered: profileData.locations_discovered || 0,
          currentStreakDays: profileData.current_streak_days || 1,
          badges: profileData.badges || []
        };
        localStorage.setItem('sideq_user_profile', JSON.stringify(profile));
        return profile;
      }
    } catch (err) {
      console.warn('Session fetch error:', err);
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
