// Matches React Native's ImageSourcePropType — defined locally since node_modules not installed yet
export type ImageSourcePropType = number | { uri: string; width?: number; height?: number };

// Foundation types — defined here to avoid circular dependencies with lib files
export type StickerPoolRarity =
  | 'common'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'platinum'
  | 'ultra'
  | 'easterEgg'
  | 'emojiPowers';

export type Player = 'player1' | 'player2';
export type ColorOptionKey = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'black';
export type StickerId = string;
export type Rarity = StickerPoolRarity;

export type DieFaces = [StickerId, StickerId, StickerId, StickerId, StickerId, StickerId]; // [p1-placed, p1-random, p2-placed, p2-random, die-ep1, die-free]

export type BoardCell = null | {
  player: Player;
  stickerId: StickerId;
  // Dice fields — solo mode only. faces[0-1]=player1, faces[2-3]=player2, faces[4]=EP1, faces[5]=free sticker.
  faces?: DieFaces;
  currentFaceIndex?: number;
  placedBy?: Player;
};

export type FamilyTrophy = {
  imageUri: string | null;
};

export type CoverDecorationSlotId = 'slot1' | 'slot2' | 'slot3' | 'slot4';
export type CoverDecorations = Record<CoverDecorationSlotId, StickerId | null>;

export type WinnerInfo = null | {
  player: Player;
  type: 'win' | 'epic' | 'legendary';
  indices: number[];
};

export type StickerEntry = {
  id: StickerId;
  name: string;
  rarity: Rarity;
  initialOwned: number;
  albumNumber: number;
  emoji?: string;
  imageSource?: ImageSourcePropType;
  playable?: boolean;
  eventOnly?: boolean;
  rewardOnly?: boolean;
};

export type Profile = {
  id: string;
  name: string;
  color: ColorOptionKey;
  avatar: string;
  avatarEmojiId?: StickerId | null;
  albumCounts: Record<StickerId, number>;
  featuredEmojiId?: StickerId | null;
  coverDecorations?: CoverDecorations;
  starterInventoryVersion?: number;
  familyTrophy?: FamilyTrophy;
  stats: {
    wins: number;
    epicWins: number;
    legendaryWins: number;
    soloBestScore: number;
  };
};

export type StickerReward = {
  stickerId: StickerId;
  name: string;
  rarity: Rarity;
  totalOwned: number;
  profileName: string;
};

export type GoldenPhoenixChallenge = null | {
  challengerProfileId: string;
  holderProfileId: string;
  epicStickerId?: StickerId | null;
  legendaryStickerId: StickerId;
};

export type MatchWagerTier = 'common' | 'epic' | 'legendary';
export type PassPlayWager = {
  matchTier: MatchWagerTier;
  player1StickerId: StickerId | null;
  player2StickerId: StickerId | null;
};

export type AlbumStickerEntry = StickerEntry & {
  owned: number;
  albumNumberLabel?: string;
  badgeLabel?: string;
  customImageUri?: string | null;
  isFamilyTrophy?: boolean;
};

export type SoloDifficultyId = 'easy' | 'medium' | 'hard' | 'hardest';
export type SoloDifficultyConfig = {
  id: SoloDifficultyId;
  label: string;
  turnTimerSeconds: number;
  startCpuLevel: number;
  rewardTier: string;
};

export type SoloWagerTier = 'skip' | 'common' | 'epicLite' | 'epic' | 'legendary';
export type SoloModeId = 'practice' | 'epicLite' | 'epic' | 'hard' | 'battle';

export type SoloRunRewardEntry = {
  stickerId: StickerId;
  name: string;
  rarity: Rarity;
  count: number;
  baseCommonCount: number;
  wagerCount: number;
};

export type StickerDisplayItem = {
  id: string;
  stickerId: StickerId;
  name: string;
  rarity: Rarity;
  ownedCount?: number;
  wonCount?: number;
};

export type SoloHighScore = {
  houseHighScore: number;
  profileBestScores: Record<string, number>;
};

export type SoloRoundResultReason = 'playerWin' | 'cpuWin' | 'timeout' | 'tie' | null;
export type SoloRewardStickerRarity = Extract<Rarity, 'common' | 'epic' | 'legendary'>;
export type ProfileEmojiPickerMode = 'favorite' | 'avatar' | 'coverDecoration' | null;

// Battle power types — IDs inlined here to avoid circular dep with stickerCategories
export type BattlePowerId =
  | 'power-torture-rack'
  | 'power-clear-row'
  | 'power-clear-column'
  | 'power-remove-emoji'
  | 'power-four-square'
  | 'power-tornado'
  | 'power-plus-10-seconds'
  | 'power-clock-freeze'
  | 'power-reverse-time'
  | 'power-rerack';
export type BattlePowerSlotId = 'slot1' | 'slot2';
export type BattlePowerType = 'EP1' | 'EPI';
export type BattlePowerSlotLoadout = Record<BattlePowerSlotId, BattlePowerId | null>;
export type BattleLoadoutBackScreen = 'modeSelect' | 'soloSetup' | 'menu';
export type BattleLoadoutContext = 'battleStart' | 'betweenRounds';

export type BattlePowerState = {
  tortureRackUsed: boolean;
  lockedRackSlotIndex: number | null;
  lockedRackStickerId: StickerId | null;
  clockFreezeActive: boolean;
  clockFreezeRoundId: number | null;
};

export type BattleMatchEndReason = 'points' | 'legendary' | 'timeout' | null;

export type AppScreen =
  | 'battleSetup'
  | 'battleGame'
  | 'album'
  | 'choosePlayers'
  | 'game'
  | 'goldenPhoenix'
  | 'goldenPhoenixHolder'
  | 'goldenPhoenixPass'
  | 'goldenPhoenixWager'
  | 'howTo'
  | 'modeSelect'
  | 'passPlayWagerPlayer1'
  | 'passPlayPassDevice'
  | 'passPlayWagerPlayer2'
  | 'passPlayWagerReview'
  | 'passPlayPowerPlayer1'
  | 'passPlayPowerPlayer2'
  | 'createProfile'
  | 'renameProfile'
  | 'manageProfiles'
  | 'menu'
  | 'passPlaySetup'
  | 'passPlayGame'
  | 'soloSetup'
  | 'soloMode'
  | 'gpChallengeSetup';
