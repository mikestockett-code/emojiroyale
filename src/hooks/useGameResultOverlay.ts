import { useCallback, useState } from 'react';
import { useDelayedVisibility } from './useDelayedVisibility';

export type GameResultType = 'win' | 'epic' | 'legendary' | null;

export function useGameResultOverlay() {
  const [winnerTitle, setWinnerTitle] = useState<string | null>(null);
  const [winnerType, setWinnerType] = useState<GameResultType>(null);
  const [winningLineIndices, setWinningLineIndices] = useState<number[]>([]);
  const isResultOverlayVisible = useDelayedVisibility(Boolean(winnerTitle), 2000);

  const showRoundResult = useCallback((title: string, type: GameResultType, lineIndices: number[]) => {
    setWinnerTitle(title);
    setWinnerType(type);
    setWinningLineIndices(lineIndices);
  }, []);

  const resetRoundResult = useCallback(() => {
    setWinnerTitle(null);
    setWinnerType(null);
    setWinningLineIndices([]);
  }, []);

  return {
    winnerTitle,
    winnerType,
    winningLineIndices,
    isResultOverlayVisible,
    showRoundResult,
    resetRoundResult,
  };
}
