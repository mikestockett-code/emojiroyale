import type { StickerId } from '../../../types';
import type { AlbumChapterId } from '../../album/album.types';
import { ALBUM_STICKER_CATALOG } from '../../album/albumStickerCatalog';

type AlbumCounts = Record<string, number>;

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

export function getOwnedStickersInTier(counts: AlbumCounts = {}, tier: AlbumChapterId) {
  return ALBUM_STICKER_CATALOG.filter((sticker) => (
    sticker.chapterId === tier && (counts[sticker.id] ?? 0) > 0
  ));
}

export function hasStickerInTier(counts: AlbumCounts = {}, tier: AlbumChapterId) {
  return getOwnedStickersInTier(counts, tier).length > 0;
}

export function pickOwnedStickerInTier(counts: AlbumCounts = {}, tier: AlbumChapterId): StickerId | null {
  return pickRandom(getOwnedStickersInTier(counts, tier))?.id ?? null;
}

export function hasCommonStack(counts: AlbumCounts = {}, minimumCount: number) {
  return ALBUM_STICKER_CATALOG.some((sticker) => (
    sticker.chapterId === 'common' && (counts[sticker.id] ?? 0) >= minimumCount
  ));
}

export function pickCommonStackSticker(counts: AlbumCounts = {}, minimumCount: number): StickerId | null {
  const pool = ALBUM_STICKER_CATALOG.filter((sticker) => (
    sticker.chapterId === 'common' && (counts[sticker.id] ?? 0) >= minimumCount
  ));
  return pickRandom(pool)?.id ?? null;
}

export function pickAnyStickerInTier(tier: AlbumChapterId): StickerId | null {
  const pool = ALBUM_STICKER_CATALOG.filter((sticker) => sticker.chapterId === tier);
  return pickRandom(pool)?.id ?? null;
}
