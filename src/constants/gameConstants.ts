import type {
  AlbumStickerEntry,
  BattlePowerSlotLoadout,
  ColorOptionKey,
  CoverDecorationSlotId,
  Player,
  Profile,
  SoloDifficultyId,
  SoloDifficultyConfig,
  SoloModeId,
  SoloWagerTier,
} from '../types';

// NOTE: SCREEN_WIDTH, SCREEN_HEIGHT, IS_COMPACT_PHONE use Dimensions from react-native
// and are defined in app/index.tsx where react-native is available.

export const BOARD_SIZE = 25;
export const GRID_WIDTH = 5;
export const RACK_SIZE = 8;

export const ALBUM_STORAGE_KEY = 'emoji-dash-album-v1';
export const GOLDEN_PHOENIX_HOLDER_KEY = 'emoji-dash-golden-phoenix-holder-v1';
export const PROFILES_STORAGE_KEY = 'emoji-dash-profiles-v1';
export const ACTIVE_PROFILE_ID_KEY = 'emoji-dash-active-profile-id-v1';
export const SOLO_HIGH_SCORE_KEY = 'emojiRoyale.soloHighScore';
export const PRACTICE_PRESSURE_BANNER_HIDDEN_KEY = 'emojiRoyale.practicePressureBannerHidden';
export const ENABLE_SHARE_BUTTON = true;
export const ENABLE_FAMILY_TROPHY = false;
export const ENABLE_CONFETTI_CANNON_EXPERIMENT = true;
export const ENABLE_DEV_TEST_MODE = true;
export const COVER_DECORATION_SLOT_IDS: CoverDecorationSlotId[] = ['slot1', 'slot2', 'slot3', 'slot4'];

// Module-level caches for album entries (mutable, intentionally module-scoped)
export const nullProfileAlbumEntriesCache = new Map<string, AlbumStickerEntry[]>();
export const profileAlbumEntriesCache = new WeakMap<Profile, Map<string, AlbumStickerEntry[]>>();

export const PROFILE_AVATARS = ['😀', '😎', '🥳', '🦄', '🔥', '👑', '🌈', '🐶', '⭐', '⚡'];

export const SOLO_DIFFICULTY_OPTIONS: Record<SoloDifficultyId, SoloDifficultyConfig> = {
  easy: { id: 'easy', label: 'Easy', turnTimerSeconds: 15, startCpuLevel: 1, rewardTier: 'starter' },
  medium: { id: 'medium', label: 'Medium', turnTimerSeconds: 10, startCpuLevel: 2, rewardTier: 'standard' },
  hard: { id: 'hard', label: 'Hard', turnTimerSeconds: 3, startCpuLevel: 3, rewardTier: 'advanced' },
  hardest: { id: 'hardest', label: 'Hardest', turnTimerSeconds: 3, startCpuLevel: 4, rewardTier: 'elite' },
};

export const SOLO_MODE_OPTIONS: Array<{
  id: SoloModeId;
  label: string;
  badge: string;
  line1: string;
  line2: string;
  disabled?: boolean;
  difficultyId: SoloDifficultyId;
  wagerTier: SoloWagerTier;
  initialPressure: number;
}> = [
  {
    id: 'practice',
    label: 'Practice',
    badge: 'SAFE',
    line1: 'No Wager',
    line2: 'Learn / grind / low pressure',
    difficultyId: 'easy',
    wagerTier: 'skip',
    initialPressure: 0,
  },
  {
    id: 'epicLite',
    label: 'Epic Lite',
    badge: 'GRIND',
    line1: 'Wager matching Common',
    line2: 'Build toward Epic rewards',
    difficultyId: 'easy',
    wagerTier: 'epicLite',
    initialPressure: 0,
  },
  {
    id: 'epic',
    label: 'Epic',
    badge: 'HIGH RISK',
    line1: 'Wager 1 Epic',
    line2: 'High risk, higher reward',
    difficultyId: 'medium',
    wagerTier: 'epic',
    initialPressure: 1,
  },
  {
    id: 'hard',
    label: 'Hard',
    badge: 'COMING SOON',
    line1: 'Coming Soon',
    line2: 'Disabled for now',
    disabled: true,
    difficultyId: 'hard',
    wagerTier: 'legendary',
    initialPressure: 2,
  },
  {
    id: 'battle',
    label: 'Battle Mode',
    badge: 'TEST PILOT',
    line1: '120 sec match • first to 2',
    line2: 'Web dev battle test',
    difficultyId: 'hard',
    wagerTier: 'skip',
    initialPressure: 2,
  },
];


