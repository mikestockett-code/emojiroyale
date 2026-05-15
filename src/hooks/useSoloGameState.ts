import { useCallback } from 'react';
import { useTieDetection } from './useTieDetection';
import { useSoloCpu } from './useSoloCpu';
import { useModeBoardController } from './useModeBoardController';
import { createSharedPlayerRacks } from '../lib/sharedRackLogic';
import type { BattlePowerSlotId } from '../types';
import type { FreshSoloSetup } from '../fresh/solo/soloSetup.types';
import { useAudioContext } from '../fresh/audio/AudioContext';
import { useGameResultOverlay } from './useGameResultOverlay';
import { useSoloRewards } from './solo/useSoloRewards';
import { useSoloRolls } from './solo/useSoloRolls';
import { useSoloRound } from './solo/useSoloRound';
import { useSoloCpuPowers } from './solo/useSoloCpuPowers';
import { useSoloWinHandler } from './solo/useSoloWinHandler';
import { useSoloDifficulty } from './solo/useSoloDifficulty';
import type { SoloGameStateOptions } from './solo/soloGameStateTypes';
export type { SoloGameStateOptions } from './solo/soloGameStateTypes';

export function useSoloGameState(soloSetup: FreshSoloSetup, options: SoloGameStateOptions) {
  const { playSound } = useAudioContext();
  const soloMode = soloSetup.modeId ?? 'practice';

  const round = useSoloRound();

  const resultOverlay = useGameResultOverlay();
  const rolls = useSoloRolls();
  const rewards = useSoloRewards({
    activeProfileId: options.activeProfileId,
    albumPuzzlePieces: options.albumPuzzlePieces,
    soloSetup,
    onGrantAlbumSticker: options.onGrantAlbumSticker,
    onGrantAlbumPuzzlePiece: options.onGrantAlbumPuzzlePiece,
  });
  const {
    soloRoundNumber,
    currentPlayer,
    isSoloCpuThinking,
    setCurrentPlayer,
    setIsSoloCpuThinking,
    advanceRound,
    resetRound,
  } = round;
  const {
    winnerTitle,
    winnerType,
    winningLineIndices,
    isResultOverlayVisible,
    showRoundResult,
    resetRoundResult,
  } = resultOverlay;
  const {
    playerRollsRemaining,
    cpuRollsRemaining,
    consumePlayerRoll,
    consumeCpuRoll,
    applyPlayerWinRollReward,
    resetRolls,
  } = rolls;
  const {
    rewardPreview,
    runRewardPreviews,
    currentScore,
    grantPlayerWinReward,
    clearRewardPreview,
    resetRewards,
  } = rewards;
  const {
    effectiveDifficulty,
    suppressLegendaryWins,
    handleEpicWin,
    resetEpicBump,
  } = useSoloDifficulty(soloMode, soloRoundNumber);

  const { handlePlayerTurnEnd, handleCpuMoveComplete } = useSoloWinHandler({
    playSound,
    suppressLegendaryWins,
    showRoundResult,
    grantPlayerWinReward,
    clearRewardPreview,
    applyPlayerWinRollReward,
    setCurrentPlayer,
    onPlayerEpicWin: handleEpicWin,
  });

  const {
    board,
    playerRacks,
    selectedEmojiIndex,
    lastMoveIndex,
    rackScales,
    rollFlow,
    selectedPowerSlotId,
    setSelectedPowerSlotId,
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1,
    showEp1Launch,
    handleSquarePress,
    handleSelectRackIndex,
    setBoard,
    setPlayerRacks,
    setLastMoveIndex,
    resetBoardState,
    powerSlotsByPlayer,
    buildPowerSlotsArrayForPlayer,
    handlePowerSlotPress,
    resetPowers,
  } = useModeBoardController({
    currentPlayer,
    onTurnEnd: handlePlayerTurnEnd,
    powerLoadouts: {
      player1: soloSetup.powerSlotIds,
      player2: { slot1: null, slot2: null },
    },
    rollsDisabled:
      Boolean(winnerTitle) ||
      playerRollsRemaining <= 0 ||
      currentPlayer !== 'player1' ||
      isSoloCpuThinking,
    interactionDisabled:
      Boolean(winnerTitle) ||
      currentPlayer !== 'player1' ||
      isSoloCpuThinking,
    soloMode,
    roundNumber: soloRoundNumber,
    initialPlayerRacks: createSharedPlayerRacks(undefined, { soloMode, roundNumber: soloRoundNumber }),
    onRollConsumed: consumePlayerRoll,
    playSound,
  });

  const { interceptCpuTurn, refillCpuPower, resetCpuPowers } = useSoloCpuPowers({
    setBoard,
    setLastMoveIndex,
    showEp1Launch,
  });

  useSoloCpu({
    board,
    currentPlayer,
    winnerTitle,
    soloMode,
    soloRoundNumber,
    cpuDifficultyLevel: effectiveDifficulty,
    cpuRollsRemaining,
    playerRacks,
    rollFlow,
    onCpuRollUsed: consumeCpuRoll,
    onCpuPowerRefill: refillCpuPower,
    setIsSoloCpuThinking,
    setBoard,
    setPlayerRacks,
    setLastMoveIndex,
    onEp1Launched: showEp1Launch,
    onCpuMoveComplete: handleCpuMoveComplete,
    interceptCpuTurn,
  });

  useTieDetection({
    board,
    isRoundOver: Boolean(winnerTitle),
    playerRollsRemaining,
    cpuRollsRemaining,
    totalPowerUsesRemaining: (powerSlotsByPlayer.player1.slot1?.usesLeft ?? 0) + (powerSlotsByPlayer.player1.slot2?.usesLeft ?? 0),
    onTie: () => { playSound('button'); showRoundResult('Draw', null, []); },
  });

  const buildPowerSlotsArray = useCallback(
    (selectedPowerSlotId: BattlePowerSlotId | null) => buildPowerSlotsArrayForPlayer('player1', selectedPowerSlotId),
    [buildPowerSlotsArrayForPlayer],
  );

  const resetBoardForRound = useCallback((roundNumber: number) => {
    resetBoardState(undefined, createSharedPlayerRacks(undefined, { soloMode, roundNumber }));
  }, [resetBoardState, soloMode]);

  const handleContinue = useCallback(() => {
    resetBoardForRound(soloRoundNumber + 1);
    resetRoundResult();
    clearRewardPreview();
    advanceRound();
  }, [advanceRound, clearRewardPreview, resetBoardForRound, resetRoundResult, soloRoundNumber]);

  const handleRestart = useCallback(() => {
    resetBoardForRound(1);
    resetRoundResult();
    resetRewards();
    resetRolls();
    resetRound();
    resetPowers();
    resetCpuPowers();
    resetEpicBump();
  }, [resetBoardForRound, resetCpuPowers, resetEpicBump, resetPowers, resetRewards, resetRolls, resetRound, resetRoundResult]);

  return {
    board,
    rack: playerRacks.player1,
    selectedEmojiIndex,
    lastMoveIndex,
    winningLineIndices,
    winnerTitle,
    winnerType,
    isResultOverlayVisible,
    rewardPreview,
    runRewardPreviews,
    currentScore,
    playerRollsRemaining,
    cpuRollsRemaining,
    currentPlayer,
    isSoloCpuThinking,
    soloRoundNumber,
    rackScales,
    rollFlow,
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1,
    buildPowerSlotsArray,
    selectedPowerSlotId,
    handlePowerSlotPress,
    handleSquarePress,
    handleSelectRackIndex,
    handleContinue,
    handleRestart,
  };
}
