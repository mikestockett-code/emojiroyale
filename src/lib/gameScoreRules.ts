import type { WinnerInfo } from '../types';

export type GameScoreWinType =
  | 'common'
  | 'commonRoll'
  | 'commonTornado'
  | 'epic'
  | 'epicRoll'
  | 'epicTornado'
  | 'legendary'
  | 'legendaryRoll'
  | 'legendaryTornado';

export const POINTS_BY_WIN_TYPE: Record<GameScoreWinType, number> = {
  common: 500,
  commonRoll: 750,
  commonTornado: 1800,
  epic: 1500,
  epicRoll: 1750,
  epicTornado: 3600,
  legendary: 2000,
  legendaryRoll: 3000,
  legendaryTornado: 7200,
};

export function mapWinnerToScoreWinType(
  winner: NonNullable<WinnerInfo>,
  wasRollWin = false,
  wasTornadoWin = false,
): GameScoreWinType {
  if (wasTornadoWin) {
    if (winner.type === 'legendary') return 'legendaryTornado';
    if (winner.type === 'epic') return 'epicTornado';
    return 'commonTornado';
  }
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
  wasTornadoWin = false,
): number {
  return getScoreForWinType(mapWinnerToScoreWinType(winner, wasRollWin, wasTornadoWin));
}
