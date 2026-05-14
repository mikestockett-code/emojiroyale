import { theme } from '../luxuryTheme';
export type ResultTier = 'common' | 'epic' | 'legendary';

export const TIER: Record<ResultTier, { kicker: string; ring: string; shadowColor: string }> = {
  common:    { kicker: 'ROUND WON',  ring: theme.gold, shadowColor: theme.gold },
  epic:      { kicker: 'EPIC ROUND', ring: '#c8a6ff', shadowColor: '#9d5cff' },
  legendary: { kicker: 'LEGENDARY!', ring: '#ffae2b', shadowColor: '#ff7a18' },
};
