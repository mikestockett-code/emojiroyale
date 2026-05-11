import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import PageFlipper, { PageFlipperInstance } from '@laffy1309/react-native-page-flipper';
import { albumBookStyles as styles } from '../shared/albumBookStyles';
import { AlbumStickerSlotView } from './AlbumStickerSlotView';
import { AlbumPuzzlePageView } from './AlbumPuzzlePageView';
import type { AlbumBookConfig, AlbumPageSpread, AlbumPuzzlePieceCounts, AlbumStickerSlot } from './album.types';

type PageToken = { spreadIndex: number; side: 'left' | 'right' };

type Props = {
  flipData: string[];
  flipperRef: React.RefObject<PageFlipperInstance | null>;
  spreadsRef: React.RefObject<AlbumPageSpread[]>;
  bookRef: React.RefObject<AlbumBookConfig>;
  albumPuzzlePieces?: AlbumPuzzlePieceCounts;
  onFlipStart: () => void;
  onPageDragStart: () => void;
  onFlippedEnd: (index: number) => void;
};

export function AlbumBookFlipperView({
  flipData,
  flipperRef,
  spreadsRef,
  bookRef,
  albumPuzzlePieces = {},
  onFlipStart,
  onPageDragStart,
  onFlippedEnd,
}: Props) {
  return (
    <View style={styles.pageSpreadFlip}>
      <PageFlipper
        ref={flipperRef}
        data={flipData}
        pageSize={{ width: 283, height: 425 }}
        portrait={false}
        contentContainerStyle={styles.pageFlipperContent}
        renderPage={(raw: string) => renderFlipHalf(raw, spreadsRef, bookRef, albumPuzzlePieces)}
        onFlipStart={onFlipStart}
        onPageDragStart={onPageDragStart}
        onFlippedEnd={onFlippedEnd}
      />
    </View>
  );
}

function renderFlipHalf(
  raw: string,
  spreadsRef: React.RefObject<AlbumPageSpread[]>,
  bookRef: React.RefObject<AlbumBookConfig>,
  albumPuzzlePieces: AlbumPuzzlePieceCounts,
) {
  const { spreadIndex, side } = JSON.parse(raw) as PageToken;
  const page = spreadsRef.current[spreadIndex];
  const book = bookRef.current;
  if (!page) return <View style={StyleSheet.absoluteFill} />;

  const isLeft = side === 'left';
  const customPageSource = isLeft ? page.leftPageSource : page.rightPageSource;
  if (customPageSource) {
    const locked = isLeft ? page.leftLocked : page.rightLocked;
    const revealPuzzleId = isLeft ? page.leftRevealPuzzleId : page.rightRevealPuzzleId;
    const revealPercent = revealPuzzleId ? getPuzzleRevealPercent(albumPuzzlePieces, revealPuzzleId) : 1;

    return (
      <View style={styles.battlePage}>
        <Image source={customPageSource} style={styles.battlePageImage} resizeMode="cover" />
        {revealPercent < 1 ? (
          <>
            <View style={styles.battlePageFog} />
            <View style={[styles.battlePageReveal, { height: `${Math.max(8, revealPercent * 100)}%` }]}>
              <Image source={customPageSource} style={styles.battlePageImage} resizeMode="cover" />
            </View>
            <Text style={styles.battlePageLockedText}>{Math.round(revealPercent * 100)}% REVEALED</Text>
          </>
        ) : null}
        {locked ? (
          <>
            <View style={styles.battlePageLockedOverlay} />
            <Text style={styles.battlePageLockedText}>LOCKED</Text>
          </>
        ) : null}
      </View>
    );
  }

  const puzzleId = isLeft ? page.leftPuzzleId : page.rightPuzzleId;
  if (puzzleId) {
    return <AlbumPuzzlePageView puzzleId={puzzleId} side={side} albumPuzzlePieces={albumPuzzlePieces} />;
  }

  const source = isLeft ? book.pageLeft! : book.pageRight!;
  const slots: (AlbumStickerSlot | null)[] = Array.from({ length: 6 }, (_, i) =>
    (isLeft ? page.leftSlots[i] : page.rightSlots[i]) ?? null,
  );

  return (
    <ImageBackground source={source} style={styles.pageHalfFullImage} resizeMode="stretch">
      <View style={[styles.pageHalfEmojiGrid, { left: isLeft ? 31 : 23, width: isLeft ? 88 : 89 }]}>
        {slots.map((slot, i) =>
          slot ? <AlbumStickerSlotView key={slot.stickerId} slot={slot} /> : <View key={i} style={styles.albumEmojiSlot} />,
        )}
      </View>
    </ImageBackground>
  );
}

function getPuzzleRevealPercent(albumPuzzlePieces: AlbumPuzzlePieceCounts, puzzleId: string) {
  const pieces = albumPuzzlePieces[puzzleId as keyof AlbumPuzzlePieceCounts] ?? {};
  const ownedCount = Object.values(pieces).filter((count) => (count ?? 0) > 0).length;
  return Math.min(1, ownedCount / 10);
}
