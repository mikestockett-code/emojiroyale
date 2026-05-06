import React from 'react';
import { Circle, Group, Path, Rect } from '@shopify/react-native-skia';
import type { GameBoardEffectEvent } from '../../../lib/gameBoardEffects';
import type { EffectProps } from './ep1EffectTypes';

type Props = EffectProps & {
  effectId: GameBoardEffectEvent['id'];
};

export function Ep1BurstEffect({ geometry, cellSize, effectId }: Props) {
  const centerX = geometry.width / 2;
  const centerY = geometry.height / 2;
  const radius = Math.min(geometry.width, geometry.height) * 0.42;
  const isFourSquare = effectId === 'fourSquare';

  return (
    <>
      <Circle cx={centerX} cy={centerY} r={radius * (isFourSquare ? 1.35 : 1)} color={isFourSquare ? 'rgba(255,66,31,0.23)' : 'rgba(255,79,216,0.18)'} />
      <Circle cx={centerX} cy={centerY} r={radius * (isFourSquare ? 0.92 : 0.62)} color={isFourSquare ? 'rgba(255,210,77,0.32)' : 'rgba(255,210,77,0.24)'} />
      {isFourSquare && (
        <>
          <Path
            path={`M ${centerX - radius * 1.18} ${centerY - radius * 1.18} L ${centerX + radius * 1.18} ${centerY + radius * 1.18}`}
            style="stroke"
            strokeWidth={Math.max(8, cellSize * 0.18)}
            strokeCap="round"
            color="rgba(255,247,219,0.86)"
          />
          <Path
            path={`M ${centerX + radius * 1.18} ${centerY - radius * 1.18} L ${centerX - radius * 1.18} ${centerY + radius * 1.18}`}
            style="stroke"
            strokeWidth={Math.max(8, cellSize * 0.18)}
            strokeCap="round"
            color="rgba(255,247,219,0.86)"
          />
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (Math.PI * 2 * index) / 12;
            const inner = radius * 0.42;
            const outer = radius * 1.42;
            return (
              <Path
                key={index}
                path={`M ${centerX + Math.cos(angle) * inner} ${centerY + Math.sin(angle) * inner} L ${centerX + Math.cos(angle) * outer} ${centerY + Math.sin(angle) * outer}`}
                style="stroke"
                strokeWidth={Math.max(4, cellSize * 0.09)}
                strokeCap="round"
                color={index % 2 === 0 ? '#ff4f2f' : '#ffd24d'}
              />
            );
          })}
        </>
      )}
      {geometry.localPoints.map((point, index) => (
        <Group key={`${point.x}-${point.y}-${index}`}>
          <Rect
            x={point.x - cellSize * (isFourSquare ? 0.5 : 0.42)}
            y={point.y - cellSize * (isFourSquare ? 0.5 : 0.42)}
            width={cellSize * (isFourSquare ? 1 : 0.84)}
            height={cellSize * (isFourSquare ? 1 : 0.84)}
            color={isFourSquare ? 'rgba(255,66,31,0.2)' : 'rgba(255,247,219,0.16)'}
          />
          <Circle cx={point.x} cy={point.y} r={Math.max(6, cellSize * (isFourSquare ? 0.18 : 0.13))} color={index % 2 ? '#65f4ff' : '#ffd24d'} />
        </Group>
      ))}
    </>
  );
}
