import { useCallback } from 'react';
import { useGameBoard } from './useGameBoard';
import { useSoloCpu } from './useSoloCpu';
import { createSharedPlayerRacks } from '../lib/sharedRackLogic';
import type { FreshSoloSetup } from '../fresh/solo/soloSetup.types';
import { useAudioContext } from '../fresh/audio/AudioContext';
import { useGameResultOverlay } from './useGameResultOverlay';
import { useSoloRewards } from './solo/useSoloRewards';
import { useSoloRolls } from './solo/useSoloRolls';
import { useSoloRound } from './solo/useSoloRound';
import { useSoloWinHandler } from './solo/useSoloWinHandler';
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
  const suppressLegendaryWins = soloMode === 'practice' && soloRoundNumber < 3;

  const { handlePlayerTurnEnd, handleCpuMoveComplete } = useSoloWinHandler({
    playSound,
    suppressLegendaryWins,
    showRoundResult,
    grantPlayerWinReward,
    clearRewardPreview,
    applyPlayerWinRollReward,
    setCurrentPlayer,
  });

  const {
    board,
    playerRacks,
    selectedEmojiIndex,
    lastMoveIndex,
    rackScales,
    rollFlow,
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
  } = useGameBoard({
    currentPlayer,
    onTurnEnd: handlePlayerTurnEnd,
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

  useSoloCpu({
    board,
    currentPlayer,
    winnerTitle,
    soloMode,
    soloRoundNumber,
    cpuRollsRemaining,
    playerRacks,
    rollFlow,
    onCpuRollUsed: consumeCpuRoll,
    setIsSoloCpuThinking,
    setBoard,
    setPlayerRacks,
    setLastMoveIndex,
    onEp1Launched: showEp1Launch,
    onCpuMoveComplete: handleCpuMoveComplete,
  });

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
  }, [resetBoardForRound, resetRewards, resetRolls, resetRound, resetRoundResult]);

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
    handleSquarePress,
    handleSelectRackIndex,
    handleContinue,
    handleRestart,
  };
}
