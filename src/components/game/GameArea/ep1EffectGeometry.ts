import type { GameBoardEffectEvent } from '../../../lib/gameBoardEffects';
import type { BoardPoint, EffectGeometry } from './ep1EffectTypes';

export function buildEffectGeometry(
  points: BoardPoint[],
  cellSize: number,
  effectId: GameBoardEffectEvent['id'],
): EffectGeometry {
  const pad = effectId === 'tornado' ? cellSize * 1.25 : cellSize * 0.82;
  const minX = Math.min(...points.map((point) => point.x)) - pad;
  const maxX = Math.max(...points.map((point) => point.x)) + pad;
  const minY = Math.min(...points.map((point) => point.y)) - pad;
  const maxY = Math.max(...points.map((point) => point.y)) + pad;
  const localPoints = points.map((point) => ({ x: point.x - minX, y: point.y - minY }));
  const sortedPoints = [...localPoints].sort((a, b) => {
    if (effectId === 'clearColumn') return a.y - b.y;
    if (effectId === 'clearRow') return a.x - b.x;
    return Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y);
  });
  const start = sortedPoints[0] ?? localPoints[0];
  const end = sortedPoints[sortedPoints.length - 1] ?? start;
  const linePath = sortedPoints.reduce((currentPath, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${currentPath} L ${point.x} ${point.y}`;
  }, '');

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
    localPoints,
    linePath,
    start,
    end,
  };
}

export function buildSpiralPath(centerX: number, centerY: number, radius: number, phase = 0) {
  const maxTurns = Math.PI * 4.9;
  const steps = 54;
  let path = '';

  for (let index = 0; index <= steps; index += 1) {
    const t = (index / steps) * maxTurns;
    const r = radius * (1 - index / (steps * 1.18));
    const x = centerX + Math.cos(t + phase) * r;
    const y = centerY + Math.sin(t + phase) * r * 0.68;
    path += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  return path;
}
