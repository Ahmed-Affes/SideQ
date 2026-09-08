import type { Quest, Guild, UserProfile, CampusLandmark, LeaderboardEntry, ChatMessage } from '../types';

export const initialWeeklyQuest: Quest = {
  id: 'quest-week-07',
  title: 'The Whispering Obelisk',
  episode: 'Week 7 • Chapter III',
  weekNumber: 7,
  theme: 'Ancient Campus Mystery',
  narrativeIntro: 
    'Long before modern lecture halls cast shadows across the Great Quadrangle, founders of the Whispering Society inscribed four cryptic sigils upon campus bedrock. When the equinox winds rise, the keystones hum in harmony. Only scholars who unravel the four riddles can awaken the dormant obelisk before the Sunday bell tolls.',
  resolutionNarrative:
    'As the final keystone aligns beneath the Whispering Arches, the stone pedestal sinks three inches into the earth, revealing the parchment archives of 1888. You have proven yourself a Master Chronicler of the Society.',
  activeStopIndex: 1, // Stop 2 is currently active
  totalXp: 950,
  isCompleted: false,
  publishedAt: 'Monday, 09:00 AM',
  expiresAt: 'Sunday, 11:59 PM',
  stops: [
    {
      id: 'stop-01',
      stopNumber: 1,
      title: 'The Vault of Still Thought',
      locationName: 'Cathedral Library Archives (East Wing)',
      metaphoricRiddle:
        'Where silence is law and ten thousand minds wander unbound beneath leaded vaults of stained glass, seek the stone corbel etched with an unblinking owl above the microfiche alcove.',
      storyLoreUnlock:
        'Behind the carved oaken plinth of 1904, a brass cylinder yields the first transcription. The society noted: "Light reveals what shadows protect."',
      historicalNote: 'Constructed in 1895, the East Wing houses over 12,000 rare collegiate folios.',
      status: 'completed',
      unlockMethod: 'both',
      targetCoords: { lat: 42.3601, lng: -71.0942, campusX: 28, campusY: 66 },
      qrPayload: 'SIDEQ:LIB:OWL1904',
      xpReward: 150,
      unlockedAt: 'Yesterday at 3:42 PM'
    },
    {
      id: 'stop-02',
      stopNumber: 2,
      title: 'The Bronze Heartbeat',
      locationName: 'Founders Clock Tower & Bell Gables',
      metaphoricRiddle:
        'Where a heavy bronze pendulum measures the silent mortality of scholars, look where the gargoyle’s noon shadow falls upon weathered granite steps.',
      storyLoreUnlock:
        'A brass plate set into the foundation clicks downward under gentle pressure. A secret cylinder turns, revealing the next verse pointing toward the glass palace.',
      historicalNote: 'The four clock faces were cast in England in 1891 and chimed for the first graduating class.',
      status: 'active',
      unlockMethod: 'both',
      targetCoords: { lat: 42.3615, lng: -71.0928, campusX: 53, campusY: 34 },
      qrPayload: 'SIDEQ:CLOCK:BELL1891',
      xpReward: 200
    },
    {
      id: 'stop-03',
      stopNumber: 3,
      title: 'The Glass Solarium',
      locationName: 'Victorian Botanical Conservatory',
      metaphoricRiddle:
        'Where curved iron ribs cage perpetual summer, and ancient night-blooming cereus drinks filtered starlight amidst damp emerald shadows.',
      storyLoreUnlock:
        'Beneath the humid moss of the koi basin, the third brass sigil surfaces with the compass bearing of the sunken arches.',
      historicalNote: 'Donated in 1912, it shelters over 800 tropical specimens collected on expedition.',
      status: 'locked',
      unlockMethod: 'both',
      targetCoords: { lat: 42.3628, lng: -71.0905, campusX: 76, campusY: 52 },
      qrPayload: 'SIDEQ:GREENHOUSE:CEREUS1912',
      xpReward: 250
    },
    {
      id: 'stop-04',
      stopNumber: 4,
      title: 'The Threshold of Echoes',
      locationName: 'The Whispering Arches (Sunken Court)',
      metaphoricRiddle:
        'Where curved red-brick walls carry a whispered confession across fifty paces, as crisp as if spoken directly into the listener’s ear.',
      storyLoreUnlock:
        'The center stone rotates, completing the circle of the Whispering Society and releasing the Grand Chapter reward.',
      historicalNote: 'Built as an acoustic marvel by early physics faculty in 1924.',
      status: 'locked',
      unlockMethod: 'both',
      targetCoords: { lat: 42.3592, lng: -71.0912, campusX: 47, campusY: 82 },
      qrPayload: 'SIDEQ:ARCH:ACOUSTIC1924',
      xpReward: 350
    }
  ]
};

