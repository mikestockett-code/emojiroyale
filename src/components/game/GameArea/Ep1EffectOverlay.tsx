import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { GameBoardEffectEvent } from '../../../lib/gameBoardEffects';
import { buildEffectGeometry } from './ep1EffectGeometry';
import { Ep1BurstEffect } from './Ep1BurstEffect';
import { Ep1EraserEffect } from './Ep1EraserEffect';
import { Ep1SweepEffect } from './Ep1SweepEffect';
import { Ep1TornadoEffect } from './Ep1TornadoEffect';
import { Ep1TornadoLiftedTiles } from './Ep1TornadoLiftedTiles';
import type { BoardPoint } from './ep1EffectTypes';

type Props = {
  boardCells: BoardPoint[];
  cellSize: number;
  event?: GameBoardEffectEvent | null;
};

export function Ep1EffectOverlay({ boardCells, cellSize, event }: Props) {
  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!event) return;
    progress.value = 0;
    pulse.value = 0.82;
    progress.value = withTiming(1, {
      duration: event.id === 'tornado' ? 980 : 720,
      easing: Easing.out(Easing.cubic),
    });
    pulse.value = withSequence(
      withTiming(1.18, { duration: 180, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) }),
    );
  }, [event, progress, pulse]);

  const geometry = useMemo(() => {
    if (!event) return null;

    const points = event.affectedIndices
      .map((index) => boardCells[index])
      .filter(Boolean);

    if (points.length === 0) return null;
    return buildEffectGeometry(points, cellSize, event.id);
  }, [boardCells, cellSize, event]);

  const animatedStyle = useAnimatedStyle(() => {
    const fade = progress.value < 0.72 ? 1 : Math.max(0, 1 - (progress.value - 0.72) / 0.28);
    const tornadoTurn = event?.id === 'tornado' ? `${progress.value * 680}deg` : '0deg';
    const blastScale = event?.id === 'tornado'
      ? 0.72 + progress.value * 0.62
      : pulse.value + progress.value * 0.08;

    return {
      opacity: fade,
      transform: [
        { scale: blastScale },
        { rotate: tornadoTurn },
      ],
    };
  }, [event?.id]);

  if (!event || !geometry) return null;

  return (
    <>
      <Reanimated.View
        pointerEvents="none"
        style={[
          styles.effectLayer,
          {
            left: geometry.left,
            top: geometry.top,
            width: geometry.width,
            height: geometry.height,
          },
          animatedStyle,
        ]}
      >
        <Canvas style={StyleSheet.absoluteFill}>
          {event.id === 'tornado' ? (
            <Ep1TornadoEffect geometry={geometry} cellSize={cellSize} />
          ) : event.id === 'removeTile' ? (
            <Ep1EraserEffect geometry={geometry} cellSize={cellSize} />
          ) : event.id === 'clearRow' || event.id === 'clearColumn' ? (
            <Ep1SweepEffect geometry={geometry} cellSize={cellSize} />
          ) : (
            <Ep1BurstEffect geometry={geometry} cellSize={cellSize} effectId={event.id} />
          )}
        </Canvas>
      </Reanimated.View>
      {event.id === 'tornado' ? (
        <Ep1TornadoLiftedTiles
          boardCells={boardCells}
          cellSize={cellSize}
          event={event}
          geometry={geometry}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  effectLayer: {
    position: 'absolute',
    zIndex: 58,
  },
});
