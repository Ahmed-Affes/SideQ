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

-- 6. CHAT MESSAGES TABLE (Realtime Enabled)
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
-- SEED INITIAL DATA FOR SIDEQUEST SOCIETY (WEEK 7)
-- ==============================================================================

INSERT INTO public.quests (id, title, episode, week_number, theme, narrative_intro, resolution_narrative, total_xp, published_at, expires_at)
VALUES (
  'quest-week-07',
  'The Whispering Obelisk',
  'Week 7 • Chapter III',
  7,
  'Ancient Campus Mystery',
  'Long before modern lecture halls cast shadows across the Great Quadrangle, founders of the Whispering Society inscribed four cryptic sigils upon campus bedrock. When the equinox winds rise, the keystones hum in harmony. Only scholars who unravel the four riddles can awaken the dormant obelisk before the Sunday bell tolls.',
  'As the final keystone aligns beneath the Whispering Arches, the stone pedestal sinks three inches into the earth, revealing the parchment archives of 1888. You have proven yourself a Master Chronicler of the Society.',
  950,
  'Monday, 09:00 AM',
  'Sunday, 11:59 PM'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quest_stops (id, quest_id, stop_number, title, location_name, metaphoric_riddle, story_lore_unlock, historical_note, campus_x, campus_y, qr_payload, xp_reward)
VALUES 
(
  'stop-01',
  'quest-week-07',
  1,
  'The Vault of Still Thought',
  'Cathedral Library Archives (East Wing)',
  'Where silence is law and ten thousand minds wander unbound beneath leaded vaults of stained glass, seek the stone corbel etched with an unblinking owl above the microfiche alcove.',
  'Behind the carved oaken plinth of 1904, a brass cylinder yields the first transcription. The society noted: "Light reveals what shadows protect."',
  'Constructed in 1895, the East Wing houses over 12,000 rare collegiate folios.',
  28, 66,
  'SIDEQ:LIB:OWL1904',
  150
),
(
  'stop-02',
  'quest-week-07',
  2,
  'The Bronze Heartbeat',
  'Founders Clock Tower & Bell Gables',
  'Where a heavy bronze pendulum measures the silent mortality of scholars, look where the gargoyle’s noon shadow falls upon weathered granite steps.',
  'A brass plate set into the foundation clicks downward under gentle pressure. A secret cylinder turns, revealing the next verse pointing toward the glass palace.',
  'The four clock faces were cast in England in 1891 and chimed for the first graduating class.',
  53, 34,
  'SIDEQ:CLOCK:BELL1891',
  200
),
(
  'stop-03',
  'quest-week-07',
  3,
  'The Glass Solarium',
  'Victorian Botanical Conservatory',
  'Where curved iron ribs cage perpetual summer, and ancient night-blooming cereus drinks filtered starlight amidst damp emerald shadows.',
  'Beneath the humid moss of the koi basin, the third brass sigil surfaces with the compass bearing of the sunken arches.',
  'Donated in 1912, it shelters over 800 tropical specimens collected on expedition.',
  76, 52,
  'SIDEQ:GREENHOUSE:CEREUS1912',
  250
),
(
  'stop-04',
  'quest-week-07',
  4,
  'The Threshold of Echoes',
  'The Whispering Arches (Sunken Court)',
  'Where curved red-brick walls carry a whispered confession across fifty paces, as crisp as if spoken directly into the listener’s ear.',
  'The center stone rotates, completing the circle of the Whispering Society and releasing the Grand Chapter reward.',
  'Built as an acoustic marvel by early physics faculty in 1924.',
  47, 82,
  'SIDEQ:ARCH:ACOUSTIC1924',
  350
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.guilds (id, name, tag, motto, description, crest_id, banner_gradient, level, current_xp, next_level_xp, member_count, max_members, campus_rank, weekly_xp, all_time_xp, recruitment_vibe, recruitment_tags)
VALUES 
(
  'guild-chronos',
  'Chronos Keepers',
  'CHRONO',
  'By the Second, By the Solstice',
  'Relentless quest solvers, clockwork navigators, and riddle speedrunners. We hold 4 weekly speed records.',
  'gear',
  'linear-gradient(135deg, #1e293b 0%, #312e81 50%, #0f172a 100%)',
  4, 4850, 6000, 22, 25, 3, 1840, 28450,
  'Speedrunners & Cryptographers',
  '["Speedrunners", "Midnight Raids", "Active Voice"]'::jsonb
),
(
  'guild-owls',
  'Order of the Arcane Owls',
  'OWLS',
  'In Shadows, Truth Glides Unseen',
  'The oldest society on campus. Masters of ancient Latin inscriptions, archival digging, and rare manuscripts.',
  'owl',
  'linear-gradient(135deg, #091e3a 0%, #1e1b4b 60%, #030712 100%)',
  6, 8120, 10000, 28, 30, 1, 2940, 42300,
  'Lore Masters & Latin Scholars',
  '["Deep Lore", "Archive Geeks", "Relaxed Pace"]'::jsonb
),
(
  'guild-sunken',
  'Sunken Garden Society',
  'MOSS',
  'Beneath the Ivy, Rooted Deep',
  'Explorers of hidden courtyards, subterranean steam tunnels, and twilight quad walks.',
  'willow',
  'linear-gradient(135deg, #062817 0%, #064e3b 50%, #022c22 100%)',
  5, 6200, 7500, 24, 25, 2, 2410, 35100,
  'Nature Walks & Night Explorers',
  '["Chill Vibe", "Photography", "Night Explorers"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

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
    'guild-chronos',
    'Chronos Keepers',
    'CHRONO',
    'Scout',
    0,
    0,
    1,
    '[{"id":"badge-initiate","name":"The Maiden Seal","description":"Enrolled into the Sidequest Society.","icon":"Compass","rarity":"Novice","unlockedDate":"Today"}]'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
