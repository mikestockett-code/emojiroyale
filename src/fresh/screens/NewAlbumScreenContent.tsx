import React from 'react';
import { ImageBackground, View } from 'react-native';
import { AlbumShelfView } from '../album/AlbumShelfView';
import { AlbumSubBookView } from '../album/AlbumSubBookView';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import type { AlbumBookConfig, AlbumBookId } from '../album/album.types';
import type { FreshProfile } from '../profile/types';

const BACKGROUND = require('../../../assets/backgrounds/albumcurrentactivbackground.png');

type Props = {
  paddingTop: number;
  bottomInset: number;
  selectedBook: AlbumBookConfig | null;
  visibleBooks: AlbumBookConfig[];
  pageIndex: number;
  activeProfile?: FreshProfile | null;
  onPageChange: (index: number) => void;
  onOpenBook: (bookId: AlbumBookId) => void;
  onBackToShelf: () => void;
  onBackPress: () => void;
};

export function NewAlbumScreenContent({
  paddingTop,
  bottomInset,
  selectedBook,
  visibleBooks,
  pageIndex,
  activeProfile,
  onPageChange,
  onOpenBook,
  onBackToShelf,
  onBackPress,
}: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground source={BACKGROUND} style={{ flex: 1 }} imageStyle={{ resizeMode: 'contain' }}>
        <View style={[{ flex: 1 }, { paddingTop }]}>
          {selectedBook ? (
            <AlbumSubBookView
              book={selectedBook}
              pageIndex={pageIndex}
              albumCounts={activeProfile?.albumCounts}
              albumPuzzlePieces={activeProfile?.albumPuzzlePieces}
              onPageChange={onPageChange}
              onBackToShelf={onBackToShelf}
            />
          ) : (
            <AlbumShelfView
              books={visibleBooks}
              albumCounts={activeProfile?.albumCounts}
              albumPuzzlePieces={activeProfile?.albumPuzzlePieces}
              onOpenBook={onOpenBook}
            />
          )}
        </View>
        <SharedBottomNav onBackPress={onBackPress} bottomInset={bottomInset} />
      </ImageBackground>
    </View>
  );
}