export const campusLandmarks: CampusLandmark[] = [
  {
    id: 'lm-clocktower',
    name: 'Founders Clock Tower',
    code: 'TWR-01',
    campusX: 53,
    campusY: 34,
    category: 'Tower',
    isDiscovered: true,
    loreSnippet: 'Erected 1891. The brass pendulum swings 12 times per minute and marks the center meridian of campus.',
    activeClueForStop: 2
  },
  {
    id: 'lm-library',
    name: 'Cathedral Library Archives',
    code: 'LIB-04',
    campusX: 28,
    campusY: 66,
    category: 'Library',
    isDiscovered: true,
    loreSnippet: 'Vaulted reading room with stained-glass depictions of ancient philosophers and secret study carrels.',
    activeClueForStop: 1
  },
  {
    id: 'lm-conservatory',
    name: 'Victorian Conservatory',
    code: 'GRN-02',
    campusX: 76,
    campusY: 52,
    category: 'Conservatory',
    isDiscovered: false,
    loreSnippet: 'Perpetual summer beneath Victorian wrought-iron vaults. Fragrant with jasmine and damp earth.',
    activeClueForStop: 3
  },
  {
    id: 'lm-arches',
    name: 'The Whispering Arches',
    code: 'ARC-09',
    campusX: 47,
    campusY: 82,
    category: 'Archway',
    isDiscovered: false,
    loreSnippet: 'Acoustic anomaly courtyard where low murmurs travel across parabolic brickwork.',
    activeClueForStop: 4
  },
  {
    id: 'lm-observatory',
    name: 'Old North Observatory',
    code: 'OBS-03',
    campusX: 22,
    campusY: 22,
    category: 'Observatory',
    isDiscovered: true,
    loreSnippet: 'Houses the 1884 refractor telescope once used to map celestial occultations.'
  },
  {
    id: 'lm-hall',
    name: 'Great Quadrangle & Seal',
    code: 'QUD-00',
    campusX: 50,
    campusY: 56,
    category: 'Sanctum',
    isDiscovered: true,
    loreSnippet: 'The heart of campus. Legend says stepping upon the bronze crest before graduation brings ill fortune.'
  }
];

