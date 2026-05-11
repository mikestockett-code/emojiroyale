import { useCallback } from 'react';
import type { BoardCell, WinnerInfo } from '../../types';
import type { AudioSourceKey } from '../../lib/audio';
import { getWinSound } from '../../lib/audio';
import { getWinner } from '../../lib/winDetection';
import type { TurnEndMeta } from '../useGameBoard';

type SoloTurnMeta = TurnEndMeta;

type SoloWinHandlerOptions = {
  playSound: (key: AudioSourceKey) => void;
  suppressLegendaryWins?: boolean;
  showRoundResult: (
    title: string,
    type: 'win' | 'epic' | 'legendary' | null,
    lineIndices: number[],
  ) => void;
  grantPlayerWinReward: (winner: NonNullable<WinnerInfo>, wasRollWin: boolean, isWizardOfOzJackpot?: boolean) => void;
  clearRewardPreview: () => void;
  applyPlayerWinRollReward: (winner: NonNullable<WinnerInfo>) => void;
  setCurrentPlayer: (player: 'player1' | 'player2') => void;
};

export function useSoloWinHandler({
  playSound,
  suppressLegendaryWins = false,
  showRoundResult,
  grantPlayerWinReward,
  clearRewardPreview,
  applyPlayerWinRollReward,
  setCurrentPlayer,
}: SoloWinHandlerOptions) {
  const handleResolvedBoard = useCallback((nextBoard: BoardCell[], meta: SoloTurnMeta) => {
    const nextWinner = getWinner(nextBoard, { suppressLegendary: suppressLegendaryWins });
    if (!nextWinner) return false;

    playSound(getWinSound(nextWinner.type, nextWinner.player === 'player1'));
    showRoundResult(
      nextWinner.player === 'player1' ? 'You Win' : 'CPU Wins',
      nextWinner.player === 'player1' ? nextWinner.type : null,
      nextWinner.indices,
    );

    if (nextWinner.player === 'player1') {
      grantPlayerWinReward(nextWinner, meta.moveType === 'roll', meta.effectId === 'tornado');
      applyPlayerWinRollReward(nextWinner);
    } else {
      clearRewardPreview();
    }

    return true;
  }, [
    applyPlayerWinRollReward,
    clearRewardPreview,
    grantPlayerWinReward,
    playSound,
    showRoundResult,
    suppressLegendaryWins,
  ]);

  const handlePlayerTurnEnd = useCallback((nextBoard: BoardCell[], meta: SoloTurnMeta) => {
    if (handleResolvedBoard(nextBoard, meta)) return;
    setCurrentPlayer('player2');
  }, [handleResolvedBoard, setCurrentPlayer]);

  const handleCpuMoveComplete = useCallback((nextBoard: BoardCell[]) => {
    if (handleResolvedBoard(nextBoard, { moveType: 'place' })) return;
    setCurrentPlayer('player1');
  }, [handleResolvedBoard, setCurrentPlayer]);

  return {
    handlePlayerTurnEnd,
    handleCpuMoveComplete,
  };
}
