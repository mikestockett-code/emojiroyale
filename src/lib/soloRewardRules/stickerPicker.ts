import type { StickerPoolRarity } from '../../types';
import { STICKER_CATALOG } from '../../data/stickerPool';
import { ALBUM_STICKER_CATALOG } from '../../fresh/album/albumStickerCatalog';
import type { AlbumChapterId } from '../../fresh/album/album.types';
import { ALBUM_SCARCITY_REWARD_WEIGHTS } from './constants';
import type { FreshSoloRewardKind } from './types';

export function mapRewardKindToStickerRarity(kind: FreshSoloRewardKind): StickerPoolRarity {
  switch (kind) {
    case 'power':
    case 'powerPlus':
      return 'emojiPowers';
    case 'platinum':
      return 'platinum';
    case 'legendary':
      return 'legendary';
    case 'epic':
      return 'epic';
    case 'common':
    case 'puzzlePiece':
    default:
      return 'common';
  }
}

export function pickRewardSticker(kind: FreshSoloRewardKind) {
  if (kind === 'power' || kind === 'powerPlus') {
    const pool = STICKER_CATALOG.filter((entry) => {
      if (entry.rarity !== 'emojiPowers') return false;
      const isPlus = entry.id.startsWith('power-plus-');
      return kind === 'powerPlus' ? isPlus : !isPlus;
    });
    return pickRandomFromPool(pool);
  }

  if (kind === 'common' || kind === 'epic' || kind === 'legendary') {
    return pickAlbumRewardSticker(kind);
  }

  const targetRarity = mapRewardKindToStickerRarity(kind);
  const preferredPool = STICKER_CATALOG.filter(
    (entry) => entry.rarity === targetRarity && entry.playable === false,
  );
  const fallbackPool = STICKER_CATALOG.filter((entry) => entry.rarity === targetRarity);

  return pickRandomFromPool(preferredPool.length > 0 ? preferredPool : fallbackPool);
}

export function getRewardKindLabel(kind: FreshSoloRewardKind): string {
  switch (kind) {
    case 'puzzlePiece': return 'Bronze Puzzle Piece';
    case 'powerPlus': return 'Emoji Power+';
    case 'power': return 'Emoji Power';
    case 'platinum': return 'Platinum Sticker';
    case 'legendary': return 'Legendary Sticker';
    case 'epic': return 'Epic Sticker';
    case 'common':
    default: return 'Common Sticker';
  }
}

function pickAlbumRewardSticker(chapterId: AlbumChapterId) {
  const { scarcityId } = pickWeighted(ALBUM_SCARCITY_REWARD_WEIGHTS);
  const preferredPool = ALBUM_STICKER_CATALOG.filter(
    (entry) => entry.eraId === 'bronze' && entry.chapterId === chapterId && entry.scarcityId === scarcityId,
  );
  const fallbackPool = ALBUM_STICKER_CATALOG.filter(
    (entry) => entry.eraId === 'bronze' && entry.chapterId === chapterId,
  );

  return pickRandomFromPool(preferredPool.length > 0 ? preferredPool : fallbackPool);
}

function pickWeighted<T>(weightedItems: Array<{ weight: number } & T>): T {
  const totalWeight = weightedItems.reduce((total, item) => total + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of weightedItems) {
    roll -= item.weight;
    if (roll <= 0) {
      return item;
    }
  }

  return weightedItems[0];
}

function pickRandomFromPool<T>(pool: T[]) {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}
