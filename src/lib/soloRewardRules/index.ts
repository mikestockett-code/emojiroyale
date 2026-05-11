// src/lib/soloRewardRules/index.ts

export type {
  FreshSoloRewardWinType,
  FreshSoloRewardKind,
  FreshSoloReward,
  FreshSoloRewardPreview,
} from './types';

export {
  SOLO_SAFE_SCORE_BY_WAGER,
  ALBUM_SCARCITY_REWARD_WEIGHTS,
  BRONZE_PUZZLE_REWARD_BASE_CHANCE,
  BRONZE_PUZZLE_REWARD_CHANCE_BY_COLLECTED_COUNT,
  SOLO_POINTS_BY_WIN_TYPE,
} from './constants';

export {
  getSoloSafeScore,
  getSoloWagerConversionPoints,
  getSoloScoreForWinType,
  getSoloScoreForWinner,
  mapWinnerToSoloRewardWinType,
} from './scoring';

export { getSoloRewards } from './rewardEngine';
export { getSoloRewardPreview, getSoloRewardPreviews } from './preview';
export {
  getRewardKindLabel,
  mapRewardKindToStickerRarity,
  pickRewardSticker,
} from './stickerPicker';
