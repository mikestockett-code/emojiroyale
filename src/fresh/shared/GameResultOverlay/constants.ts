export type ResultTier = 'common' | 'epic' | 'legendary';

export const TIER: Record<ResultTier, { kicker: string; ring: string; shadowColor: string }> = {
  common:    { kicker: 'ROUND WON',  ring: '#ffd86b', shadowColor: '#ffd86b' },
  epic:      { kicker: 'EPIC ROUND', ring: '#c8a6ff', shadowColor: '#9d5cff' },
  legendary: { kicker: 'LEGENDARY!', ring: '#ffae2b', shadowColor: '#ff7a18' },
};
