import { useMemo, useState } from 'react';
import { ALBUM_BOOKS } from '../../album/album.constants';
import { useAlbumProgression } from '../../album/useAlbumProgression';
import type { AlbumBookId } from '../../album/album.types';

export function useAlbumScreen(onBackToMenu: () => void) {
  const [selectedBookId, setSelectedBookId] = useState<AlbumBookId | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const { visibleBooks } = useAlbumProgression();

  const selectedBook = useMemo(
    () => ALBUM_BOOKS.find((b) => b.id === selectedBookId) ?? null,
    [selectedBookId],
  );

  const openBook = (bookId: AlbumBookId) => {
    setSelectedBookId(bookId);
    setPageIndex(0);
  };

  const backFromAlbum = () => {
    if (selectedBook) {
      setSelectedBookId(null);
      return;
    }
    onBackToMenu();
  };

  return {
    selectedBook,
    visibleBooks,
    pageIndex,
    setPageIndex,
    setSelectedBookId,
    openBook,
    backFromAlbum,
  };
}
