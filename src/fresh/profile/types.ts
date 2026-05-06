export type FreshProfileColor = 'sunset' | 'ocean' | 'mint' | 'violet' | 'ember' | 'slate';

export type FreshProfile = {
  id: string;
  name: string;
  avatar: string;
  color: FreshProfileColor;
  createdAt: number;
  albumCounts?: Record<string, number>;
  albumPuzzlePieces?: Record<string, Record<string, number>>;
  soloHighScore?: number;
  favoriteStickerId?: string;
};
