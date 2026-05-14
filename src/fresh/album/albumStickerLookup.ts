import type { StickerId } from '../../types';
import { ALBUM_STICKER_CATALOG } from './albumStickerCatalog';

export function getAlbumStickerById(stickerId: StickerId | null | undefined) {
  if (!stickerId) return null;
  return ALBUM_STICKER_CATALOG.find((sticker) => sticker.id === stickerId) ?? null;
}

export function getAlbumStickerEmoji(stickerId: StickerId | null | undefined) {
  return getAlbumStickerById(stickerId)?.emoji ?? null;
}

export function getAlbumStickerLabel(stickerId: StickerId | null | undefined, fallback = 'Wager Sticker') {
  return getAlbumStickerById(stickerId)?.name ?? fallback;
}
