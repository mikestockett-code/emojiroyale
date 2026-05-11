import { useCallback, useMemo, useState } from 'react';
import type {
  BoardCell,
  Player,
} from '../../types';
import { useGameBoard, type TurnEndMeta } from '../../hooks/useGameBoard';
import { useRoundTimer } from '../../hooks/useRoundTimer';
import { useSoloCpu, type CpuTurnContext } from '../../hooks/useSoloCpu';
import { useGamePowerSlots, toGameBoardPowerSlot } from '../../hooks/useGamePowerSlots';
import { useGamePowerPress } from '../../hooks/useGamePowerPress';
import { useBattleScore } from './useBattleScore';
import { getWinner } from '../../lib/winDetection';
import { createSharedPlayerRacks } from '../../lib/sharedRackLogic';
import { getScoreForWinner } from '../../lib/gameScoreRules';
import type { FreshBattleSetup } from './battleSetup.types';
import { useAudioContext } from '../audio/AudioContext';
import { getWinSound } from '../../lib/audio';
import { getBattleCpuDifficulty } from './battleCpuConfig';
import { useBattleRewards, type BattleRewardOptions } from './useBattleRewards';
import { useToddNervousMistake } from './useToddNervousMistake';

const ROUND_TIMER_SECONDS = 120;
export type BattleRoundEndReason = 'playerWin' | 'cpuWin' | 'timeout';

export type BattleRoundEndState = {
  reason: BattleRoundEndReason;
  roundNumber: number;
  battleComplete?: boolean;
};

