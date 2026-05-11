import type { BoardCell, WinnerInfo } from '../types';
import { GRID_WIDTH } from '../constants/gameConstants';
import { LEGENDARY_STICKER_IDS } from './stickerHelpers';

type Direction = {
  rowStep: number;
  colStep: number;
};

const WIN_DIRECTIONS: Direction[] = [
  { rowStep: 0, colStep: 1 },
  { rowStep: 1, colStep: 0 },
  { rowStep: 1, colStep: 1 },
  { rowStep: 1, colStep: -1 },
];

function getLine(
  board: BoardCell[],
  row: number,
  col: number,
  rowStep: number,
  colStep: number,
  length: number,
) {
  const line: NonNullable<BoardCell>[] = [];
  const indices: number[] = [];

  for (let offset = 0; offset < length; offset += 1) {
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
}

export function getWinner(board: BoardCell[], options?: { suppressLegendary?: boolean }): WinnerInfo {
  for (let row = 0; row < GRID_WIDTH; row += 1) {
    for (let col = 0; col < GRID_WIDTH; col += 1) {
      for (const { rowStep, colStep } of WIN_DIRECTIONS) {
        const legendaryLine = getLine(board, row, col, rowStep, colStep, 3);
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

        const epicLine = getLine(board, row, col, rowStep, colStep, 3);
        if (epicLine) {
          const firstPlayer = epicLine.line[0].player;
          const sameOwner = epicLine.line.every((tile) => tile.player === firstPlayer);
          const uniqueStickers = new Set(epicLine.line.map((tile) => tile.stickerId));

          if (sameOwner && uniqueStickers.size === 1) {
            return { player: firstPlayer, type: 'epic', indices: epicLine.indices };
          }
        }

        const fourTileLine = getLine(board, row, col, rowStep, colStep, 4);
        if (fourTileLine) {
          const firstPlayer = fourTileLine.line[0].player;
          const sameOwner = fourTileLine.line.every((tile) => tile.player === firstPlayer);
          const uniqueStickers = new Set(fourTileLine.line.map((tile) => tile.stickerId));

          if (sameOwner && uniqueStickers.size === 4) {
            return { player: firstPlayer, type: 'win', indices: fourTileLine.indices };
          }
        }
      }
    }
  }

  return null;
}