export const SOLO_WAGER_OPTIONS: Array<{
  id: SoloWagerTier;
  label: string;
  badge: string;
  line1: string;
  line2: string;
  line3: string;
  multiplier: number;
}> = [
  { id: 'skip', label: 'SKIP', badge: 'SAFE', line1: 'No loss', line2: 'Lower score', line3: 'Common emojis', multiplier: 0.75 },
  { id: 'common', label: 'COMMON', badge: 'RISK', line1: 'Lose 1 Common', line2: 'Normal score', line3: 'Common + Epic', multiplier: 1 },
  { id: 'epicLite', label: 'EPIC LITE', badge: 'GRIND', line1: 'Pay matching Common', line2: 'Per-win rewards', line3: 'Safe after 2000', multiplier: 1 },
  { id: 'epic', label: 'EPIC', badge: 'HIGH RISK', line1: 'Lose 1 Epic', line2: 'Score boost', line3: 'Epic rewards', multiplier: 1.25 },
  { id: 'legendary', label: 'LEGENDARY', badge: 'MAX RISK', line1: 'Lose 1 Legendary', line2: 'Big score boost', line3: 'Legendary rewards', multiplier: 2 },
];

export const NEW_PROFILE_STARTER_INVENTORY_VERSION = 2;
export const TEST_STARTER_COMMON_STICKER_ID = 'sunny-smile';
export const ENABLE_DEV_ALBUM_TEST_TOOLS = false;

// COMMENTED OUT — replaced by per-win solo rewards + wager safety progress.
// export const SOLO_REWARD_THRESHOLDS: Record<
//   SoloDifficultyId,
//   { save: number; epic: number; legendary: number }
// > = {
//   easy: { save: 300, epic: 1200, legendary: 3000 },
//   medium: { save: 400, epic: 1500, legendary: 4000 },
//   hard: { save: 500, epic: 1800, legendary: 5000 },
//   hardest: { save: 700, epic: 2200, legendary: 6000 },
// };

export const BLOCKED_PROFILE_NAME_WORDS = [
  // Explicit profanity
  'ass', 'asshole', 'bastard', 'bitch', 'cock', 'cunt', 'damn', 'dick',
  'fuck', 'fucker', 'fucking', 'hell', 'motherfucker',
  'penis', 'piss', 'porn', 'pussy', 'shit', 'slut', 'whore',
  // Homophobic slurs
  'fag', 'faggot', 'gay', 'homo', 'dyke', 'tranny',
  // Racial / ethnic slurs
  'nigger', 'nigga', 'chink', 'gook', 'kike', 'spic', 'wetback',
  'beaner', 'coon', 'jap', 'raghead', 'towelhead',
  // Ableist slurs
  'retard', 'retarded',
];

export const PLAYER_LABELS: Record<Player, string> = {
  player1: 'Player 1',
  player2: 'Player 2',
};

export const SOLO_CPU_COLOR_PRIORITY: ColorOptionKey[] = ['blue', 'purple', 'green', 'red', 'orange', 'black'];
export const BATTLE_TOTAL_TIMER_SECONDS = 120;
export const BATTLE_TARGET_SCORE = 2;
export const BATTLE_RACK_SIZE = 8;
export const BATTLE_FLIPS_PER_PLAYER = 3;
export const DEV_TEST_POWER_EMOJI_GRANT = 10;
export const DEV_TEST_POWER_EMOJI_PLUS_GRANT = 1;

export const BATTLE_DEFAULT_POWER_SLOTS: BattlePowerSlotLoadout = {
  slot1: null,
  slot2: null,
};

export const DEFAULT_PLAYER_COLORS: Record<Player, ColorOptionKey> = {
  player1: 'red',
  player2: 'blue',
};

export const COLOR_OPTIONS: Record<ColorOptionKey, { name: string; color: string; tileBackground: string }> = {
  red: { name: 'Red', color: '#ef4444', tileBackground: '#fca5a5' },
  blue: { name: 'Blue', color: '#1d4ed8', tileBackground: '#60a5fa' },
  green: { name: 'Green', color: '#16a34a', tileBackground: '#86efac' },
  purple: { name: 'Purple', color: '#9333ea', tileBackground: '#d8b4fe' },
  orange: { name: 'Orange', color: '#f97316', tileBackground: '#fdba74' },
  black: { name: 'Black', color: '#111827', tileBackground: '#d1d5db' },
};
