import React from 'react';
import { ImageBackground, View } from 'react-native';
import PageFlipper, { PageFlipperInstance } from '@laffy1309/react-native-page-flipper';
import { openBookStyles } from '../screens/albumOpenBookStyles';
import { animStyles } from '../screens/albumAnimationStyles';
import { emojiPageStyles } from '../screens/albumEmojiPageStyles';
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
    <View style={openBookStyles.pageSpreadFlip}>
      <PageFlipper
        ref={flipperRef}
        data={flipData}
        pageSize={{ width: 283, height: 425 }}
        portrait={false}
        contentContainerStyle={animStyles.pageFlipperContent}
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
  if (!page) return null;

  const isLeft = side === 'left';
  const puzzleId = isLeft ? page.leftPuzzleId : page.rightPuzzleId;
  if (puzzleId) {
    return <AlbumPuzzlePageView puzzleId={puzzleId} side={side} albumPuzzlePieces={albumPuzzlePieces} />;
  }

  const source = isLeft ? book.pageLeft! : book.pageRight!;
  const slots: (AlbumStickerSlot | null)[] = Array.from({ length: 6 }, (_, i) =>
    (isLeft ? page.leftSlots[i] : page.rightSlots[i]) ?? null,
  );

  return (
    <ImageBackground source={source} style={animStyles.pageHalfFullImage} resizeMode="stretch">
      <View style={[emojiPageStyles.pageHalfEmojiGrid, { left: isLeft ? 31 : 23, width: isLeft ? 88 : 89 }]}>
        {slots.map((slot, i) =>
          slot ? <AlbumStickerSlotView key={slot.stickerId} slot={slot} /> : <View key={i} style={emojiPageStyles.albumEmojiSlot} />,
        )}
      </View>
    </ImageBackground>
  );
}
