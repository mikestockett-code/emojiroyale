import type {
  AlbumBookConfig,
  AlbumBookId,
  AlbumChapterConfig,
  AlbumChapterId,
  AlbumEraId,
  AlbumPageSpread,
  AlbumProgressionState,
  AlbumStickerSlot,
} from './album.types';
import { ALBUM_STICKER_CATALOG } from './albumStickerCatalog';
import { getBronzePuzzlePageSpreads } from './albumPuzzleSpreads';
import type { AlbumPuzzlePieceCounts } from './album.types';

export const ALBUM_PAPER = {
  bronzeOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/bronze_open.png'),
  silverOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/silver_open.png'),
  goldOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/gold_open.png'),
  platinumOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/platiumn.png'),
  diamondOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/diamond_open.png'),
  doodleOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/doodle_open.png'),
  easterEggOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/easter_egg_open.png'),
  favoriteOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/favorite_open.png'),
  battleModeOpen: require('../../../assets/albumgeneralstuff/albumbooks/open_books_and_paper/open_battle_mode_book_temp.png'),
} as const;

export const ALBUM_BOOKS: AlbumBookConfig[] = [
  {
    id: 'favorite',
    title: 'Favorite',
    kind: 'special',
    visibleAtStart: true,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/enchanced_light_front_view_red.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/favspine.png'),
    openBook: ALBUM_PAPER.favoriteOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/fav_pages/fav_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/fav_pages/fav_right.png'),
  },
  {
    id: 'bronze',
    title: 'Bronze',
    kind: 'era',
    visibleAtStart: true,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/bronze_front_view_green_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/bronze_spine.png'),
    openBook: ALBUM_PAPER.bronzeOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_pages/bronze_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_pages/bronze_right.png'),
  },
  {
    id: 'silver',
    title: 'Silver',
    kind: 'era',
    visibleAtStart: false,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/silver_front_view_redish_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/silver_spine.png'),
    openBook: ALBUM_PAPER.silverOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/silver_pages/silver_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/silver_pages/silver_right.png'),
  },
  {
    id: 'gold',
    title: 'Gold',
    kind: 'era',
    visibleAtStart: false,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/gold_front_view_black_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/gold_spine.png'),
    openBook: ALBUM_PAPER.goldOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/gold_pages/gold_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/gold_pages/gold_right.png'),
  },
  {
    id: 'platinum',
    title: 'Platinum',
    kind: 'era',
    visibleAtStart: false,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/platiumn_front_view_blue_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/platinum_spine.png'),
    openBook: ALBUM_PAPER.platinumOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/platiumn_pages/platiumn_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/platiumn_pages/platiumn_right.png'),
  },
  {
    id: 'diamond',
    title: 'Diamond',
    kind: 'era',
    visibleAtStart: false,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/diamond_front_view_red_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/dimaond_spine_red.png'),
    openBook: ALBUM_PAPER.diamondOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/diamond_pages/diamond_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/diamond_pages/diamond_right.png'),
  },
  {
    id: 'doodle',
    title: 'Doodle',
    kind: 'special',
    visibleAtStart: true,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/doodle_front_view_blank_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/doodle_spine.png'),
    openBook: ALBUM_PAPER.doodleOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/doodle_pages/doodle_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/doodle_pages/doodle_right.png'),
  },
  {
    id: 'battleMode',
    title: 'Battle Mode',
    kind: 'special',
    visibleAtStart: true,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/battle_mode_front_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/doodle_spine.png'),
    openBook: ALBUM_PAPER.battleModeOpen,
  },
  {
    id: 'easterEggs',
    title: 'Easter Eggs',
    kind: 'special',
    visibleAtStart: true,
    cover: require('../../../assets/albumgeneralstuff/albumbooks/Orthographic _front_view/easter_eggs_front_view_cover.png'),
    spine: require('../../../assets/albumgeneralstuff/albumbooks/spines/easter_egg_spine.png'),
    openBook: ALBUM_PAPER.easterEggOpen,
    pageLeft: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/easter_egg_pages/easter_egg_left.png'),
    pageRight: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/easter_egg_pages/easter_egg_right.png'),
  },
];

