import type { BoardCell, WinnerInfo } from '../types';
import { GRID_WIDTH } from '../constants/gameConstants';
import { LEGENDARY_STICKER_IDS } from './stickerHelpers';

// COMMENTED OUT — replaced by per-win Solo reward system
// export const REWARD_DROP_RATES: Record<NonNullable<WinnerInfo>['type'], Array<{ rarity: Rarity; chance: number }>> = { ... };
// export const HIDDEN_SON_PLATINUM_DROP_CHANCE = 0.0002;
// export function getRewardStickerPool(...) { ... }
// export function rollRewardRarity(...) { ... }
// export function getRandomRewardSticker(...) { ... }

export function getEmptyBoardIndexes(board: BoardCell[]) {
  return board.reduce<number[]>((indexes, cell, index) => {
    if (cell === null) indexes.push(index);
    return indexes;
  }, []);
}

export function getSoloBoardPositionScore(index: number) {
  const row = Math.floor(index / GRID_WIDTH);
  const col = index % GRID_WIDTH;
  const centerDistance = Math.abs(row - 2) + Math.abs(col - 2);
  return 6 - centerDistance;
}

export function getSoloCpuBoardScore(board: BoardCell[]) {
  const directions = [
    { rowStep: 0, colStep: 1 },
    { rowStep: 1, colStep: 0 },
    { rowStep: 1, colStep: 1 },
    { rowStep: 1, colStep: -1 },
  ];

  let score = 0;

  for (let row = 0; row < GRID_WIDTH; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      for (const { rowStep, colStep } of directions) {
        const cells: BoardCell[] = [];
        for (let offset = 0; offset < 4; offset++) {
          const nextRow = row + rowStep * offset;
          const nextCol = col + colStep * offset;
          if (nextRow < 0 || nextRow >= GRID_WIDTH || nextCol < 0 || nextCol >= GRID_WIDTH) {
            cells.length = 0;
            break;
          }
          cells.push(board[nextRow * GRID_WIDTH + nextCol]);
        }
        if (cells.length !== 4) continue;

        const cpuCount = cells.filter((cell) => cell?.player === 'player2').length;
        const playerCount = cells.filter((cell) => cell?.player === 'player1').length;
        if (playerCount === 0) score += cpuCount * cpuCount * 6;
        if (cpuCount === 0) score -= playerCount * playerCount * 3;
      }
    }
  }

  return score;
}

export function getWinner(board: BoardCell[], options?: { suppressLegendary?: boolean }): WinnerInfo {
  const directions = [
    { rowStep: 0, colStep: 1 },
    { rowStep: 1, colStep: 0 },
    { rowStep: 1, colStep: 1 },
    { rowStep: 1, colStep: -1 },
  ];

  const getLine = (row: number, col: number, rowStep: number, colStep: number, length: number) => {
    const line: NonNullable<BoardCell>[] = [];
    const indices: number[] = [];
    for (let offset = 0; offset < length; offset++) {
      const nextRow = row + rowStep * offset;
      const nextCol = col + colStep * offset;
      if (nextRow < 0 || nextRow >= GRID_WIDTH || nextCol < 0 || nextCol >= GRID_WIDTH) return null;
      const nextIndex = nextRow * GRID_WIDTH + nextCol;
      const nextCell = board[nextIndex];
      if (nextCell === null) return null;
      line.push(nextCell);
      indices.push(nextIndex);
    }
    return { line, indices };
  };

  for (let row = 0; row < GRID_WIDTH; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      for (const { rowStep, colStep } of directions) {
        const legendaryLine = getLine(row, col, rowStep, colStep, 3);
        if (legendaryLine && !options?.suppressLegendary) {
          const firstPlayer = legendaryLine.line[0].player;
          const sameOwner = legendaryLine.line.every((tile) => tile.player === firstPlayer);
          const stickerIds = new Set(legendaryLine.line.map((tile) => tile.stickerId));
          const isLegendarySet =
            stickerIds.size === LEGENDARY_STICKER_IDS.length &&
            LEGENDARY_STICKER_IDS.every((stickerId) => stickerIds.has(stickerId));
          if (sameOwner && isLegendarySet) {
            return { player: firstPlayer, type: 'legendary', indices: legendaryLine.indices };
          }
        }

        const epicLine = getLine(row, col, rowStep, colStep, 3);
        if (epicLine) {
          const firstPlayer = epicLine.line[0].player;
          const sameOwner = epicLine.line.every((tile) => tile.player === firstPlayer);
          const uniqueStickers = new Set(epicLine.line.map((tile) => tile.stickerId));
          if (sameOwner && uniqueStickers.size === 1) {
            return { player: firstPlayer, type: 'epic', indices: epicLine.indices };
          }
        }

        const fourTileLine = getLine(row, col, rowStep, colStep, 4);
        if (fourTileLine) {
          const firstPlayer = fourTileLine.line[0].player;
          const sameOwner = fourTileLine.line.every((t) => t.player === firstPlayer);
          const uniqueStickers = new Set(fourTileLine.line.map((t) => t.stickerId));
          if (sameOwner && uniqueStickers.size === 4) {
            return { player: firstPlayer, type: 'win', indices: fourTileLine.indices };
          }
        }
      }
    }
  }
  return null;
}
