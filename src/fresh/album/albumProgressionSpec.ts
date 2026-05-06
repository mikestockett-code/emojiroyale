import type {
  AlbumChapterCollectedCounts,
  AlbumChapterId,
  AlbumChapterProgressSummary,
  AlbumEraId,
  AlbumEraProgressSummary,
  AlbumEraSpec,
} from './album.types';
import { BRONZE_PUZZLE_TOTAL_PIECES } from './albumPuzzleCatalog';

// Album progression is additive: finishing Bronze unlocks Silver, then Gold, etc.
// Do not model this as a prestige reset that wipes or reuses the same sticker set.
// Completion bonuses like better rewards or cheaper entry should layer on top of
// completed eras, while each new era adds more stickers/pages to collect.
const CHAPTER_ORDER: AlbumChapterId[] = ['common', 'epic', 'legendary'];

// These are planned unique sticker totals, not generic fill slots.
// Duplicates can exist in inventory, but album completion is unique collected / total unique.
// Bronze custom art is tracked through puzzle pieces, not chapter extremelyRare slots.
export const ALBUM_ERA_SPECS: Record<AlbumEraId, AlbumEraSpec> = {
  bronze: {
    id: 'bronze',
    title: 'Bronze',
    chapters: {
      common: {
        scarcity: {
          common: { totalUniqueStickers: 80, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 20, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      epic: {
        scarcity: {
          common: { totalUniqueStickers: 72, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 18, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      legendary: {
        scarcity: {
          common: { totalUniqueStickers: 64, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 16, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
    },
  },
  silver: {
    id: 'silver',
    title: 'Silver',
    chapters: {
      common: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      epic: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      legendary: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
    },
  },
  gold: {
    id: 'gold',
    title: 'Gold',
    chapters: {
      common: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      epic: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      legendary: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
    },
  },
  platinum: {
    id: 'platinum',
    title: 'Platinum',
    chapters: {
      common: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      epic: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      legendary: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
    },
  },
  diamond: {
    id: 'diamond',
    title: 'Diamond',
    chapters: {
      common: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      epic: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
      legendary: {
        scarcity: {
          common: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          rare: { totalUniqueStickers: 0, pageKind: 'standardSlot' },
          extremelyRare: { totalUniqueStickers: 0, pageKind: 'specialPage' },
        },
      },
    },
  },
};

function getPercentComplete(uniqueCollected: number, totalUniqueStickers: number) {
  if (totalUniqueStickers <= 0) return 0;
  return Math.min(100, Math.round((uniqueCollected / totalUniqueStickers) * 100));
}

function clampUniqueCollected(uniqueCollected: number, totalUniqueStickers: number) {
  return Math.max(0, Math.min(uniqueCollected, totalUniqueStickers));
}

export function getAlbumEraSpec(eraId: AlbumEraId) {
  return ALBUM_ERA_SPECS[eraId];
}

export function getAlbumChapterTotalUniqueStickers(eraId: AlbumEraId, chapterId: AlbumChapterId) {
  const chapter = getAlbumEraSpec(eraId).chapters[chapterId];
  return Object.values(chapter.scarcity).reduce((total, band) => total + band.totalUniqueStickers, 0);
}

export function getAlbumEraTotalUniqueStickers(eraId: AlbumEraId) {
  const chapterTotal = CHAPTER_ORDER.reduce(
    (total, chapterId) => total + getAlbumChapterTotalUniqueStickers(eraId, chapterId),
    0,
  );
  return eraId === 'bronze' ? chapterTotal + BRONZE_PUZZLE_TOTAL_PIECES : chapterTotal;
}

export function getAlbumChapterProgressSummary(
  eraId: AlbumEraId,
  chapterId: AlbumChapterId,
  uniqueCollectedByChapter: AlbumChapterCollectedCounts = {},
): AlbumChapterProgressSummary {
  const totalUniqueStickers = getAlbumChapterTotalUniqueStickers(eraId, chapterId);
  const uniqueCollected = clampUniqueCollected(uniqueCollectedByChapter[chapterId] ?? 0, totalUniqueStickers);

  return {
    chapterId,
    uniqueCollected,
    totalUniqueStickers,
    percentComplete: getPercentComplete(uniqueCollected, totalUniqueStickers),
    isComplete: totalUniqueStickers > 0 && uniqueCollected >= totalUniqueStickers,
  };
}

export function getAlbumEraProgressSummary(
  eraId: AlbumEraId,
  uniqueCollectedByChapter: AlbumChapterCollectedCounts = {},
  puzzlePiecesCollected = 0,
): AlbumEraProgressSummary {
  const chapters = CHAPTER_ORDER.map((chapterId) =>
    getAlbumChapterProgressSummary(eraId, chapterId, uniqueCollectedByChapter),
  );
  const chapterUniqueCollected = chapters.reduce((total, chapter) => total + chapter.uniqueCollected, 0);
  const puzzleTotal = eraId === 'bronze' ? BRONZE_PUZZLE_TOTAL_PIECES : 0;
  const uniqueCollected = chapterUniqueCollected + clampUniqueCollected(puzzlePiecesCollected, puzzleTotal);
  const totalUniqueStickers = chapters.reduce((total, chapter) => total + chapter.totalUniqueStickers, 0) + puzzleTotal;

  return {
    eraId,
    uniqueCollected,
    totalUniqueStickers,
    percentComplete: getPercentComplete(uniqueCollected, totalUniqueStickers),
    isComplete: totalUniqueStickers > 0 && uniqueCollected >= totalUniqueStickers,
    chapters,
  };
}
