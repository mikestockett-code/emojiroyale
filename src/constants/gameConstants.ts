import type {
  AlbumStickerEntry,
  CoverDecorationSlotId,
  Profile,
} from '../types';

// NOTE: SCREEN_WIDTH, SCREEN_HEIGHT, IS_COMPACT_PHONE use Dimensions from react-native
// and are defined in app/index.tsx where react-native is available.

export const BOARD_SIZE = 25;
export const GRID_WIDTH = 5;
export const RACK_SIZE = 8;

export const ALBUM_STORAGE_KEY = 'emoji-dash-album-v1';
export const GOLDEN_PHOENIX_HOLDER_KEY = 'emoji-dash-golden-phoenix-holder-v1';
export const ENABLE_SHARE_BUTTON = true;
export const ENABLE_FAMILY_TROPHY = false;
export const ENABLE_CONFETTI_CANNON_EXPERIMENT = true;
export const ENABLE_DEV_TEST_MODE = true;
export const COVER_DECORATION_SLOT_IDS: CoverDecorationSlotId[] = ['slot1', 'slot2', 'slot3', 'slot4'];

// Module-level caches for album entries (mutable, intentionally module-scoped)
export const nullProfileAlbumEntriesCache = new Map<string, AlbumStickerEntry[]>();
export const profileAlbumEntriesCache = new WeakMap<Profile, Map<string, AlbumStickerEntry[]>>();

export const ENABLE_DEV_ALBUM_TEST_TOOLS = false;
export const DEV_TEST_POWER_EMOJI_GRANT = 10;
export const DEV_TEST_POWER_EMOJI_PLUS_GRANT = 1;
