import { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder } from 'react-native';
import type { PageFlipperInstance } from '@laffy1309/react-native-page-flipper';
import { ALBUM_CHAPTERS, getAlbumPageSpreads } from '../album.constants';
import type { AlbumBookConfig, AlbumBookSectionId, AlbumPageSpread, AlbumPuzzlePieceCounts } from '../album.types';

type PageToken = { spreadIndex: number; side: 'left' | 'right' };

export function useAlbumBookNavigation(
  book: AlbumBookConfig,
  pageIndex: number,
  albumCounts: Record<string, number>,
  albumPuzzlePieces: AlbumPuzzlePieceCounts,
  onPageChange: (index: number) => void,
) {
  const isEraBook = book.kind === 'era';

  const allPageSpreads = useMemo(
    () => getAlbumPageSpreads(book.id, albumCounts, albumPuzzlePieces),
    [albumCounts, albumPuzzlePieces, book.id],
  );

  const [selectedSectionId, setSelectedSectionId] = useState<AlbumBookSectionId>(
    () => ALBUM_CHAPTERS.find(c => allPageSpreads.some(s => s.sectionId === c.id))?.id ?? 'common',
  );

  const chapterSpreadCounts = useMemo(
    () => Object.fromEntries(
      ALBUM_CHAPTERS.map(c => [c.id, allPageSpreads.filter(s => s.sectionId === c.id).length]),
    ) as Record<AlbumBookSectionId, number>,
    [allPageSpreads],
  );

  const pageSpreads = useMemo(
    () => isEraBook
      ? allPageSpreads.filter(s => s.sectionId === selectedSectionId)
      : allPageSpreads,
    [allPageSpreads, isEraBook, selectedSectionId],
  );

  const [currentIndex, setCurrentIndex] = useState(pageIndex);
  const flipperRef = useRef<PageFlipperInstance>(null);

  const spreadsRef = useRef<AlbumPageSpread[]>(pageSpreads);
  spreadsRef.current = pageSpreads;
  const bookRef = useRef<AlbumBookConfig>(book);
  bookRef.current = book;

  const hasFlipPages = Boolean(book.pageLeft && book.pageRight);
  const canGoNext = currentIndex < pageSpreads.length - 1;
  const canGoPrev = currentIndex > 0;

  const flipData = useMemo(
    () => pageSpreads.flatMap((_, i): string[] => [
      JSON.stringify({ spreadIndex: i, side: 'left' } satisfies PageToken),
      JSON.stringify({ spreadIndex: i, side: 'right' } satisfies PageToken),
    ]),
    [pageSpreads],
  );

  const selectChapter = useCallback((id: AlbumBookSectionId) => {
    setSelectedSectionId(id);
    setCurrentIndex(0);
    onPageChange(0);
  }, [onPageChange]);

  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 18 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dx < -24 && canGoNext) {
          const next = currentIndex + 1;
          setCurrentIndex(next);
          onPageChange(next);
        }
        if (g.dx > 24 && canGoPrev) {
          const prev = currentIndex - 1;
          setCurrentIndex(prev);
          onPageChange(prev);
        }
      },
    }),
    [canGoNext, canGoPrev, currentIndex, onPageChange],
  );

  const goNext = useCallback(() => {
    if (hasFlipPages) {
      flipperRef.current?.nextPage();
    } else if (canGoNext) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onPageChange(next);
    }
  }, [hasFlipPages, canGoNext, currentIndex, onPageChange]);

  const goPrev = useCallback(() => {
    if (hasFlipPages) {
      flipperRef.current?.previousPage();
    } else if (canGoPrev) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      onPageChange(prev);
    }
  }, [hasFlipPages, canGoPrev, currentIndex, onPageChange]);

  const handleFlippedEnd = useCallback((index: number) => {
    setCurrentIndex(index);
    onPageChange(index);
  }, [onPageChange]);

  return {
    pageSpreads,
    currentIndex,
    flipperRef,
    spreadsRef,
    bookRef,
    hasFlipPages,
    canGoNext,
    canGoPrev,
    flipData,
    panResponder,
    goNext,
    goPrev,
    handleFlippedEnd,
    isEraBook,
    selectedChapterId: selectedSectionId,
    chapterSpreadCounts,
    selectChapter,
  };
}
