import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StickerTile } from '../StickerTile';
import { DICE_IMAGE } from './constants';
import type { TornadoLiftedTileProps, TornadoLiftedTilesProps } from './ep1EffectTypes';

export function Ep1TornadoLiftedTiles({ boardCells, cellSize, event, geometry }: TornadoLiftedTilesProps) {
  const tiles = event.affectedTiles ?? [];
  if (tiles.length === 0) return null;
  const centerX = geometry.left + geometry.width / 2;
  const centerY = geometry.top + geometry.height / 2;

  return (
    <View pointerEvents="none" style={styles.root}>
      {tiles.map(({ index, cell }, tileIndex) => {
        const point = boardCells[index];
        if (!point) return null;
        return (
          <Ep1TornadoLiftedTile
            key={`${event.nonce}-${index}-${tileIndex}`}
            cell={cell}
            cellSize={cellSize}
            delayMs={tileIndex * 34}
            startX={point.x}
            startY={point.y}
            centerX={centerX}
            centerY={centerY}
          />
        );
      })}
    </View>
  );
}

function Ep1TornadoLiftedTile({ cell, cellSize, delayMs, startX, startY, centerX, centerY }: TornadoLiftedTileProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 1320 + delayMs,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [delayMs, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const delayedProgress = Math.max(0, Math.min(1, (progress.value * (1320 + delayMs) - delayMs) / 1320));
    const arc = Math.sin(delayedProgress * Math.PI);
    const curl = (delayMs % 3 - 1) * cellSize * 0.52 * arc;
    const x = startX + (centerX - startX) * delayedProgress + curl;
    const y = startY + (centerY - startY) * delayedProgress - arc * cellSize * 0.88;
    const scale = 1 - delayedProgress * 0.42 + arc * 0.16;
    const opacity = delayedProgress < 0.88 ? 1 : Math.max(0, 1 - (delayedProgress - 0.88) / 0.12);

    return {
      opacity,
      transform: [
        { translateX: x - cellSize / 2 },
        { translateY: y - cellSize / 2 },
        { rotate: `${delayedProgress * 900 + delayMs * 2}deg` },
        { scale },
      ],
    };
  }, [cellSize, centerX, centerY, delayMs, startX, startY]);

  const tileBg = cell.player === 'player1' ? '#fdba74' : '#93c5fd';

  return (
    <Reanimated.View
      pointerEvents="none"
      style={[
        styles.liftedTile,
        {
          width: cellSize,
          height: cellSize,
        },
        animatedStyle,
      ]}
    >
      <Image source={DICE_IMAGE} style={styles.diceImage} resizeMode="contain" />
      <View style={[styles.stickerFace, { backgroundColor: tileBg }]}>
        <StickerTile stickerId={cell.stickerId} backgroundColor={tileBg} isBoardTile variant="naked" />
      </View>
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 96,
    elevation: 96,
  },
  liftedTile: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceImage: {
    width: '94%',
    height: '94%',
  },
  stickerFace: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 1,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
