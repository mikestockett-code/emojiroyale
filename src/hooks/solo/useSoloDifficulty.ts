import { useCallback, useState } from 'react';
import { getSoloCpuDifficultyLevel } from '../../lib/soloCpuDecision';
import type { SoloModeId } from '../../types';

type SoloDifficultyResult = {
  effectiveDifficulty: number;
  suppressLegendaryWins: boolean;
  handleEpicWin: () => void;
  resetEpicBump: () => void;
};

export function useSoloDifficulty(soloMode: SoloModeId, soloRoundNumber: number): SoloDifficultyResult {
  const [epicBump, setEpicBump] = useState(0);
  const baseDifficulty = getSoloCpuDifficultyLevel(soloMode, soloRoundNumber);
  const effectiveDifficulty = Math.min(5.0, baseDifficulty + epicBump);
  const suppressLegendaryWins = soloMode === 'practice' && soloRoundNumber < 3;

  const handleEpicWin = useCallback(() => {
    setEpicBump(prev => Math.min(5.0, prev + baseDifficulty * 0.1));
  }, [baseDifficulty]);

  const resetEpicBump = useCallback(() => {
    setEpicBump(0);
  }, []);

  return { effectiveDifficulty, suppressLegendaryWins, handleEpicWin, resetEpicBump };
}
