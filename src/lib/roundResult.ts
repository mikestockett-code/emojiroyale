import type { AudioSourceKey } from './audio';
import type { WinnerInfo } from '../types';

export function getWinnerDisplayTitle(winner: WinnerInfo, playerNames: Record<'player1' | 'player2', string>) {
  if (!winner) return null;
  return `${playerNames[winner.player]} Wins`;
}

export function getWinnerResultType(winner: WinnerInfo) {
  if (!winner) return null;
  return winner.type === 'legendary' ? 'legendary' : winner.type === 'epic' ? 'epic' : 'common';
}

export function getWinnerSound(type: string, isWinner: boolean): AudioSourceKey {
  if (!isWinner) return 'lose';
  if (type === 'legendary') return 'legendaryWin';
  if (type === 'epic') return 'epicWin';
  return 'win';
}

export function isEpicOrLegendaryWinner(winner: WinnerInfo) {
  return winner?.type === 'epic' || winner?.type === 'legendary';
}
