-- ==============================================================================
-- Sidequest Society (SideQ) - Supabase Database Schema & Realtime Setup
-- Copy and run this script inside your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  title TEXT DEFAULT 'Apprentice Cryptographer',
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  next_level_xp INTEGER DEFAULT 1000,
  guild_id TEXT,
  guild_name TEXT,
  guild_tag TEXT,
  guild_role TEXT DEFAULT 'Scout',
  completed_quests_count INTEGER DEFAULT 0,
  locations_discovered INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. GUILDS TABLE
CREATE TABLE IF NOT EXISTS public.guilds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  motto TEXT,
  description TEXT,
  crest_id TEXT DEFAULT 'gear',
  banner_gradient TEXT,
  accent_color TEXT DEFAULT '#E5C07B',
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  next_level_xp INTEGER DEFAULT 2000,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 25,
  campus_rank INTEGER DEFAULT 1,
  weekly_xp INTEGER DEFAULT 0,
  all_time_xp INTEGER DEFAULT 0,
  recruitment_vibe TEXT,
  recruitment_tags JSONB DEFAULT '[]'::jsonb,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. QUESTS TABLE
CREATE TABLE IF NOT EXISTS public.quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  episode TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  theme TEXT NOT NULL,
  narrative_intro TEXT NOT NULL,
  resolution_narrative TEXT,
  total_xp INTEGER DEFAULT 950,
  published_at TEXT,
  expires_at TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. QUEST STOPS TABLE
CREATE TABLE IF NOT EXISTS public.quest_stops (
  id TEXT PRIMARY KEY,
  quest_id TEXT REFERENCES public.quests(id) ON DELETE CASCADE,
  stop_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  location_name TEXT NOT NULL,
  metaphoric_riddle TEXT NOT NULL,
  story_lore_unlock TEXT NOT NULL,
  historical_note TEXT,
  unlock_method TEXT DEFAULT 'both',
  target_lat DOUBLE PRECISION,
  target_lng DOUBLE PRECISION,
  campus_x INTEGER NOT NULL,
  campus_y INTEGER NOT NULL,
  qr_payload TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 150
);

-- 5. USER QUEST PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_quest_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  quest_id TEXT REFERENCES public.quests(id) ON DELETE CASCADE,
  active_stop_index INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_stops JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. GUILD MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.guild_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  guild_id TEXT REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Scout',
  weekly_xp INTEGER DEFAULT 0,
  quests_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(guild_id, user_id)
);

-- 7. CHAT MESSAGES TABLE (Realtime Enabled)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL, -- 'campus-general' or 'guild-private'
  guild_id TEXT,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_handle TEXT NOT NULL,
  sender_role TEXT,
  sender_title TEXT,
  guild_tag TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to game content
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public read guilds" ON public.guilds FOR SELECT USING (true);
CREATE POLICY "Public insert guilds" ON public.guilds FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update guilds" ON public.guilds FOR UPDATE USING (true);

CREATE POLICY "Public read guild members" ON public.guild_members FOR SELECT USING (true);
CREATE POLICY "Public write guild members" ON public.guild_members FOR ALL USING (true);

CREATE POLICY "Public read quests" ON public.quests FOR SELECT USING (true);
CREATE POLICY "Public read quest stops" ON public.quest_stops FOR SELECT USING (true);

CREATE POLICY "Public read progress" ON public.user_quest_progress FOR SELECT USING (true);
CREATE POLICY "Public write progress" ON public.user_quest_progress FOR ALL USING (true);

CREATE POLICY "Public read chat" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public insert chat" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION FOR LIVE CHAT & PROGRESS
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_quest_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guilds;

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SUPABASE AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    handle,
    title,
    level,
    current_xp,
    next_level_xp,
    guild_id,
    guild_name,
    guild_tag,
    guild_role,
    completed_quests_count,
    locations_discovered,
    current_streak_days,
    badges
  )
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'handle', '@' || split_part(NEW.email, '@', 1)),
    'Novice Initiate',
    1,
    0,
    1000,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    0,
    1,
    '[]'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

