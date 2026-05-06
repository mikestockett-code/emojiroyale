import React from 'react';
import { Circle, LinearGradient, Path, vec } from '@shopify/react-native-skia';
import { buildSpiralPath } from './ep1EffectGeometry';
import type { EffectProps } from './ep1EffectTypes';

export function Ep1TornadoEffect({ geometry, cellSize }: EffectProps) {
  const centerX = geometry.width / 2;
  const centerY = geometry.height / 2;
  const radius = Math.min(geometry.width, geometry.height) * 0.44;
  const spiralPath = buildSpiralPath(centerX, centerY, radius);
  const secondSpiralPath = buildSpiralPath(centerX, centerY, radius * 0.72, Math.PI * 0.72);

  return (
    <>
      <Circle cx={centerX} cy={centerY} r={radius * 1.18} color="rgba(103,232,249,0.13)" />
      <Path path={spiralPath} style="stroke" strokeWidth={Math.max(10, cellSize * 0.24)} strokeCap="round">
        <LinearGradient
          start={vec(centerX - radius, centerY - radius)}
          end={vec(centerX + radius, centerY + radius)}
          colors={['rgba(255,247,219,0.12)', '#67e8f9', '#e879f9', '#fef3c7']}
          positions={[0, 0.36, 0.72, 1]}
        />
      </Path>
      <Path
        path={secondSpiralPath}
        style="stroke"
        strokeWidth={Math.max(5, cellSize * 0.12)}
        strokeCap="round"
        color="rgba(255,227,163,0.9)"
      />
      {geometry.localPoints.slice(0, 10).map((point, index) => (
        <Circle
          key={`${point.x}-${point.y}-${index}`}
          cx={point.x}
          cy={point.y}
          r={Math.max(4, cellSize * 0.09)}
          color={index % 2 === 0 ? 'rgba(255,79,216,0.82)' : 'rgba(101,244,255,0.82)'}
        />
      ))}
    </>
  );
}
