import type { BoardCell } from '../types';
import { applyFourSquarePower, applyTornadoPower } from './battlePowerEffects';

const BOARD_COLS = 5;

export type GameBoardEffectId = 'removeTile' | 'clearRow' | 'clearColumn' | 'fourSquare' | 'tornado';

export type GameBoardEffectEvent = {
  id: GameBoardEffectId;
  label: string;
  affectedIndices: number[];
  affectedTiles?: Array<{ index: number; cell: NonNullable<BoardCell> }>;
  nonce: number;
};

type GameBoardEffect = {
  id: GameBoardEffectId;
  label: string;
};

const RANDOM_EP1_EFFECTS: GameBoardEffect[] = [
  { id: 'removeTile', label: 'Remove Tile' },
  { id: 'clearRow', label: 'Clear Row' },
  { id: 'clearColumn', label: 'Clear Column' },
  { id: 'fourSquare', label: 'Four Square' },
  { id: 'tornado', label: 'Tornado' },
];

const FOUR_SQUARE_CORNERS = [
  [0, 1, 5, 6],
  [3, 4, 8, 9],
  [15, 16, 20, 21],
  [18, 19, 23, 24],
] as const;

export type GameBoardEffectResult = {
  nextBoard: BoardCell[];
  lastMoveIndex: number | null;
  effectId: GameBoardEffectId;
  effectLabel: string;
  affectedIndices: number[];
};

export function createGameBoardEffectEvent(
  id: GameBoardEffectId,
  label: string,
  affectedIndices: number[],
  board?: BoardCell[],
): GameBoardEffectEvent {
  return {
    id,
    label,
    affectedIndices,
    affectedTiles: board
      ? affectedIndices.flatMap((index) => {
          const cell = board[index];
          return cell ? [{ index, cell }] : [];
        })
      : undefined,
    nonce: Date.now(),
  };
}

export function applyRandomGameBoardEffect(
  board: BoardCell[],
  targetIndex: number,
  previousEffectId?: GameBoardEffectId | null,
): GameBoardEffectResult {
  const validEffects = RANDOM_EP1_EFFECTS.filter((effect) => {
    if (effect.id === previousEffectId) return false;
    if (effect.id === 'fourSquare') {
      return FOUR_SQUARE_CORNERS.some((corner) => corner.some((index) => board[index] !== null));
    }
    if (effect.id === 'tornado') {
      return board.some(Boolean);
    }
    return board[targetIndex] !== null;
  });
  const pool = validEffects.length > 0 ? validEffects : RANDOM_EP1_EFFECTS.filter((effect) => effect.id !== previousEffectId);
  const effect = pool[Math.floor(Math.random() * pool.length)] ?? RANDOM_EP1_EFFECTS[0];

  if (effect.id === 'fourSquare') {
    const result = applyFourSquarePower(board);
    return {
      nextBoard: result.nextBoard,
      lastMoveIndex: result.lastMoveIndex,
      effectId: effect.id,
      effectLabel: effect.label,
      affectedIndices: result.affectedIndices,
    };
  }

  if (effect.id === 'tornado') {
    const result = applyTornadoPower(board);
    return {
      nextBoard: result.nextBoard,
      lastMoveIndex: result.lastMoveIndex,
      effectId: effect.id,
      effectLabel: effect.label,
      affectedIndices: result.affectedIndices,
    };
  }

  const nextBoard = [...board];
  let affectedIndices: number[] = [targetIndex];

  if (effect.id === 'removeTile') {
    nextBoard[targetIndex] = null;
  } else if (effect.id === 'clearRow') {
    const row = Math.floor(targetIndex / BOARD_COLS);
    affectedIndices = [];
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const index = row * BOARD_COLS + col;
      affectedIndices.push(index);
      nextBoard[index] = null;
    }
  } else if (effect.id === 'clearColumn') {
    const col = targetIndex % BOARD_COLS;
    affectedIndices = [];
    for (let row = 0; row < BOARD_COLS; row += 1) {
      const index = row * BOARD_COLS + col;
      affectedIndices.push(index);
      nextBoard[index] = null;
    }
  }

  return {
    nextBoard,
    lastMoveIndex: targetIndex,
    effectId: effect.id,
    effectLabel: effect.label,
    affectedIndices,
  };
}
