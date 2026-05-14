// Thin wrapper — delegates to the unified cpuDecision engine.
// Solo callers keep their existing imports; the engine is now float-scale.
import type { BoardCell, SoloModeId } from '../types';
import { getCpuDecision, getSoloCpuDifficulty } from './cpuDecision';

export type SoloCpuDecision = {
  type: 'place' | 'roll';
  boardIndex?: number;
  rollTargetIndex?: number;
};

type DecisionParams = {
  board: BoardCell[];
  difficultyLevel: number;  // now accepts floats 1.0–5.0
  cpuHasRollsLeft: boolean;
};

export function getSoloCpuDecision({ board, difficultyLevel, cpuHasRollsLeft }: DecisionParams): SoloCpuDecision {
  return getCpuDecision({ board, difficulty: difficultyLevel, cpuHasRollsLeft });
}

export function getSoloCpuDifficultyLevel(mode: SoloModeId, roundNumber: number): number {
  return getSoloCpuDifficulty(mode, roundNumber);
}
