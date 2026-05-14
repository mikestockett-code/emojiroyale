import type { BoardCell } from '../types';

export function isBoardFull(board: BoardCell[]): boolean {
  return board.length > 0 && board.every(cell => cell !== null);
}
