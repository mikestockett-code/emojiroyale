import type { SoloWagerTier, WinnerInfo } from '../../types';
import { SOLO_POINTS_BY_WIN_TYPE, SOLO_SAFE_SCORE_BY_WAGER } from './constants';
import { mapWinnerToScoreWinType } from '../gameScoreRules';
import type { FreshSoloRewardWinType } from './types';

export function getSoloSafeScore(wagerTier: SoloWagerTier | null | undefined): number {
  if (!wagerTier) return 0;
  return SOLO_SAFE_SCORE_BY_WAGER[wagerTier] ?? 0;
}

export function getSoloWagerConversionPoints(wagerTier: SoloWagerTier | null | undefined): number {
  if (!wagerTier) return 0;
  if (wagerTier === 'epicLite' || wagerTier === 'epic') {
    return 2000;
  }
  return 0;
}

export function getSoloScoreForWinType(winType: FreshSoloRewardWinType): number {
  return SOLO_POINTS_BY_WIN_TYPE[winType] ?? 0;
}

export function getSoloScoreForWinner(
  winner: NonNullable<WinnerInfo>,
  wasRollWin = false,
): number {
  return getSoloScoreForWinType(mapWinnerToSoloRewardWinType(winner, wasRollWin));
}

export function mapWinnerToSoloRewardWinType(
  winner: NonNullable<WinnerInfo>,
  wasRollWin = false,
): FreshSoloRewardWinType {
  return mapWinnerToScoreWinType(winner, wasRollWin);
}
