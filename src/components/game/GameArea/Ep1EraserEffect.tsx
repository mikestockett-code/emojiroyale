import React from 'react';
import { Circle, Group, LinearGradient, Path, Rect, vec } from '@shopify/react-native-skia';
import type { EffectProps } from './ep1EffectTypes';

export function Ep1EraserEffect({ geometry, cellSize }: EffectProps) {
  const centerX = geometry.width / 2;
  const centerY = geometry.height / 2;
  const target = geometry.localPoints[0] ?? { x: centerX, y: centerY };
  const eraserWidth = cellSize * 1.12;
  const eraserHeight = cellSize * 0.48;
  const wipePath = `M ${target.x - cellSize * 0.78} ${target.y + cellSize * 0.48} L ${target.x + cellSize * 0.82} ${target.y - cellSize * 0.42}`;

  return (
    <>
      <Circle cx={target.x} cy={target.y} r={cellSize * 0.72} color="rgba(255,247,219,0.18)" />
      <Path
        path={wipePath}
        style="stroke"
        strokeWidth={Math.max(14, cellSize * 0.34)}
        strokeCap="round"
      >
        <LinearGradient
          start={vec(target.x - cellSize, target.y + cellSize)}
          end={vec(target.x + cellSize, target.y - cellSize)}
          colors={['rgba(255,255,255,0.05)', '#fff7db', '#65f4ff']}
          positions={[0, 0.62, 1]}
        />
      </Path>
      <Group transform={[{ translateX: target.x - eraserWidth * 0.48 }, { translateY: target.y - eraserHeight * 0.92 }, { rotate: -0.5 }]}>
        <Rect
          x={0}
          y={0}
          width={eraserWidth}
          height={eraserHeight}
          color="#fff2c7"
        />
        <Rect
          x={eraserWidth * 0.58}
          y={0}
          width={eraserWidth * 0.42}
          height={eraserHeight}
          color="#ff7aa8"
        />
      </Group>
      {Array.from({ length: 9 }, (_, index) => {
        const angle = -0.65 + index * 0.17;
        return (
          <Circle
            key={index}
            cx={target.x + Math.cos(angle) * cellSize * (0.42 + index * 0.035)}
            cy={target.y + Math.sin(angle) * cellSize * (0.42 + index * 0.035)}
            r={Math.max(2.5, cellSize * (0.075 - index * 0.003))}
            color={index % 2 === 0 ? 'rgba(255,247,219,0.82)' : 'rgba(101,244,255,0.7)'}
          />
        );
      })}
    </>
  );
}
