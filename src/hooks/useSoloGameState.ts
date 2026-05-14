import { useCallback, useRef, useState } from 'react';
import { useTieDetection } from './useTieDetection';
import { useSoloCpu, CPU_ROLL_FINISH_DELAY_MS } from './useSoloCpu';
import { useModeBoardController } from './useModeBoardController';
import { useEP1Powers } from './useEP1Powers';
import { createSharedPlayerRacks } from '../lib/sharedRackLogic';
import { getSoloCpuDifficultyLevel } from '../lib/soloCpuDecision';
import { applyFourSquarePower, applyTornadoPower } from '../lib/battlePowerEffects';
import {
  applyTargetedGameBoardEffect,
  createGameBoardEffectEvent,
  type GameBoardEffectResult,
} from '../lib/gameBoardEffects';
import type { BattlePowerId, BattlePowerSlotId, BattlePowerSlotLoadout, BoardCell } from '../types';
import type { FreshSoloSetup } from '../fresh/solo/soloSetup.types';
import { useAudioContext } from '../fresh/audio/AudioContext';
import { useGameResultOverlay } from './useGameResultOverlay';
import { useSoloRewards } from './solo/useSoloRewards';
import { useSoloRolls } from './solo/useSoloRolls';
import { useSoloRound } from './solo/useSoloRound';
import { useSoloWinHandler } from './solo/useSoloWinHandler';
import type { SoloGameStateOptions } from './solo/soloGameStateTypes';
import { BATTLE_TEST_POWERS } from '../data/battlePowers';
export type { SoloGameStateOptions } from './solo/soloGameStateTypes';

const CPU_EP1_POOL: BattlePowerId[] = [
  'power-four-square',
  'power-tornado',
  'power-clear-row',
  'power-clear-column',
  'power-remove-emoji',
];

function applyCpuEP1Power(powerId: BattlePowerId, board: BoardCell[]): GameBoardEffectResult | null {
  if (powerId === 'power-four-square') {
    const r = applyFourSquarePower(board);
    return r.affectedIndices.length > 0 ? { ...r, effectId: 'fourSquare', effectLabel: 'Four Square' } : null;
  }
  if (powerId === 'power-tornado') {
    const r = applyTornadoPower(board);
    return r.affectedIndices.length > 0 ? { ...r, effectId: 'tornado', effectLabel: 'Tornado' } : null;
  }
  const p1Idx = board.findIndex(c => c?.player === 'player1');
  if (p1Idx < 0) return null;
  return applyTargetedGameBoardEffect(board, p1Idx, powerId);
}

export function useSoloGameState(soloSetup: FreshSoloSetup, options: SoloGameStateOptions) {
  const { playSound } = useAudioContext();
  const soloMode = soloSetup.modeId ?? 'practice';

  const [epicBump, setEpicBump] = useState(0);

  // CPU gets 2 random EP1 powers once per game run, stable across rounds
  const [cpuSlotIds] = useState<BattlePowerSlotLoadout>(() => {
    const shuffled = [...CPU_EP1_POOL].sort(() => Math.random() - 0.5);
    return { slot1: shuffled[0], slot2: shuffled[1] };
  });
  const cpuEp1 = useEP1Powers(cpuSlotIds);
  const cpuMoveCountRef = useRef(0);

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

  const baseDifficulty = getSoloCpuDifficultyLevel(soloMode, soloRoundNumber);
  const effectiveDifficulty = Math.min(5.0, baseDifficulty + epicBump);

  const handleEpicWin = useCallback(() => {
    setEpicBump(prev => Math.min(5.0, prev + baseDifficulty * 0.1));
  }, [baseDifficulty]);

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

  const interceptCpuTurn = useCallback((ctx: { board: BoardCell[]; finishTurn: (b: BoardCell[], delay?: number) => void }) => {
    cpuMoveCountRef.current += 1;
    if (cpuMoveCountRef.current <= 1) return false;
    if (ctx.board.filter(c => c !== null).length < 5) return false;
    const slotId = (['slot1', 'slot2'] as const).find(
      s => cpuSlotIds[s] && cpuEp1.usesLeft(s) > 0,
    );
    if (!slotId) return false;
    const result = applyCpuEP1Power(cpuSlotIds[slotId]!, ctx.board);
    if (!result) return false;
    cpuEp1.consume(slotId);
    setBoard(result.nextBoard);
    setLastMoveIndex(result.lastMoveIndex);
    showEp1Launch(
      createGameBoardEffectEvent(result.effectId, result.effectLabel, result.affectedIndices, ctx.board),
      true,
      `CPU used ${result.effectLabel} emoji power`,
    );
    ctx.finishTurn(result.nextBoard, CPU_ROLL_FINISH_DELAY_MS);
    return true;
  }, [cpuEp1, cpuSlotIds, setBoard, setLastMoveIndex, showEp1Launch]);

  const refillCpuPower = useCallback(() => {
    const slotId = (['slot1', 'slot2'] as const).find((slot) => cpuSlotIds[slot] && cpuEp1.usesLeft(slot) <= 0)
      ?? (cpuSlotIds.slot1 ? 'slot1' : cpuSlotIds.slot2 ? 'slot2' : null);
    if (!slotId) return null;
    cpuEp1.refill(slotId);
    const powerId = cpuSlotIds[slotId];
    const label = BATTLE_TEST_POWERS.find((power) => power.id === powerId)?.label ?? 'Emoji Power';
    return { label, bonusCount: 1, banked: cpuEp1.usesLeft(slotId) > 0 };
  }, [cpuEp1, cpuSlotIds]);

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
    cpuEp1.reset();
    cpuMoveCountRef.current = 0;
    setEpicBump(0);
  }, [cpuEp1, resetBoardForRound, resetPowers, resetRewards, resetRolls, resetRound, resetRoundResult]);

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