export function useBattleGameState(setup: FreshBattleSetup, rewardOptions: BattleRewardOptions = {}) {
  const { playSound } = useAudioContext();
  const stageNumber = setup.stageNumber ?? 1;
  const cpuId = setup.cpuId ?? 'todd';
  const cpuDifficultyLevel = getBattleCpuDifficulty(cpuId, stageNumber);

  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [winner, setWinner] = useState<ReturnType<typeof getWinner>>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundEndState, setRoundEndState] = useState<BattleRoundEndState | null>(null);
  const [timerFrozen, setTimerFrozen] = useState(false);
  const [tortureUsedThisTurn, setTortureUsedThisTurn] = useState(false);
  const [playerRollsRemaining, setPlayerRollsRemaining] = useState(3);

  const {
    playerBattleScore,
    cpuBattleScore,
    battleOver,
    applyRoundWinScore,
    resetBattleScore,
  } = useBattleScore();
  const battleRewards = useBattleRewards({ stageNumber, rewardOptions });
  const todd = useToddNervousMistake(cpuId);
  const { isTimerStealing } = todd;

  const handleTimerExpire = useCallback(() => {
    setRoundEndState({ reason: 'timeout', roundNumber });
  }, [roundNumber]);

  const {
    seconds: timerSeconds,
    resetTimer,
    addSeconds: addTimerSeconds,
  } = useRoundTimer({
    initialSeconds: ROUND_TIMER_SECONDS,
    isPaused: Boolean(roundEndState) || Boolean(winner),
    isFrozen: timerFrozen,
    warningAtSeconds: 10,
    playSound,
    onExpire: handleTimerExpire,
  });

  const {
    powerSlotData,
    buildPowerSlotsArray,
    consumePower,
    resetPowers,
  } = useGamePowerSlots(setup.powerSlotIds, { allowEpi: true });

  const finishTurn = useCallback((nextBoard: BoardCell[], meta?: TurnEndMeta) => {
    const nextWinner = getWinner(nextBoard);
    if (nextWinner) {
      playSound(getWinSound(nextWinner.type, nextWinner.player === 'player1'));
      setWinner(nextWinner);
      const roundScore = getScoreForWinner(nextWinner, meta?.moveType === 'roll');
      const nextPlayerBattleScore = nextWinner.player === 'player1'
        ? playerBattleScore + roundScore
        : playerBattleScore;
      const nextCpuBattleScore = nextWinner.player === 'player2'
        ? cpuBattleScore + roundScore
        : cpuBattleScore;
      const battleComplete = nextPlayerBattleScore >= 2000 || nextCpuBattleScore >= 2000;
      applyRoundWinScore(nextWinner, meta?.moveType === 'roll');
      if (nextWinner.player === 'player1') {
        battleRewards.grantPlayerRoundRewards(
          nextWinner,
          meta?.moveType === 'roll',
          battleComplete,
          meta?.effectId === 'tornado',
        );
      } else if (battleComplete) {
        battleRewards.clearCpuBattleCompleteRewards();
      }
      setRoundEndState({
        reason: nextWinner.player === 'player1' ? 'playerWin' : 'cpuWin',
        roundNumber,
        battleComplete,
      });
      return;
    }
    setTortureUsedThisTurn(false);
    setCurrentPlayer((player) => (player === 'player1' ? 'player2' : 'player1'));
  }, [applyRoundWinScore, battleRewards, cpuBattleScore, playSound, playerBattleScore, roundNumber]);

  const {
    board,
    playerRacks,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    rollFlow,
    selectedPowerSlotId,
    ep1AnimationEvent,
    showEp1Launch,
    handleSquarePress,
    handleSelectRackIndex,
    setBoard,
    setPlayerRacks,
    setLastMoveIndex,
    setSelectedPowerSlotId,
    resetBoardState,
    rerollCurrentRack,
  } = useGameBoard({
    currentPlayer,
    onTurnEnd: finishTurn,
    rollsDisabled: Boolean(winner) || Boolean(roundEndState) || currentPlayer !== 'player1' || playerRollsRemaining <= 0,
    interactionDisabled: Boolean(winner) || Boolean(roundEndState) || currentPlayer !== 'player1',
    soloMode: 'battle',
    roundNumber,
    initialPlayerRacks: createSharedPlayerRacks(),
    powerSlots: {
      slot1: toGameBoardPowerSlot(powerSlotData.slot1),
      slot2: toGameBoardPowerSlot(powerSlotData.slot2),
    },
    onConsumePower: consumePower,
    onRackLocked: () => setTortureUsedThisTurn(true),
    onRollConsumed: () => setPlayerRollsRemaining((count) => Math.max(0, count - 1)),
    playSound,
  });

  const powerSlotsArray = useMemo(
    () => buildPowerSlotsArray(selectedPowerSlotId),
    [buildPowerSlotsArray, selectedPowerSlotId],
  );

  const interceptCpuTurn = useCallback((ctx: CpuTurnContext) =>
    todd.executeTurn(ctx, { addTimerSeconds, setBoard, setLastMoveIndex, showEp1Launch, playerRacks, rollFlow, roundNumber, setPlayerRacks }),
  [todd, addTimerSeconds, setBoard, setLastMoveIndex, showEp1Launch, playerRacks, rollFlow, roundNumber, setPlayerRacks]);

  useSoloCpu({
    board,
    currentPlayer,
    winnerTitle: winner || roundEndState ? 'battle-over' : null,
    soloMode: 'battle',
    soloRoundNumber: roundNumber,
    cpuDifficultyLevel,
    cpuRollsRemaining: 0,
    playerRacks,
    rollFlow,
    setBoard,
    setPlayerRacks,
    setLastMoveIndex,
    onEp1Launched: showEp1Launch,
    onCpuMoveComplete: finishTurn,
    interceptCpuTurn,
  });

  const handleEpiPower = useCallback((powerId: string) => {
    if (powerId === 'power-plus-10-seconds') {
      addTimerSeconds(10);
      todd.triggerPlayerPowerResponse();
      return true;
    }
    if (powerId === 'power-clock-freeze') {
      setTimerFrozen(true);
      playSound('iceFreeze');
      todd.triggerPlayerPowerResponse();
      return true;
    }
    if (powerId === 'power-reverse-time') {
      resetTimer(ROUND_TIMER_SECONDS);
      todd.triggerPlayerPowerResponse();
      return true;
    }
    if (powerId === 'power-rerack') {
      if (tortureUsedThisTurn) return false;
      rerollCurrentRack();
      return true;
    }
    return false;
  }, [addTimerSeconds, playSound, rerollCurrentRack, resetTimer, todd, tortureUsedThisTurn]);

  const handlePowerSlotPress = useGamePowerPress({
    board,
    powerSlots: powerSlotData,
    disabled: Boolean(winner) || Boolean(roundEndState) || currentPlayer !== 'player1',
    selectedPowerSlotId,
    setSelectedPowerSlotId,
    consumePower,
    setBoard,
    setLastMoveIndex,
    showEp1Launch,
    finishTurn,
    onEpiPower: handleEpiPower,
  });

  const handleContinue = useCallback(() => {
    if (roundEndState?.battleComplete) return;
    resetBoardState(undefined, createSharedPlayerRacks());
    setCurrentPlayer('player1');
    setWinner(null);
    battleRewards.clearRewardPreview();
    setRoundEndState(null);
    if (roundEndState?.reason === 'timeout') resetTimer(ROUND_TIMER_SECONDS);
    setTimerFrozen(false);
    todd.resetTodd();
    setTortureUsedThisTurn(false);
    resetPowers();
    setRoundNumber((round) => round + 1);
  }, [battleRewards, resetBoardState, resetPowers, resetTimer, roundEndState?.battleComplete, roundEndState?.reason, todd]);

  const handleBattleReset = useCallback(() => {
    resetBoardState(undefined, createSharedPlayerRacks());
    setCurrentPlayer('player1');
    setWinner(null);
    battleRewards.resetBattleRewards();
    setRoundEndState(null);
    resetTimer(ROUND_TIMER_SECONDS);
    setTimerFrozen(false);
    todd.resetTodd();
    setTortureUsedThisTurn(false);
    resetPowers();
    setRoundNumber(1);
    setPlayerRollsRemaining(3);
    resetBattleScore();
  }, [battleRewards, resetBattleScore, resetBoardState, resetPowers, resetTimer, todd]);

  return {
    board,
    currentRack: playerRacks.player1,
    currentPlayer,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    winner,
    roundNumber,
    roundEndState,
    timerSeconds,
    timerFrozen,
    rollFlow,
    ep1AnimationEvent,
    powerSlotsArray,
    selectedPowerSlotId,
    rewardPreview: battleRewards.rewardPreview,
    pendingStickerRewards: battleRewards.pendingStickerRewards,
    playerBattleScore,
    cpuBattleScore,
    playerRollsRemaining,
    battleOver,
    isWizardOfOzJackpot: battleRewards.isWizardOfOzJackpot,
    toddThoughtText: todd.thoughtText,
    isTimerStealing,
    handleSquarePress,
    handleSelectRackIndex,
    handlePowerSlotPress,
    handleContinue,
    handleBattleReset,
  };
}
