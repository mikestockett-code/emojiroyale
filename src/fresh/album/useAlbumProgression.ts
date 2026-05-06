import { useMemo } from 'react';
import { ALBUM_BOOKS, ALBUM_ERAS, INITIAL_ALBUM_PROGRESSION } from './album.constants';
import { getAlbumEraProgressSummary } from './albumProgressionSpec';
import type { AlbumBookConfig, AlbumChapterCollectedCounts, AlbumEraId, AlbumProgressionState } from './album.types';

function getNextEraId(eraId: AlbumEraId) {
  const index = ALBUM_ERAS.indexOf(eraId);
  return ALBUM_ERAS[index + 1] ?? null;
}

// Completing an era unlocks the next era and preserves the completed one.
// This is intentionally not a reset/prestige loop; players keep building a
// bigger collection as new sticker eras open up.
export function getAlbumProgressionAfterEraComplete(
  state: AlbumProgressionState,
  completedEraId: AlbumEraId,
): AlbumProgressionState {
  const completedEraIds = Array.from(new Set([...state.completedEraIds, completedEraId]));
  const nextEraId = getNextEraId(completedEraId);
  const unlockedEraIds = nextEraId
    ? Array.from(new Set([...state.unlockedEraIds, nextEraId]))
    : state.unlockedEraIds;

  return {
    activeEraId: nextEraId ?? completedEraId,
    unlockedEraIds,
    completedEraIds,
  };
}

export function getVisibleAlbumBooks(state: AlbumProgressionState = INITIAL_ALBUM_PROGRESSION): AlbumBookConfig[] {
  return ALBUM_BOOKS.filter((book) => {
    if (book.kind === 'special') {
      return book.visibleAtStart;
    }

    return book.visibleAtStart || state.unlockedEraIds.includes(book.id as AlbumEraId);
  });
}

export function useAlbumProgression(
  state: AlbumProgressionState = INITIAL_ALBUM_PROGRESSION,
  activeEraUniqueCollected: AlbumChapterCollectedCounts = {},
) {
  return useMemo(
    () => ({
      state,
      visibleBooks: getVisibleAlbumBooks(state),
      activeEraProgress: getAlbumEraProgressSummary(state.activeEraId, activeEraUniqueCollected),
    }),
    [activeEraUniqueCollected, state],
  );
}
