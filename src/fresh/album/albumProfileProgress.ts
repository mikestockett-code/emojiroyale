import { ALBUM_STICKER_CATALOG } from './albumStickerCatalog';
import { BRONZE_PUZZLE_CATALOG } from './albumPuzzleCatalog';
import { getAlbumEraProgressSummary } from './albumProgressionSpec';
import type {
  AlbumChapterCollectedCounts,
  AlbumEraId,
  AlbumEraProgressSummary,
  AlbumPuzzlePieceCounts,
  AlbumStickerDefinition,
} from './album.types';

export function getCollectedPuzzlePieceCount(
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
  eraId: AlbumEraId = 'bronze',
) {
  if (eraId !== 'bronze') return 0;
  return BRONZE_PUZZLE_CATALOG.reduce((total, puzzle) => {
    const pieces = albumPuzzlePieces[puzzle.id] ?? {};
    const collected = puzzle.pieces.filter((piece) => (pieces[piece.id] ?? 0) > 0).length;
    return total + collected;
  }, 0);
}

export function getProfileAlbumProgress(
  albumCounts: Record<string, number> = {},
  eraId: AlbumEraId = 'bronze',
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
): AlbumEraProgressSummary {
  const chapterCounts: AlbumChapterCollectedCounts = {};
  for (const sticker of ALBUM_STICKER_CATALOG) {
    if (sticker.eraId !== eraId) continue;
    if ((albumCounts[sticker.id] ?? 0) > 0) {
      chapterCounts[sticker.chapterId] = (chapterCounts[sticker.chapterId] ?? 0) + 1;
    }
  }
  return getAlbumEraProgressSummary(eraId, chapterCounts, getCollectedPuzzlePieceCount(albumPuzzlePieces, eraId));
}

const SCARCITY_RANK: Record<string, number> = { extremelyRare: 3, rare: 2, common: 1 };

export function getTopOwnedStickers(
  albumCounts: Record<string, number> = {},
  limit = 4,
): AlbumStickerDefinition[] {
  return ALBUM_STICKER_CATALOG
    .filter((s) => (albumCounts[s.id] ?? 0) > 0 && s.emoji)
    .sort((a, b) => (SCARCITY_RANK[b.scarcityId] ?? 1) - (SCARCITY_RANK[a.scarcityId] ?? 1))
    .slice(0, limit);
}

export function getOwnedStickers(albumCounts: Record<string, number> = {}): AlbumStickerDefinition[] {
  return ALBUM_STICKER_CATALOG.filter((s) => (albumCounts[s.id] ?? 0) > 0 && s.emoji);
}
