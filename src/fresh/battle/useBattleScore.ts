import { useCallback, useState } from 'react';
import type { Player, WinnerInfo } from '../../types';
import { getScoreForWinner } from '../../lib/gameScoreRules';

const BATTLE_WIN_SCORE = 2000;

export function useBattleScore() {
  const [playerBattleScore, setPlayerBattleScore] = useState(0);
  const [cpuBattleScore, setCpuBattleScore] = useState(0);
  const [battleOver, setBattleOver] = useState(false);

  const applyRoundWinScore = useCallback((winner: NonNullable<WinnerInfo>, wasRollWin = false) => {
    const roundScore = getScoreForWinner(winner, wasRollWin);
    const winnerPlayer: Player = winner.player;
    const setScore = winnerPlayer === 'player1' ? setPlayerBattleScore : setCpuBattleScore;
    setScore((prev) => {
      const next = prev + roundScore;
      if (next >= BATTLE_WIN_SCORE) setBattleOver(true);
      return next;
    });
  }, []);

  const resetBattleScore = useCallback(() => {
    setPlayerBattleScore(0);
    setCpuBattleScore(0);
    setBattleOver(false);
  }, []);

  return {
    playerBattleScore,
    cpuBattleScore,
    battleOver,
    applyRoundWinScore,
    resetBattleScore,
  };
}
