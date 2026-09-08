// Type definitions for Sidequest Society (SideQ)

export type StopStatus = 'completed' | 'active' | 'locked';
export type CheckInMethod = 'gps' | 'qr' | 'both';

export interface Coordinates {
  lat: number;
  lng: number;
  campusX: number; // Percent on custom campus map (0-100)
  campusY: number; // Percent on custom campus map (0-100)
}

export interface QuestStop {
  id: string;
  stopNumber: number;
  title: string;
  locationName: string;
  metaphoricRiddle: string;
  storyLoreUnlock: string;
  historicalNote?: string;
  status: StopStatus;
  unlockMethod: CheckInMethod;
  targetCoords: Coordinates;
  qrPayload: string;
  xpReward: number;
  unlockedAt?: string;
}

export interface Quest {
  id: string;
  title: string;
  episode: string;
  weekNumber: number;
  theme: string;
  narrativeIntro: string;
  resolutionNarrative: string;
  stops: QuestStop[];
  totalXp: number;
  activeStopIndex: number;
  isCompleted: boolean;
  publishedAt: string;
  expiresAt: string;
}

export type GuildRole = 'Grandmaster' | 'Officer' | 'Chronicler' | 'Scout' | 'Initiate';

export interface GuildMember {
  id: string;
  name: string;
  handle: string;
  avatarSeed: string;
  role: GuildRole;
  level: number;
  title: string;
  weeklyXpContributed: number;
  questsCompleted: number;
  isOnline: boolean;
  statusMessage?: string;
}

export interface GuildPerk {
  id: string;
  tier: number;
  title: string;
  description: string;
  levelRequired: number;
  isUnlocked: boolean;
  icon: string;
}

export interface GuildMiniChallenge {
  id: string;
  title: string;
  description: string;
  rewardGuildXp: number;
  progress: number;
  total: number;
  expiresInHours: number;
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  motto: string;
  description: string;
  crestId: 'owl' | 'gear' | 'willow' | 'flask' | 'astrolabe' | 'serpent';
  bannerGradient: string;
  accentColor: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  memberCount: number;
  maxMembers: number;
  campusRank: number;
  weeklyXp: number;
  allTimeXp: number;
  recruitmentVibe: string;
  recruitmentTags: string[];
  isOpen: boolean;
  members: GuildMember[];
  perks: GuildPerk[];
  activeChallenge?: GuildMiniChallenge;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Novice' | 'Arcane' | 'Master' | 'Legendary';
  unlockedDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email?: string;
  isAdmin?: boolean;
  title: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  guildId?: string;
  guildName?: string;
  guildTag?: string;
  guildRole?: GuildRole | string;
  completedQuestsCount: number;
  locationsDiscovered: number;
  currentStreakDays: number;
  badges: Badge[];
}

export interface CampusLandmark {
  id: string;
  name: string;
  code: string;
  campusX: number;
  campusY: number;
  category: 'Library' | 'Tower' | 'Conservatory' | 'Observatory' | 'Archway' | 'Sanctum';
  isDiscovered: boolean;
  loreSnippet: string;
  activeClueForStop?: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  guildTag?: string;
  guildName?: string;
  completionTimeFormatted?: string;
  score: number;
  badgesCount?: number;
  isCurrentPlayer?: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: 'campus-general' | 'guild-private';
  senderId: string;
  senderName: string;
  senderHandle: string;
  senderRole?: GuildRole;
  senderTitle?: string;
  guildTag?: string;
  text: string;
  timestamp: string;
  isSystemEvent?: boolean;
}
