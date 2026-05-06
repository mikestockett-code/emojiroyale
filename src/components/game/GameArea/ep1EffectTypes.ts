import type { BoardCell } from '../../../types';
import type { GameBoardEffectEvent } from '../../../lib/gameBoardEffects';

export type BoardPoint = { x: number; y: number };

export type EffectGeometry = {
  left: number;
  top: number;
  width: number;
  height: number;
  localPoints: BoardPoint[];
  linePath: string;
  start: BoardPoint;
  end: BoardPoint;
};

export type EffectProps = {
  geometry: EffectGeometry;
  cellSize: number;
};

export type TornadoLiftedTilesProps = {
  boardCells: BoardPoint[];
  cellSize: number;
  event: GameBoardEffectEvent;
  geometry: EffectGeometry;
};

export type TornadoLiftedTileProps = {
  cell: NonNullable<BoardCell>;
  cellSize: number;
  delayMs: number;
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
};
