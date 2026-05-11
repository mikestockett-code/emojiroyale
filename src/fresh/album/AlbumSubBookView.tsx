import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, PanResponder, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { albumBookStyles as styles } from '../shared/albumBookStyles';
import { useAudioContext } from '../audio/AudioContext';
import { useAlbumBookNavigation } from './hooks/useAlbumBookNavigation';
import { AlbumBookFlipperView } from './AlbumBookFlipperView';
import { ALBUM_CHAPTERS } from './album.constants';
import type { AlbumBookConfig, AlbumPuzzlePieceCounts } from './album.types';
import type { AlbumPuzzleId } from './album.types';

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
  const isBattleModeBook = book.id === 'battleMode';
  const battlePages = useMemo(() => {
    return pageSpreads.flatMap((spread) => [
      spread.leftPageSource
        ? {
            id: `${spread.id}-left`,
            source: spread.leftPageSource,
            locked: spread.leftLocked,
            revealPuzzleId: spread.leftRevealPuzzleId,
          }
        : null,
      spread.rightPageSource
        ? {
            id: `${spread.id}-right`,
            source: spread.rightPageSource,
            locked: spread.rightLocked,
            revealPuzzleId: spread.rightRevealPuzzleId,
          }
        : null,
    ]).filter(Boolean);
  }, [pageSpreads]);
  const [battlePageIndex, setBattlePageIndex] = useState(pageIndex);
  if (!currentPage) return null;

  const handleFlipSound = useCallback(() => {
    const now = Date.now();
    if (now - lastPageTurnSoundAtRef.current < 220) return;
    lastPageTurnSoundAtRef.current = now;
    playSound('pageTurn');
    duckMusic();
  }, [playSound, duckMusic]);

  const currentBattlePage = battlePages[Math.min(battlePageIndex, battlePages.length - 1)] ?? battlePages[0];
  const canGoBattlePrev = battlePageIndex > 0;
  const canGoBattleNext = battlePageIndex < battlePages.length - 1;
  const goBattlePage = useCallback((nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(battlePages.length - 1, nextIndex));
    handleFlipSound();
    setBattlePageIndex(safeIndex);
    onPageChange(safeIndex);
  }, [battlePages.length, handleFlipSound, onPageChange]);

  const battlePageIndexRef = useRef(battlePageIndex);
  battlePageIndexRef.current = battlePageIndex;
  const battleSwipePanResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
    onPanResponderRelease: (_, { dx }) => {
      if (dx < -40 && battlePageIndexRef.current < battlePages.length - 1) {
        goBattlePage(battlePageIndexRef.current + 1);
      } else if (dx > 40 && battlePageIndexRef.current > 0) {
        goBattlePage(battlePageIndexRef.current - 1);
      }
    },
  }), [battlePages.length, goBattlePage]);

  if (isBattleModeBook && currentBattlePage) {
    const revealPercent = currentBattlePage.revealPuzzleId
      ? getPuzzleRevealPercent(albumPuzzlePieces, currentBattlePage.revealPuzzleId)
      : 1;

    return (
      <View style={styles.openBookRoot}>
        <Pressable
          onPress={onBackToShelf}
          style={({ pressed }) => [styles.closeBookButton, pressed && styles.pressedBook]}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffe3a3" />
        </Pressable>

        <View style={styles.battleSinglePageWrap} {...battleSwipePanResponder.panHandlers}>
          <Image source={currentBattlePage.source} style={styles.battleSinglePageImage} resizeMode="cover" />
          {revealPercent < 1 ? (
            <>
              <View style={styles.battlePageFog} />
              <View style={[styles.battlePageReveal, { height: `${Math.max(8, revealPercent * 100)}%` }]}>
                <Image source={currentBattlePage.source} style={styles.battleSinglePageImage} resizeMode="cover" />
              </View>
              <Text style={styles.battlePageLockedText}>{Math.round(revealPercent * 100)}% REVEALED</Text>
            </>
          ) : null}
          {currentBattlePage.locked ? (
            <>
              <View style={styles.battlePageLockedOverlay} />
              <Text style={styles.battlePageLockedText}>LOCKED</Text>
            </>
          ) : null}
        </View>

        <View style={styles.battleSinglePageControls}>
          <Pressable
            onPress={() => goBattlePage(battlePageIndex - 1)}
            disabled={!canGoBattlePrev}
            style={({ pressed }) => [
              styles.pageButton,
              !canGoBattlePrev && styles.disabledButton,
              pressed && styles.pressedBook,
            ]}
          >
            <MaterialIcons name="chevron-left" size={24} color="#ffe3a3" />
          </Pressable>
          <Text style={styles.pageCount}>{battlePageIndex + 1}/{battlePages.length}</Text>
          <Pressable
            onPress={() => goBattlePage(battlePageIndex + 1)}
            disabled={!canGoBattleNext}
            style={({ pressed }) => [
              styles.pageButton,
              !canGoBattleNext && styles.disabledButton,
              pressed && styles.pressedBook,
            ]}
          >
            <MaterialIcons name="chevron-right" size={24} color="#ffe3a3" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.openBookRoot}>
      <Pressable
        onPress={onBackToShelf}
        style={({ pressed }) => [styles.closeBookButton, pressed && styles.pressedBook]}
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
        <View style={styles.chapterTabRow}>
          {ALBUM_CHAPTERS.map((chapter) => {
            const isActive = selectedChapterId === chapter.id;
            const isEmpty = (chapterSpreadCounts[chapter.id] ?? 0) === 0;
            return (
              <Pressable
                key={chapter.id}
                onPress={() => selectChapter(chapter.id)}
                disabled={isEmpty}
                style={[
                  styles.chapterTab,
                  isActive && styles.chapterTabActive,
                  isEmpty && styles.chapterTabDisabled,
                ]}
              >
                <Text style={[styles.chapterTabText, isActive && styles.chapterTabTextActive]}>
                  {chapter.shortTitle}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={[styles.pageControls, isEraBook && styles.pageControlsWithTabs]}>
        <Pressable
          onPress={goPrev}
          disabled={!canGoPrev}
          style={({ pressed }) => [
            styles.pageButton,
            !canGoPrev && styles.disabledButton,
            pressed && styles.pressedBook,
          ]}
        >
          <MaterialIcons name="chevron-left" size={24} color="#ffe3a3" />
        </Pressable>
        <Text style={styles.pageCount}>{currentIndex + 1}/{pageSpreads.length}</Text>
        <Pressable
          onPress={goNext}
          disabled={!canGoNext}
          style={({ pressed }) => [
            styles.pageButton,
            !canGoNext && styles.disabledButton,
            pressed && styles.pressedBook,
          ]}
        >
          <MaterialIcons name="chevron-right" size={24} color="#ffe3a3" />
        </Pressable>
      </View>
    </View>
  );
}

function getPuzzleRevealPercent(albumPuzzlePieces: AlbumPuzzlePieceCounts, puzzleId: AlbumPuzzleId) {
  const pieces = albumPuzzlePieces[puzzleId] ?? {};
  const ownedCount = Object.values(pieces).filter((count) => (count ?? 0) > 0).length;
  return Math.min(1, ownedCount / 10);
}
