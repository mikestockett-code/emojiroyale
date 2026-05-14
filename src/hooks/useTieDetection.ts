import { useEffect } from 'react';
import type { BoardCell } from '../types';
import { isBoardFull } from '../lib/tieDetection';

type Props = {
  board: BoardCell[];
  isRoundOver: boolean;
  playerRollsRemaining: number;
  cpuRollsRemaining: number;
  totalPowerUsesRemaining: number;
  onTie: () => void;
};

export function useTieDetection({
  board,
  isRoundOver,
  playerRollsRemaining,
  cpuRollsRemaining,
  totalPowerUsesRemaining,
  onTie,
}: Props) {
  useEffect(() => {
    if (isRoundOver) return;
    if (!isBoardFull(board)) return;
    if (playerRollsRemaining > 0 || cpuRollsRemaining > 0) return;
    if (totalPowerUsesRemaining > 0) return;
    onTie();
  }, [board, isRoundOver, playerRollsRemaining, cpuRollsRemaining, totalPowerUsesRemaining]);
}
