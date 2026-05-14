import { useCallback, useState } from 'react';
import type { Player } from '../../types';

export function useSoloRound() {
  const [soloRoundNumber, setSoloRoundNumber] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [isSoloCpuThinking, setIsSoloCpuThinking] = useState(false);

  const advanceRound = useCallback(() => {
    setSoloRoundNumber((round) => round + 1);
    setCurrentPlayer(soloRoundNumber % 2 === 0 ? 'player1' : 'player2');
    setIsSoloCpuThinking(false);
  }, [soloRoundNumber]);

  const resetRound = useCallback(() => {
    setSoloRoundNumber(1);
    setCurrentPlayer('player1');
    setIsSoloCpuThinking(false);
  }, []);

  return {
    soloRoundNumber,
    currentPlayer,
    isSoloCpuThinking,
    setCurrentPlayer,
    setIsSoloCpuThinking,
    advanceRound,
    resetRound,
  };
}
