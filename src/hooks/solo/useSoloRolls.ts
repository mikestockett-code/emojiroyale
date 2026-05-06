import { useCallback, useState } from 'react';
import type { WinnerInfo } from '../../types';

const STARTING_ROLLS = 3;
const MAX_ROLLS = 4;

export function useSoloRolls() {
  const [playerRollsRemaining, setPlayerRollsRemaining] = useState(STARTING_ROLLS);
  const [cpuRollsRemaining, setCpuRollsRemaining] = useState(STARTING_ROLLS);

  const consumePlayerRoll = useCallback(() => {
    setPlayerRollsRemaining((count) => Math.max(0, count - 1));
  }, []);

  const consumeCpuRoll = useCallback(() => {
    setCpuRollsRemaining((count) => Math.max(0, count - 1));
  }, []);

  const applyPlayerWinRollReward = useCallback((winner: NonNullable<WinnerInfo>) => {
    if (winner.type === 'legendary') {
      setPlayerRollsRemaining((count) => Math.min(MAX_ROLLS, count + 2));
    } else if (winner.type === 'epic') {
      setPlayerRollsRemaining((count) => Math.min(MAX_ROLLS, count + 1));
    } else {
      setCpuRollsRemaining((count) => Math.min(MAX_ROLLS, count + 1));
    }
  }, []);

  const resetRolls = useCallback(() => {
    setPlayerRollsRemaining(STARTING_ROLLS);
    setCpuRollsRemaining(STARTING_ROLLS);
  }, []);

  return {
    playerRollsRemaining,
    cpuRollsRemaining,
    consumePlayerRoll,
    consumeCpuRoll,
    applyPlayerWinRollReward,
    resetRolls,
  };
}
