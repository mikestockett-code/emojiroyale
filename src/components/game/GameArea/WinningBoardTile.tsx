import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Reanimated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StickerTile } from '../StickerTile';
import { DICE_IMAGE } from './constants';
import type { BoardCell } from '../../../types';

type Props = {
  cell: NonNullable<BoardCell>;
  cellSize: number;
  tileBg: string;
  revealIndex: number;
};

export function WinningBoardTile({ cell, cellSize, tileBg, revealIndex }: Props) {
  const reveal = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    reveal.value = 0;
    pulse.value = 0;
    reveal.value = withDelay(
      revealIndex * 130,
      withSequence(
        withTiming(0.48, { duration: 190, easing: Easing.inOut(Easing.cubic) }),
        withTiming(1, { duration: 280, easing: Easing.out(Easing.back(1.4)) }),
      ),
    );
    pulse.value = withDelay(
      revealIndex * 130 + 430,
      withSequence(
        withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) }),
      ),
    );
  }, [pulse, reveal, revealIndex]);

  const tileStyle = useAnimatedStyle(() => {
    const rotateY = `${interpolate(reveal.value, [0, 0.5, 1], [0, 96, 360])}deg`;
    const scale = interpolate(reveal.value, [0, 0.5, 1], [1, 1.28, 1.1]);
    return {
      transform: [{ perspective: 700 }, { rotateY }, { scale }],
    };
  });

  const faceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.value, [0, 0.55, 0.72], [0, 0, 1]),
    transform: [
      { scale: interpolate(reveal.value, [0.55, 1], [0.5, 1]) },
      { rotate: `${interpolate(reveal.value, [0.55, 1], [-8, 0])}deg` },
    ],
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 0.3, 1], [0, 0.9, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.85, 1.85]) }],
  }));

  return (
    <Reanimated.View
      style={[
        {
          width: cellSize,
          height: cellSize,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tileStyle,
      ]}
    >
      <Reanimated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            width: cellSize + 20,
            height: cellSize + 20,
            borderRadius: (cellSize + 20) / 2,
            borderWidth: 3,
            borderColor: '#fff7db',
            backgroundColor: 'rgba(255,210,77,0.18)',
          },
          burstStyle,
        ]}
      />
      <Image source={DICE_IMAGE} style={{ width: '96%', height: '96%' }} resizeMode="contain" />
      <View
        style={{
          position: 'absolute',
          width: '70%',
          aspectRatio: 1,
          borderRadius: 999,
          overflow: 'hidden',
          backgroundColor: tileBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StickerTile stickerId={cell.stickerId} backgroundColor={tileBg} isBoardTile variant="naked" />
      </View>
      <Reanimated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            width: cellSize * 0.92,
            height: cellSize * 0.56,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,247,219,0.96)',
            borderWidth: 2,
            borderColor: '#ffcc33',
            shadowColor: '#ffcc33',
            shadowOpacity: 0.9,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
          },
          faceStyle,
        ]}
      >
        <Text style={{ color: '#1c100a', fontSize: 12, fontWeight: '900', letterSpacing: 1 }}>WIN</Text>
      </Reanimated.View>
    </Reanimated.View>
  );
}
