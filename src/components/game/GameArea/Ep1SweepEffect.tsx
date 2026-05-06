import React from 'react';
import { Circle, Group, LinearGradient, Path, vec } from '@shopify/react-native-skia';
import type { EffectProps } from './ep1EffectTypes';

export function Ep1SweepEffect({ geometry, cellSize }: EffectProps) {
  const sweepWidth = Math.max(16, cellSize * 0.42);
  const flashWidth = Math.max(7, cellSize * 0.16);

  return (
    <>
      <Path
        path={geometry.linePath}
        style="stroke"
        strokeWidth={sweepWidth}
        strokeCap="round"
        strokeJoin="round"
        color="rgba(255,79,216,0.22)"
      />
      <Path
        path={geometry.linePath}
        style="stroke"
        strokeWidth={flashWidth}
        strokeCap="round"
        strokeJoin="round"
      >
        <LinearGradient
          start={vec(geometry.start.x, geometry.start.y)}
          end={vec(geometry.end.x, geometry.end.y)}
          colors={['#fff7db', '#65f4ff', '#ffd24d', '#ff4fd8']}
          positions={[0, 0.34, 0.68, 1]}
        />
      </Path>
      {geometry.localPoints.map((point, index) => (
        <Group key={`${point.x}-${point.y}-${index}`}>
          <Circle cx={point.x} cy={point.y} r={Math.max(15, cellSize * 0.32)} color="rgba(255,210,77,0.16)" />
          <Circle cx={point.x} cy={point.y} r={Math.max(5, cellSize * 0.11)} color="#fff7db" />
        </Group>
      ))}
    </>
  );
}
