import React from 'react';
import { Animated, Image, View } from 'react-native';
import { Canvas, Circle, Group, LinearGradient, vec } from '@shopify/react-native-skia';
import { StickerTile } from '../StickerTile';
import { DICE_IMAGE } from './constants';
import type { Player, StickerId } from '../../../types';

type Props = {
  isRollMode: boolean;
  previewStickerId?: StickerId | null;
  previewOwner?: Player | null;
  previewScale?: Animated.Value;
  previewOpacity?: Animated.Value;
  previewFlashOpacity?: Animated.Value;
  previewRotationDeg?: Animated.AnimatedInterpolation<string>;
  onPreviewPress?: () => void;
  anchorX: number;
  anchorY: number;
  cellSize: number;
  playerColors: Record<Player, string>;
};

export function PreviewOverlay({
  isRollMode,
  previewStickerId,
  previewOwner,
  previewScale,
  previewOpacity,
  previewFlashOpacity,
  previewRotationDeg,
  onPreviewPress,
  anchorX,
  anchorY,
  cellSize,
  playerColors,
}: Props) {
  if (
    !isRollMode ||
    !previewStickerId ||
    !previewOwner ||
    !previewScale ||
    !previewOpacity ||
    !previewFlashOpacity ||
    !previewRotationDeg ||
    !onPreviewPress
  ) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: anchorX - cellSize * 1.18,
        top: anchorY - cellSize * 1.18,
        width: cellSize * 2.36,
        height: cellSize * 2.36,
        transform: [{ scale: previewScale }, { rotate: previewRotationDeg }],
        opacity: previewOpacity,
        zIndex: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onTouchEnd={onPreviewPress}
    >
      <Canvas pointerEvents="none" style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Group opacity={0.85}>
          <Circle cx={cellSize * 1.18} cy={cellSize * 1.18} r={cellSize * 1.09} color="rgba(255,211,92,0.18)" />
          <Circle cx={cellSize * 1.18} cy={cellSize * 1.18} r={cellSize * 0.88}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(cellSize * 2.36, cellSize * 2.36)}
              colors={['rgba(255,247,219,0.95)', 'rgba(255,204,51,0.42)', 'rgba(255,79,216,0.28)']}
            />
          </Circle>
        </Group>
      </Canvas>
      <View
        style={{
          width: cellSize * 1.92,
          height: cellSize * 1.92,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image source={DICE_IMAGE} style={{ width: '100%', height: '100%', position: 'absolute' }} resizeMode="contain" />
        <View
          style={{
            width: '68%',
            aspectRatio: 1,
            borderRadius: 999,
            overflow: 'hidden',
            backgroundColor: playerColors[previewOwner],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StickerTile
            stickerId={previewStickerId}
            backgroundColor={playerColors[previewOwner]}
            isBoardTile
            variant="naked"
          />
        </View>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: playerColors[previewOwner],
          opacity: previewFlashOpacity,
          borderRadius: 999,
        }}
      />
    </Animated.View>
  );
}
