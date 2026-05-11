import type { SoloWagerTier, StickerId, WinnerInfo } from '../types';
import type { AlbumPuzzleId, AlbumPuzzlePieceCounts } from '../fresh/album/album.types';
import {
  getSoloRewardPreviews,
  mapWinnerToSoloRewardWinType,
  type FreshSoloRewardPreview,
} from './soloRewardRules';

type BuildRoundRewardOptions = {
  winner: NonNullable<WinnerInfo>;
  wasRollWin: boolean;
  wagerTier?: SoloWagerTier;
  hasGoldAlbum?: boolean;
  albumPuzzlePieces?: AlbumPuzzlePieceCounts;
};

type GrantRoundRewardOptions = {
  profileId?: string | null;
  onGrantAlbumSticker?: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;
  onGrantAlbumPuzzlePiece?: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void;
  shouldGrantSticker?: (preview: FreshSoloRewardPreview) => boolean;
  shouldGrantPuzzlePiece?: (preview: FreshSoloRewardPreview) => boolean;
};

export function buildRoundRewardPreviews({
  winner,
  wasRollWin,
  wagerTier = 'skip',
  hasGoldAlbum = false,
  albumPuzzlePieces = {},
}: BuildRoundRewardOptions) {
  return getSoloRewardPreviews(
    mapWinnerToSoloRewardWinType(winner, wasRollWin),
    wagerTier,
    hasGoldAlbum,
    albumPuzzlePieces,
  );
}

export function grantRoundRewardPreviews(
  previews: FreshSoloRewardPreview[],
  {
    profileId,
    onGrantAlbumSticker,
    onGrantAlbumPuzzlePiece,
    shouldGrantSticker = () => true,
    shouldGrantPuzzlePiece = () => true,
  }: GrantRoundRewardOptions,
) {
  for (const preview of previews) {
    if (isPuzzlePieceRewardPreview(preview)) {
      if (shouldGrantPuzzlePiece(preview)) {
        onGrantAlbumPuzzlePiece?.(profileId, preview.puzzleId, preview.puzzlePieceId, 1);
      }
      continue;
    }

    if (preview.stickerId && shouldGrantSticker(preview)) {
      onGrantAlbumSticker?.(profileId, preview.stickerId, preview.count);
    }
  }
}

export function isPuzzlePieceRewardPreview(
  preview: FreshSoloRewardPreview,
): preview is FreshSoloRewardPreview & { puzzleId: AlbumPuzzleId; puzzlePieceId: string } {
  return preview.kind === 'puzzlePiece' && Boolean(preview.puzzleId && preview.puzzlePieceId);
}
