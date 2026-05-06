import React, { useCallback, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { openBookStyles } from '../screens/albumOpenBookStyles';
import { useAudioContext } from '../audio/AudioContext';
import { useAlbumBookNavigation } from './hooks/useAlbumBookNavigation';
import { AlbumBookFlipperView } from './AlbumBookFlipperView';
import { ALBUM_CHAPTERS } from './album.constants';
import type { AlbumBookConfig, AlbumPuzzlePieceCounts } from './album.types';

type Props = {
  book: AlbumBookConfig;
  pageIndex: number;
  albumCounts?: Record<string, number>;
  albumPuzzlePieces?: AlbumPuzzlePieceCounts;
  onPageChange: (pageIndex: number) => void;
  onBackToShelf: () => void;
};

export function AlbumSubBookView({
  book,
  pageIndex,
  albumCounts = {},
  albumPuzzlePieces = {},
  onPageChange,
  onBackToShelf,
}: Props) {
  const { duckMusic, unduckMusic, playSound } = useAudioContext();
  const lastPageTurnSoundAtRef = useRef(0);

  const {
    pageSpreads,
    currentIndex,
    flipperRef,
    spreadsRef,
    bookRef,
    canGoNext,
    canGoPrev,
    flipData,
    goNext,
    goPrev,
    handleFlippedEnd,
    isEraBook,
    selectedChapterId,
    chapterSpreadCounts,
    selectChapter,
  } = useAlbumBookNavigation(book, pageIndex, albumCounts, albumPuzzlePieces, onPageChange);

  const currentPage = pageSpreads[currentIndex] ?? pageSpreads[0];
  if (!currentPage) return null;

  const handleFlipSound = useCallback(() => {
    const now = Date.now();
    if (now - lastPageTurnSoundAtRef.current < 220) return;
    lastPageTurnSoundAtRef.current = now;
    playSound('pageTurn');
    duckMusic();
  }, [playSound, duckMusic]);

  return (
    <View style={openBookStyles.openBookRoot}>
      <Pressable
        onPress={onBackToShelf}
        style={({ pressed }) => [openBookStyles.closeBookButton, pressed && openBookStyles.pressedBook]}
      >
        <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffe3a3" />
      </Pressable>

      <AlbumBookFlipperView
        key={isEraBook ? selectedChapterId : 'static'}
        flipData={flipData}
        flipperRef={flipperRef}
        spreadsRef={spreadsRef}
        bookRef={bookRef}
        albumPuzzlePieces={albumPuzzlePieces}
        onFlipStart={handleFlipSound}
        onPageDragStart={handleFlipSound}
        onFlippedEnd={(index) => { handleFlipSound(); unduckMusic(); handleFlippedEnd(index); }}
      />

      {isEraBook && (
        <View style={openBookStyles.chapterTabRow}>
          {ALBUM_CHAPTERS.map((chapter) => {
            const isActive = selectedChapterId === chapter.id;
            const isEmpty = (chapterSpreadCounts[chapter.id] ?? 0) === 0;
            return (
              <Pressable
                key={chapter.id}
                onPress={() => selectChapter(chapter.id)}
                disabled={isEmpty}
                style={[
                  openBookStyles.chapterTab,
                  isActive && openBookStyles.chapterTabActive,
                  isEmpty && openBookStyles.chapterTabDisabled,
                ]}
              >
                <Text style={[openBookStyles.chapterTabText, isActive && openBookStyles.chapterTabTextActive]}>
                  {chapter.shortTitle}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={[openBookStyles.pageControls, isEraBook && openBookStyles.pageControlsWithTabs]}>
        <Pressable
          onPress={goPrev}
          disabled={!canGoPrev}
          style={({ pressed }) => [
            openBookStyles.pageButton,
            !canGoPrev && openBookStyles.disabledButton,
            pressed && openBookStyles.pressedBook,
          ]}
        >
          <MaterialIcons name="chevron-left" size={24} color="#ffe3a3" />
        </Pressable>
        <Text style={openBookStyles.pageCount}>{currentIndex + 1}/{pageSpreads.length}</Text>
        <Pressable
          onPress={goNext}
          disabled={!canGoNext}
          style={({ pressed }) => [
            openBookStyles.pageButton,
            !canGoNext && openBookStyles.disabledButton,
            pressed && openBookStyles.pressedBook,
          ]}
        >
          <MaterialIcons name="chevron-right" size={24} color="#ffe3a3" />
        </Pressable>
      </View>
    </View>
  );
}
