import React from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Circle, Group, LinearGradient, Path, vec } from '@shopify/react-native-skia';

type Props = {
  boardCells: { x: number; y: number }[];
  cellSize: number;
  winningLineIndices: number[];
};

export function WinningLineOverlay({ boardCells, cellSize, winningLineIndices }: Props) {
  if (winningLineIndices.length === 0) return null;

  const points = winningLineIndices
    .map((index) => boardCells[index])
    .filter(Boolean);

  if (points.length === 0) return null;

  const first = points[0];
  const last = points[points.length - 1];
  const path = points.reduce((currentPath, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${currentPath} L ${point.x} ${point.y}`;
  }, '');
  const glowWidth = Math.max(18, cellSize * 0.42);
  const coreWidth = Math.max(7, cellSize * 0.15);
  const orbRadius = Math.max(14, cellSize * 0.32);

  return (
    <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Group opacity={0.7}>
        <Path
          path={path}
          style="stroke"
          strokeWidth={glowWidth}
          strokeCap="round"
          strokeJoin="round"
          color="rgba(255,204,82,0.18)"
        />
      </Group>
      <Path
        path={path}
        style="stroke"
        strokeWidth={coreWidth}
        strokeCap="round"
        strokeJoin="round"
      >
        <LinearGradient
          start={vec(first.x, first.y)}
          end={vec(last.x, last.y)}
          colors={['#fff7db', '#ffd24d', '#ff4fd8', '#65f4ff']}
          positions={[0, 0.4, 0.74, 1]}
        />
      </Path>
      {points.map((point, index) => (
        <Group key={`${point.x}-${point.y}-${index}`}>
          <Circle cx={point.x} cy={point.y} r={orbRadius} color="rgba(255,210,77,0.16)" />
          <Circle cx={point.x} cy={point.y} r={Math.max(5, cellSize * 0.11)} color="#fff7db" />
        </Group>
      ))}
    </Canvas>
  );
}