export const ALBUM_ERAS: AlbumEraId[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

export const ALBUM_CHAPTERS: AlbumChapterConfig[] = [
  { id: 'common', title: 'Common', shortTitle: 'Common' },
  { id: 'epic', title: 'Epic', shortTitle: 'Epic' },
  { id: 'legendary', title: 'Legendary', shortTitle: 'Legend' },
  { id: 'puzzle', title: 'Puzzle', shortTitle: 'Puzzle' },
];

export const INITIAL_ALBUM_PROGRESSION: AlbumProgressionState = {
  activeEraId: 'bronze',
  unlockedEraIds: ['bronze'],
  completedEraIds: [],
};

const SPECIAL_BOOK_PAGE_SPREADS: AlbumPageSpread[] = [
  { id: 'page-1', leftSlots: [], rightSlots: [] },
  { id: 'page-2', leftSlots: [], rightSlots: [] },
  { id: 'page-3', leftSlots: [], rightSlots: [] },
];

const BATTLE_MODE_PAGE_SPREADS: AlbumPageSpread[] = [
  {
    id: 'battle-mode-intro-todd',
    leftPageSource: require('../../../assets/albumgeneralstuff/albumbooks/battle_mode_full_pages_not_puzzle/battle_mode_full_pages/intro_full_page.png'),
    rightPageSource: require('../../../assets/albumgeneralstuff/albumbooks/battle_mode_full_pages_not_puzzle/battle_mode_full_pages/todd_full_page.png'),
    leftSlots: [],
    rightSlots: [],
  },
  {
    id: 'battle-mode-story-nico',
    leftPageSource: require('../../../assets/albumgeneralstuff/albumbooks/battle_mode_full_pages_not_puzzle/battle_mode_full_pages/story_frag1_after_todd_before_nico_not_puzzle.png'),
    rightPageSource: require('../../../assets/albumgeneralstuff/albumbooks/battle_mode_full_pages_not_puzzle/battle_mode_full_pages/nico_bio.png'),
    leftLocked: true,
    rightRevealPuzzleId: 'battleTodd',
    leftSlots: [],
    rightSlots: [],
  },
];

function isStickerChapter(chapter: AlbumChapterConfig): chapter is AlbumChapterConfig & { id: AlbumChapterId } {
  return chapter.id !== 'puzzle';
}

function isEraBookId(bookId: AlbumBookId): bookId is AlbumEraId {
  return ALBUM_ERAS.includes(bookId as AlbumEraId);
}

function chunkSlots(slots: AlbumStickerSlot[], chunkSize: number): AlbumStickerSlot[][] {
  const chunks: AlbumStickerSlot[][] = [];
  for (let i = 0; i < slots.length; i += chunkSize) {
    chunks.push(slots.slice(i, i + chunkSize));
  }
  return chunks.length > 0 ? chunks : [[]];
}

export function getAlbumPageSpreads(
  bookId: AlbumBookId,
  albumCounts: Record<string, number> = {},
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
): AlbumPageSpread[] {
  if (bookId === 'battleMode') return BATTLE_MODE_PAGE_SPREADS;

  if (!isEraBookId(bookId)) {
    return SPECIAL_BOOK_PAGE_SPREADS.map((spread) => ({
      ...spread,
      id: `${bookId}-${spread.id}`,
    }));
  }

  const stickerSpreads = ALBUM_CHAPTERS.filter(isStickerChapter).flatMap((chapter) => {
    const slots: AlbumStickerSlot[] = ALBUM_STICKER_CATALOG
      .filter((sticker) => sticker.eraId === bookId && sticker.chapterId === chapter.id && sticker.emoji)
      .map((sticker): AlbumStickerSlot => ({
        stickerId: sticker.id,
        emoji: sticker.emoji!,
        name: sticker.name,
        scarcityId: sticker.scarcityId,
        collected: (albumCounts[sticker.id] ?? 0) > 0,
      }));

    return chunkSlots(slots, 12).map((chunk, index) => ({
      id: `${bookId}-${chapter.id}-${index + 1}`,
      sectionId: chapter.id,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      leftSlots: chunk.slice(0, 6),
      rightSlots: chunk.slice(6, 12),
    }));
  });

  if (bookId !== 'bronze') return stickerSpreads;

  return [...stickerSpreads, ...getBronzePuzzlePageSpreads()];
}
