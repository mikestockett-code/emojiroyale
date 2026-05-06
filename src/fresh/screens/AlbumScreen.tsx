import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlbumScreen } from './hooks/useAlbumScreen';
import { NewAlbumScreenContent } from './NewAlbumScreenContent';
import type { FreshProfile } from '../profile/types';

type Props = {
  onBackToMenu: () => void;
  activeProfile?: FreshProfile | null;
};

export default function AlbumScreen({ onBackToMenu, activeProfile }: Props) {
  const insets = useSafeAreaInsets();
  const {
    selectedBook,
    visibleBooks,
    pageIndex,
    setPageIndex,
    setSelectedBookId,
    openBook,
    backFromAlbum,
  } = useAlbumScreen(onBackToMenu);

  return (
    <NewAlbumScreenContent
      paddingTop={insets.top}
      bottomInset={insets.bottom}
      selectedBook={selectedBook}
      visibleBooks={visibleBooks}
      pageIndex={pageIndex}
      activeProfile={activeProfile}
      onPageChange={setPageIndex}
      onOpenBook={openBook}
      onBackToShelf={() => setSelectedBookId(null)}
      onBackPress={backFromAlbum}
    />
  );
}
