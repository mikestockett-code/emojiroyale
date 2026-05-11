// src/lib/soloRewardRules/constants.ts

import type { SoloWagerTier } from '../../types';
import type { AlbumScarcityId } from '../../fresh/album/album.types';
import { POINTS_BY_WIN_TYPE } from '../gameScoreRules';
import type { FreshSoloRewardWinType } from './types';

export const SOLO_SAFE_SCORE_BY_WAGER: Partial<Record<SoloWagerTier, number>> = {
  epicLite: 2000,
  epic: 2000,
};

export const ALBUM_SCARCITY_REWARD_WEIGHTS: Array<{ scarcityId: AlbumScarcityId; weight: number }> = [
  { scarcityId: 'common', weight: 84 },
  { scarcityId: 'rare', weight: 16 },
];

export const BRONZE_PUZZLE_REWARD_BASE_CHANCE = 0.03;

export const BRONZE_PUZZLE_REWARD_CHANCE_BY_COLLECTED_COUNT: Record<number, number> = {
  0: 0.35,
  1: 0.2,
  2: 0.1,
  3: 0.05,
};

export const SOLO_POINTS_BY_WIN_TYPE: Record<FreshSoloRewardWinType, number> = POINTS_BY_WIN_TYPE;