export const initialGuilds: Guild[] = [
  {
    id: 'guild-chronos',
    name: 'Chronos Keepers',
    tag: 'CHRONO',
    motto: 'By the Second, By the Solstice',
    description: 'Relentless quest solvers, clockwork navigators, and riddle speedrunners. We hold 4 weekly speed records.',
    crestId: 'gear',
    bannerGradient: 'linear-gradient(135deg, #1e293b 0%, #312e81 50%, #0f172a 100%)',
    accentColor: '#e5c07b',
    level: 4,
    currentXp: 4850,
    nextLevelXp: 6000,
    memberCount: 22,
    maxMembers: 25,
    campusRank: 3,
    weeklyXp: 1840,
    allTimeXp: 28450,
    recruitmentVibe: 'Speedrunners & Cryptographers',
    recruitmentTags: ['Speedrunners', 'Midnight Raids', 'Active Voice'],
    isOpen: true,
    activeChallenge: {
      id: 'mc-01',
      title: 'Synchronized Belltower Sprint',
      description: 'Three members check in at the Clock Tower within 15 minutes of each other.',
      rewardGuildXp: 400,
      progress: 2,
      total: 3,
      expiresInHours: 9
    },
    perks: [
      {
        id: 'perk-01',
        tier: 1,
        title: 'Guild Sigil & Gilded Crest',
        description: 'Members wear the bronze astrolabe badge next to their campus name.',
        levelRequired: 1,
        isUnlocked: true,
        icon: 'Shield'
      },
      {
        id: 'perk-02',
        tier: 2,
        title: 'War Room Night Mode & Channels',
        description: 'Private encrypted guild chat channel with custom soundboard & clue logs.',
        levelRequired: 2,
        isUnlocked: true,
        icon: 'MessageSquare'
      },
      {
        id: 'perk-03',
        tier: 3,
        title: 'Internal Mini-Challenges',
        description: 'Officers can post custom daily campus scavenger tasks for bonus guild XP.',
        levelRequired: 3,
        isUnlocked: true,
        icon: 'Trophy'
      },
      {
        id: 'perk-04',
        tier: 4,
        title: 'Custom Guild Banner Motif',
        description: 'Bespoke celestial border styling on player profile cards across campus.',
        levelRequired: 4,
        isUnlocked: true,
        icon: 'Award'
      },
      {
        id: 'perk-05',
        tier: 5,
        title: 'Guild Radar Beacon',
        description: 'See live guildmate proximity pulses on the campus minimap during active quests.',
        levelRequired: 5,
        isUnlocked: false,
        icon: 'Radio'
      }
    ],
    members: [
      {
        id: 'user-01',
        name: 'Rowan Vance',
        handle: '@rvance',
        avatarSeed: 'rowan',
        role: 'Officer',
        level: 7,
        title: 'Apprentice Cryptographer',
        weeklyXpContributed: 350,
        questsCompleted: 6,
        isOnline: true,
        statusMessage: 'Camping by Founders Tower steps'
      },
      {
        id: 'user-02',
        name: 'Elena Rostova',
        handle: '@rostova_e',
        avatarSeed: 'elena',
        role: 'Grandmaster',
        level: 11,
        title: 'Keeper of the Meridian',
        weeklyXpContributed: 520,
        questsCompleted: 14,
        isOnline: true,
        statusMessage: 'Decoded Stop 2 riddle!'
      },
      {
        id: 'user-03',
        name: 'Kai Chen',
        handle: '@kaichen_x',
        avatarSeed: 'kai',
        role: 'Officer',
        level: 9,
        title: 'Vault Scout',
        weeklyXpContributed: 410,
        questsCompleted: 10,
        isOnline: false,
        statusMessage: 'In physics lab until 6pm'
      },
      {
        id: 'user-04',
        name: 'Aria Thorne',
        handle: '@thorne_aria',
        avatarSeed: 'aria',
        role: 'Chronicler',
        level: 8,
        title: 'Archivist of Shadows',
        weeklyXpContributed: 290,
        questsCompleted: 8,
        isOnline: true,
        statusMessage: 'Sketching the gargoyle corbels'
      },
      {
        id: 'user-05',
        name: 'Mateo Morales',
        handle: '@mateo_m',
        avatarSeed: 'mateo',
        role: 'Scout',
        level: 6,
        title: 'Night Pathfinder',
        weeklyXpContributed: 270,
        questsCompleted: 5,
        isOnline: false,
        statusMessage: 'Hunting QR markers'
      }
    ]
  },
  {
    id: 'guild-owls',
    name: 'Order of the Arcane Owls',
    tag: 'OWLS',
    motto: 'In Shadows, Truth Glides Unseen',
    description: 'The oldest society on campus. Masters of ancient Latin inscriptions, archival digging, and rare manuscripts.',
    crestId: 'owl',
    bannerGradient: 'linear-gradient(135deg, #091e3a 0%, #1e1b4b 60%, #030712 100%)',
    accentColor: '#38bdf8',
    level: 6,
    currentXp: 8120,
    nextLevelXp: 10000,
    memberCount: 28,
    maxMembers: 30,
    campusRank: 1,
    weeklyXp: 2940,
    allTimeXp: 42300,
    recruitmentVibe: 'Lore Masters & Latin Scholars',
    recruitmentTags: ['Deep Lore', 'Archive Geeks', 'Relaxed Pace'],
    isOpen: true,
    perks: [],
    members: []
  },
  {
    id: 'guild-sunken',
    name: 'Sunken Garden Society',
    tag: 'MOSS',
    motto: 'Beneath the Ivy, Rooted Deep',
    description: 'Explorers of hidden courtyards, subterranean steam tunnels, and twilight quad walks.',
    crestId: 'willow',
    bannerGradient: 'linear-gradient(135deg, #062817 0%, #064e3b 50%, #022c22 100%)',
    accentColor: '#10b981',
    level: 5,
    currentXp: 6200,
    nextLevelXp: 7500,
    memberCount: 24,
    maxMembers: 25,
    campusRank: 2,
    weeklyXp: 2410,
    allTimeXp: 35100,
    recruitmentVibe: 'Nature Walks & Night Explorers',
    recruitmentTags: ['Chill Vibe', 'Photography', 'Night Explorers'],
    isOpen: true,
    perks: [],
    members: []
  },
  {
    id: 'guild-alchemy',
    name: 'The Alchemical Union',
    tag: 'ALCH',
    motto: 'Solve the Lead, Transmute the Gold',
    description: 'STEM & Humanities crossover guild. We treat every quest clue like an experimental reaction.',
    crestId: 'flask',
    bannerGradient: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #180224 100%)',
    accentColor: '#c084fc',
    level: 3,
    currentXp: 3400,
    nextLevelXp: 4500,
    memberCount: 16,
    maxMembers: 20,
    campusRank: 4,
    weeklyXp: 1250,
    allTimeXp: 19800,
    recruitmentVibe: 'Puzzle Solvers & Coffee Lovers',
    recruitmentTags: ['Puzzle Addicts', 'STEM & Arts', 'Weekend Squad'],
    isOpen: true,
    perks: [],
    members: []
  }
];

