import type { BattlePowerId, BoardCell, Player } from '../types';
import { applyFourSquarePower, applyTornadoPower } from './battlePowerEffects';

const BOARD_COLS = 5;
const BOARD_ROWS = 5;

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

const TARGETED_EP1_EFFECTS: Partial<Record<BattlePowerId, GameBoardEffect>> = {
  'power-remove-emoji': { id: 'removeTile', label: 'Remove Tile' },
  'power-clear-row': { id: 'clearRow', label: 'Clear Row' },
  'power-clear-column': { id: 'clearColumn', label: 'Clear Column' },
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
  actingPlayer?: Player,
): GameBoardEffectResult {
  const validEffects = RANDOM_EP1_EFFECTS.filter((effect) => {
    if (effect.id === previousEffectId) return false;
    if (effect.id === 'fourSquare') {
      return FOUR_SQUARE_CORNERS.some((corner) => corner.some((index) => board[index] !== null));
    }
    if (effect.id === 'tornado') {
      return board.some(Boolean);
    }
    return selectEffectTargetIndex(board, targetIndex, effect.id, actingPlayer) !== null;
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
  const effectTargetIndex = selectEffectTargetIndex(board, targetIndex, effect.id, actingPlayer) ?? targetIndex;
  let affectedIndices: number[] = [effectTargetIndex];

  if (effect.id === 'removeTile') {
    nextBoard[effectTargetIndex] = null;
  } else if (effect.id === 'clearRow') {
    const row = Math.floor(effectTargetIndex / BOARD_COLS);
    affectedIndices = [];
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const index = row * BOARD_COLS + col;
      affectedIndices.push(index);
      nextBoard[index] = null;
    }
  } else if (effect.id === 'clearColumn') {
    const col = effectTargetIndex % BOARD_COLS;
    affectedIndices = [];
    for (let row = 0; row < BOARD_ROWS; row += 1) {
      const index = row * BOARD_COLS + col;
      affectedIndices.push(index);
      nextBoard[index] = null;
    }
  }

  return {
    nextBoard,
    lastMoveIndex: effectTargetIndex,
    effectId: effect.id,
    effectLabel: effect.label,
    affectedIndices,
  };
}

export function applyTargetedGameBoardEffect(
  board: BoardCell[],
  targetIndex: number,
  powerId: BattlePowerId,
): GameBoardEffectResult | null {
  const effect = TARGETED_EP1_EFFECTS[powerId];
  if (!effect || board[targetIndex] === null) return null;

  return applyKnownBoardEffect(board, targetIndex, effect);
}

function applyKnownBoardEffect(
  board: BoardCell[],
  targetIndex: number,
  effect: GameBoardEffect,
): GameBoardEffectResult {
  const nextBoard = [...board];
  let affectedIndices: number[] = [targetIndex];

  if (effect.id === 'removeTile') {
    nextBoard[targetIndex] = null;
  } else if (effect.id === 'clearRow') {
    const row = Math.floor(targetIndex / BOARD_COLS);
    affectedIndices = getLineIndices(row, 'row');
    affectedIndices.forEach((index) => {
      nextBoard[index] = null;
    });
  } else if (effect.id === 'clearColumn') {
    const col = targetIndex % BOARD_COLS;
    affectedIndices = getLineIndices(col, 'column');
    affectedIndices.forEach((index) => {
      nextBoard[index] = null;
    });
  }

  return {
    nextBoard,
    lastMoveIndex: targetIndex,
    effectId: effect.id,
    effectLabel: effect.label,
    affectedIndices,
  };
}

function selectEffectTargetIndex(
  board: BoardCell[],
  fallbackTargetIndex: number,
  effectId: GameBoardEffectId,
  actingPlayer?: Player,
) {
  if (effectId === 'removeTile') {
    // Only valid when opponent actually has tiles — never erase own stickers
    return pickOpponentTileIndex(board, actingPlayer);
  }

  if (effectId === 'clearRow') {
    return pickBestLineTargetIndex(board, actingPlayer, 'row') ?? pickOccupiedIndex(board, fallbackTargetIndex);
  }

  if (effectId === 'clearColumn') {
    return pickBestLineTargetIndex(board, actingPlayer, 'column') ?? pickOccupiedIndex(board, fallbackTargetIndex);
  }

  return pickOccupiedIndex(board, fallbackTargetIndex);
}

function getOpponentPlayer(player?: Player): Player | null {
  if (!player) return null;
  return player === 'player1' ? 'player2' : 'player1';
}

function pickOpponentTileIndex(board: BoardCell[], actingPlayer?: Player) {
  const opponent = getOpponentPlayer(actingPlayer);
  if (!opponent) return null;
  const opponentIndices = board
    .map((cell, index) => (cell?.player === opponent ? index : -1))
    .filter((index) => index >= 0);
  if (opponentIndices.length === 0) return null;
  return opponentIndices[Math.floor(Math.random() * opponentIndices.length)] ?? null;
}

function pickBestLineTargetIndex(
  board: BoardCell[],
  actingPlayer: Player | undefined,
  lineType: 'row' | 'column',
) {
  const opponent = getOpponentPlayer(actingPlayer);
  if (!opponent) return null;

  let bestLineIndex = -1;
  let bestOpponentCount = 0;
  let bestOwnCount = Number.POSITIVE_INFINITY;

  for (let lineIndex = 0; lineIndex < BOARD_COLS; lineIndex += 1) {
    const indices = getLineIndices(lineIndex, lineType);
    const opponentCount = indices.filter((index) => board[index]?.player === opponent).length;
    if (opponentCount === 0) continue;

    const ownCount = indices.filter((index) => board[index]?.player === actingPlayer).length;
    if (
      opponentCount > bestOpponentCount ||
      (opponentCount === bestOpponentCount && ownCount < bestOwnCount)
    ) {
      bestLineIndex = lineIndex;
      bestOpponentCount = opponentCount;
      bestOwnCount = ownCount;
    }
  }

  if (bestLineIndex < 0) return null;
  const bestLine = getLineIndices(bestLineIndex, lineType);
  return bestLine.find((index) => board[index]?.player === opponent) ?? null;
}

function getLineIndices(lineIndex: number, lineType: 'row' | 'column') {
  if (lineType === 'row') {
    return Array.from({ length: BOARD_COLS }, (_, col) => lineIndex * BOARD_COLS + col);
  }
  return Array.from({ length: BOARD_ROWS }, (_, row) => row * BOARD_COLS + lineIndex);
}

function pickOccupiedIndex(board: BoardCell[], fallbackTargetIndex: number) {
  if (board[fallbackTargetIndex] !== null) return fallbackTargetIndex;
  const occupiedIndices = board
    .map((cell, index) => (cell ? index : -1))
    .filter((index) => index >= 0);
  if (occupiedIndices.length === 0) return null;
  return occupiedIndices[Math.floor(Math.random() * occupiedIndices.length)] ?? null;
}
