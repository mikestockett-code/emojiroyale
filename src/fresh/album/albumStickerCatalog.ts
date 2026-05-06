import { BRONZE_EMOJI_POOL } from '../../data/bronzeEmojiPool';
import type { Rarity, StickerEntry } from '../../types';
import type { AlbumChapterId, AlbumScarcityId, AlbumStickerDefinition } from './album.types';

type BronzePlanEntry = {
  chapterId: AlbumChapterId;
  scarcityId: Exclude<AlbumScarcityId, 'extremelyRare'>;
  count: number;
};

// Bronze v1 keeps custom profile artwork in the Puzzle tab, not as normal slots.
const BRONZE_EXTREMELY_RARE: Partial<Record<AlbumChapterId, AlbumStickerDefinition[]>> = {
  common:    [],
  epic:      [],
  legendary: [],
};

const BRONZE_PLAN: BronzePlanEntry[] = [
  { chapterId: 'common',    scarcityId: 'common', count: 80 },
  { chapterId: 'common',    scarcityId: 'rare',   count: 20 },
  { chapterId: 'epic',      scarcityId: 'common', count: 72 },
  { chapterId: 'epic',      scarcityId: 'rare',   count: 18 },
  { chapterId: 'legendary', scarcityId: 'common', count: 64 },
  { chapterId: 'legendary', scarcityId: 'rare',   count: 16 },
];

const CHAPTER_RARITY: Record<AlbumChapterId, Rarity> = {
  common:    'common',
  epic:      'epic',
  legendary: 'legendary',
};

function buildBronzeCatalog(): AlbumStickerDefinition[] {
  const standard = BRONZE_PLAN.flatMap((plan) => {
    const emojis = BRONZE_EMOJI_POOL[plan.chapterId][plan.scarcityId].slice(0, plan.count);
    return emojis.map(({ emoji, name }, index): AlbumStickerDefinition => ({
      id: `album-bronze-${plan.chapterId}-${plan.scarcityId}-${index + 1}`,
      name,
      eraId: 'bronze',
      chapterId: plan.chapterId,
      scarcityId: plan.scarcityId,
      pageKind: 'standardSlot',
      playable: false,
      emoji,
    }));
  });

  const special = (['common', 'epic', 'legendary'] as AlbumChapterId[]).flatMap(
    (chapterId) => BRONZE_EXTREMELY_RARE[chapterId] ?? [],
  );

  return [...standard, ...special];
}

// Bronze is locked at 300 total progress:
// - 270 normal unique emoji stickers
// - 30 Bronze puzzle pieces in the Puzzle tab
// Rarity = popularity: rare slots hold the most iconic/recognized emoji per chapter.
export const ALBUM_STICKER_CATALOG: AlbumStickerDefinition[] = buildBronzeCatalog();

export function toAlbumStickerEntry(sticker: AlbumStickerDefinition, albumNumber: number): StickerEntry {
  return {
    id: sticker.id,
    name: sticker.name,
    rarity: CHAPTER_RARITY[sticker.chapterId],
    initialOwned: 0,
    albumNumber,
    emoji: sticker.emoji,
    imageSource: sticker.imageSource as StickerEntry['imageSource'],
    playable: false,
  };
}

export const ALBUM_STICKER_ENTRIES: StickerEntry[] = ALBUM_STICKER_CATALOG.map((sticker, index) =>
  toAlbumStickerEntry(sticker, index + 1),
);
