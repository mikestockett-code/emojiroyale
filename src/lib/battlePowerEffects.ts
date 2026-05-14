import type { BoardCell } from '../types';

const FOUR_SQUARE_CORNERS = [
  [0, 1, 5, 6],
  [3, 4, 8, 9],
  [15, 16, 20, 21],
  [18, 19, 23, 24],
] as const;

export type FourSquareCorner = typeof FOUR_SQUARE_CORNERS[number];

function applyFourSquareCorner(board: BoardCell[], corner: FourSquareCorner) {
  const nextBoard = [...board];
  corner.forEach((index) => {
    nextBoard[index] = null;
  });

  return {
    nextBoard,
    lastMoveIndex: corner[0],
    affectedIndices: [...corner],
  };
}

export function getBestFourSquareCorner(board: BoardCell[], targetPlayer: 'player1' | 'player2' = 'player1') {
  let bestCorner: FourSquareCorner | null = null;
  let bestTargetCount = 0;
  let bestAnyCount = 0;

  for (const corner of FOUR_SQUARE_CORNERS) {
    const targetCount = corner.filter((index) => board[index]?.player === targetPlayer).length;
    const anyCount = corner.filter((index) => board[index] !== null).length;
    if (
      targetCount > bestTargetCount ||
      (targetCount === bestTargetCount && anyCount > bestAnyCount)
    ) {
      bestCorner = corner;
      bestTargetCount = targetCount;
      bestAnyCount = anyCount;
    }
  }

  return bestCorner && bestAnyCount > 0 ? bestCorner : null;
}

export function applyFourSquarePower(board: BoardCell[], cornerOverride?: FourSquareCorner | null) {
  if (cornerOverride) {
    return applyFourSquareCorner(board, cornerOverride);
  }

  const occupiedCorners = FOUR_SQUARE_CORNERS.filter((corner) => corner.some((index) => board[index] !== null));
  if (occupiedCorners.length === 0) {
    return {
      nextBoard: [...board],
      lastMoveIndex: null,
      affectedIndices: [],
    };
  }
  const cornerPool = occupiedCorners;
  const corner = cornerPool[Math.floor(Math.random() * cornerPool.length)];
  return applyFourSquareCorner(board, corner);
}

export function applyTornadoPower(board: BoardCell[]) {
  const occupied = board.reduce<{ cell: NonNullable<typeof board[0]>; idx: number }[]>(
    (acc, cell, idx) => {
      if (cell) acc.push({ cell, idx });
      return acc;
    },
    [],
  );
  const nextBoard = Array.from({ length: board.length }, () => null) as BoardCell[];

  if (occupied.length === 0) {
    return {
      nextBoard: [...board],
      lastMoveIndex: null,
      affectedIndices: [],
    };
  }

  const sourceIndices = occupied.map((entry) => entry.idx);
  const cells = shuffle(occupied.map((entry) => entry.cell));
  let destinationIndices = pickRandomIndices(board.length, occupied.length);

  if (board.length > occupied.length || occupied.length > 1) {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const hasMovedTile = destinationIndices.some((destinationIndex, index) => destinationIndex !== sourceIndices[index]);
      if (hasMovedTile) break;
      destinationIndices = pickRandomIndices(board.length, occupied.length);
    }
  }

  destinationIndices.forEach((destinationIndex, index) => {
    nextBoard[destinationIndex] = cells[index] ?? null;
  });

  return {
    nextBoard,
    lastMoveIndex: null,
    affectedIndices: Array.from(new Set([...sourceIndices, ...destinationIndices])),
  };
}

function pickRandomIndices(length: number, count: number) {
  return shuffle(Array.from({ length }, (_, index) => index)).slice(0, count);
}

function shuffle<T>(items: T[]) {
  const nextItems = [...items];
  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }
  return nextItems;
}