export const initialUserProfile: UserProfile = {
  id: 'user-01',
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
    },
    {
      id: 'badge-first-step',
      name: 'The Initiate Seal',
      description: 'Completed your maiden weekly story quest on campus.',
      icon: 'Compass',
      rarity: 'Novice',
      unlockedDate: 'Sep 28'
    },
    {
      id: 'badge-gargoyle',
      name: 'Stone Gaze',
      description: 'Found all 3 architectural gargoyles in the North Courtyard.',
      icon: 'Eye',
      rarity: 'Arcane',
      unlockedDate: 'Oct 04'
    }
  ]
};

export const initialLeaderboards: {
  weeklySolo: LeaderboardEntry[];
  guildDominion: LeaderboardEntry[];
} = {
  weeklySolo: [
    { rank: 1, id: 'u-10', name: 'Kaelen Voss', guildTag: 'OWLS', completionTimeFormatted: '38m 12s', score: 950, badgesCount: 18 },
    { rank: 2, id: 'u-02', name: 'Elena Rostova', guildTag: 'CHRONO', completionTimeFormatted: '44m 05s', score: 950, badgesCount: 22 },
    { rank: 3, id: 'u-01', name: 'Rowan Vance (You)', guildTag: 'CHRONO', completionTimeFormatted: 'In Progress (Stop 2)', score: 350, badgesCount: 14, isCurrentPlayer: true },
    { rank: 4, id: 'u-15', name: 'Mira Sterling', guildTag: 'MOSS', completionTimeFormatted: '52m 40s', score: 950, badgesCount: 12 },
    { rank: 5, id: 'u-22', name: 'Julian Drake', guildTag: 'ALCH', completionTimeFormatted: '1h 04m', score: 950, badgesCount: 9 }
  ],
  guildDominion: [
    { rank: 1, id: 'g-01', name: 'Order of the Arcane Owls', guildTag: 'OWLS', score: 2940 },
    { rank: 2, id: 'g-02', name: 'Sunken Garden Society', guildTag: 'MOSS', score: 2410 },
    { rank: 3, id: 'g-03', name: 'Chronos Keepers (Your Guild)', guildTag: 'CHRONO', score: 1840, isCurrentPlayer: true },
    { rank: 4, id: 'g-04', name: 'The Alchemical Union', guildTag: 'ALCH', score: 1250 }
  ]
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-01',
    channelId: 'campus-general',
    senderId: 'user-08',
    senderName: 'Soren Ward',
    senderHandle: '@soren_w',
    guildTag: 'OWLS',
    senderTitle: 'Senior Archivist',
    text: 'Has anyone looked closely at the gargoyles by Founders Clock Tower? The shadow trick is genuinely clever.',
    timestamp: '2:14 PM'
  },
  {
    id: 'msg-02',
    channelId: 'campus-general',
    senderId: 'user-12',
    senderName: 'Zoe Martinez',
    senderHandle: '@zoem',
    guildTag: 'MOSS',
    senderTitle: 'Greenhouse Guide',
    text: 'Careful if you head to the Conservatory later, the west entrance is locked for repotting until 4pm!',
    timestamp: '2:22 PM'
  },
  {
    id: 'msg-03',
    channelId: 'campus-general',
    senderId: 'user-01',
    senderName: 'Rowan Vance',
    senderHandle: '@rvance',
    guildTag: 'CHRONO',
    senderTitle: 'Apprentice Cryptographer',
    text: 'Good catch Zoe! Heading over to check out Stop 2 now with the Chronos squad.',
    timestamp: '2:25 PM'
  },
  {
    id: 'msg-g-01',
    channelId: 'guild-private',
    senderId: 'user-02',
    senderName: 'Elena Rostova',
    senderHandle: '@rostova_e',
    senderRole: 'Grandmaster',
    text: 'War room briefing: We need 1 more member to complete the synchronized Clock Tower check-in for our mini-challenge!',
    timestamp: '2:30 PM'
  },
  {
    id: 'msg-g-02',
    channelId: 'guild-private',
    senderId: 'user-04',
    senderName: 'Aria Thorne',
    senderHandle: '@thorne_aria',
    senderRole: 'Chronicler',
    text: 'I just scanned Stop 1! Rowan is near the tower steps right now.',
    timestamp: '2:35 PM'
  }
];
