import { BRONZE_PUZZLE_CATALOG } from './albumPuzzleCatalog';
import type {
  AlbumPuzzleDefinition,
  AlbumPuzzleId,
  AlbumPuzzlePieceCounts,
  AlbumPuzzlePieceDefinition,
} from './album.types';

export type AlbumPuzzleReward = {
  puzzle: AlbumPuzzleDefinition;
  piece: AlbumPuzzlePieceDefinition;
  collectedCountAfterGrant: number;
};

export function getCollectedPuzzlePieces(
  puzzleId: AlbumPuzzleId,
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
) {
  return albumPuzzlePieces[puzzleId] ?? {};
}

export function getPuzzleCollectedCount(
  puzzle: AlbumPuzzleDefinition,
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
) {
  const collectedPieces = getCollectedPuzzlePieces(puzzle.id, albumPuzzlePieces);
  return puzzle.pieces.filter((piece) => (collectedPieces[piece.id] ?? 0) > 0).length;
}

export function getTotalBronzePuzzlePiecesCollected(albumPuzzlePieces: AlbumPuzzlePieceCounts = {}) {
  return BRONZE_PUZZLE_CATALOG.reduce(
    (total, puzzle) => total + getPuzzleCollectedCount(puzzle, albumPuzzlePieces),
    0,
  );
}

export function pickMissingBronzePuzzlePiece(
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
): AlbumPuzzleReward | null {
  const candidates = BRONZE_PUZZLE_CATALOG.flatMap((puzzle) => {
    const collectedPieces = getCollectedPuzzlePieces(puzzle.id, albumPuzzlePieces);
    return puzzle.pieces
      .filter((piece) => (collectedPieces[piece.id] ?? 0) <= 0)
      .map((piece) => ({ puzzle, piece }));
  });

  if (candidates.length === 0) return null;

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  if (!picked) return null;

  return {
    ...picked,
    collectedCountAfterGrant: getPuzzleCollectedCount(picked.puzzle, albumPuzzlePieces) + 1,
  };
}
