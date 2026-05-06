import type { StickerId } from '../../types';
import type { AlbumPuzzleId, AlbumPuzzlePieceCounts } from '../../fresh/album/album.types';

export type SoloGameStateOptions = {
  activeProfileId: string | null;
  albumPuzzlePieces?: AlbumPuzzlePieceCounts;
  onGrantAlbumSticker: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;
  onGrantAlbumPuzzlePiece: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void;
};
