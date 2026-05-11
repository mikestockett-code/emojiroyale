import type { WinnerInfo } from '../types';

export type GameScoreWinType =
  | 'common'
  | 'commonRoll'
  | 'epic'
  | 'epicRoll'
  | 'legendary'
  | 'legendaryRoll';

export const POINTS_BY_WIN_TYPE: Record<GameScoreWinType, number> = {
  common: 500,
  commonRoll: 750,
  epic: 1500,
  epicRoll: 1750,
  legendary: 2000,
  legendaryRoll: 3000,
};

export function mapWinnerToScoreWinType(
  winner: NonNullable<WinnerInfo>,
  wasRollWin = false,
): GameScoreWinType {
  if (winner.type === 'legendary') return wasRollWin ? 'legendaryRoll' : 'legendary';
  if (winner.type === 'epic') return wasRollWin ? 'epicRoll' : 'epic';
  return wasRollWin ? 'commonRoll' : 'common';
}

export function getScoreForWinType(winType: GameScoreWinType): number {
  return POINTS_BY_WIN_TYPE[winType] ?? 0;
}

export function getScoreForWinner(
  winner: NonNullable<WinnerInfo>,
  wasRollWin = false,
): number {
  return getScoreForWinType(mapWinnerToScoreWinType(winner, wasRollWin));
}
