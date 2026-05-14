import { useCallback, useEffect, useRef, useState } from 'react';
import { useTieDetection } from '../../hooks/useTieDetection';
import type { BattlePowerId, BoardCell, Player } from '../../types';
import type { TurnEndMeta } from '../../hooks/useGameBoard';
import { useRoundTimer } from '../../hooks/useRoundTimer';
import { useSoloCpu, type CpuTurnContext } from '../../hooks/useSoloCpu';
import { useModeBoardController } from '../../hooks/useModeBoardController';
import { useBattleScore } from './useBattleScore';
import { getWinner } from '../../lib/winDetection';
import { createSharedPlayerRacks } from '../../lib/sharedRackLogic';
import { getScoreForWinner } from '../../lib/gameScoreRules';
import type { FreshBattleSetup } from './battleSetup.types';
import { useAudioContext } from '../audio/AudioContext';
import { getWinSound } from '../../lib/audio';
import { isEpicOrLegendaryWinner } from '../../lib/roundResult';
import { getCpuBaseDifficulty, getCpuPersonality } from './battleCpuConfig';
import { useBattleRewards, type BattleRewardOptions } from './useBattleRewards';
import { useToddNervousMistake } from './useToddNervousMistake';
import { useNicoBehavior } from './useNicoBehavior';

const ROUND_TIMER_SECONDS = 120;
export type BattleRoundEndReason = 'playerWin' | 'cpuWin' | 'timeout' | 'tie';

export type BattleRoundEndState = {
  reason: BattleRoundEndReason;
  roundNumber: number;
  battleComplete?: boolean;
};

export function useBattleGameState(setup: FreshBattleSetup, rewardOptions: BattleRewardOptions = {}) {
  const { playSound } = useAudioContext();
  const stageNumber   = setup.stageNumber ?? 1;
  const cpuId         = setup.cpuId ?? 'todd';
  const personality   = getCpuPersonality(cpuId);
  const stageBaseDifficulty = getCpuBaseDifficulty(cpuId, stageNumber);
  const baseDifficulty = Math.max(stageBaseDifficulty, setup.startingDifficulty ?? stageBaseDifficulty);

  // Float difficulty — can be bumped adaptively during the battle
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(baseDifficulty);
  const bumpDifficulty = useCallback((delta: number) => {
    setAdaptiveDifficulty(prev => Math.min(personality.difficultyMax, prev + delta));
  }, [personality.difficultyMax]);

  // Track which score thresholds have already triggered a difficulty bump this stage
  const scoreThresholdsBumpedRef = useRef<Set<number>>(new Set());

  const [currentPlayer, setCurrentPlayer]   = useState<Player>('player1');
  const [winner, setWinner]                 = useState<ReturnType<typeof getWinner>>(null);
  const [roundNumber, setRoundNumber]       = useState(1);
  const [roundEndState, setRoundEndState]   = useState<BattleRoundEndState | null>(null);
  const [timerFrozen, setTimerFrozen]       = useState(false);
  const [tortureUsedThisTurn, setTortureUsedThisTurn] = useState(false);
  const [playerRollsRemaining, setPlayerRollsRemaining] = useState(3);
  const [roundTauntText, setRoundTauntText] = useState<string | null>(null);
  const roundTauntTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { playerBattleScore, cpuBattleScore, battleOver, applyRoundWinScore, resetBattleScore } = useBattleScore();
  const battleRewards  = useBattleRewards({ cpuId, stageNumber, rewardOptions });
  const todd           = useToddNervousMistake(cpuId);
  const nico           = useNicoBehavior();
  const { isTimerStealing } = todd;

  // Track player's last move to feed Nico's square-reaction
  const prevPlayerRef    = useRef<Player>('player1');
  const lastMoveIndexRef = useRef<number | null>(null);
  const playerMoveCountRef = useRef(0);
  const playerPowerUseCountRef = useRef(0);
  const nicoIntroShownRef = useRef(false);

  useEffect(() => () => {
    if (roundTauntTimerRef.current) clearTimeout(roundTauntTimerRef.current);
  }, []);

  useEffect(() => {
    if (cpuId !== 'nico') return;
    if (stageNumber !== 1) return;
    if (nicoIntroShownRef.current) return;
    nicoIntroShownRef.current = true;
    const timer = setTimeout(() => nico.triggerStageIntro(stageNumber), 650);
    return () => clearTimeout(timer);
  }, [cpuId, nico, stageNumber]);

  const showRoundTaunt = useCallback(() => {
    const lines = personality.lines.roundTaunt ?? personality.lines.nervous;
    if (lines.length === 0) return;
    const line = lines[Math.floor(Math.random() * lines.length)] ?? null;
    if (cpuId === 'todd') {
      todd.showThoughtText(line);
      return;
    }
    setRoundTauntText(line);
    if (roundTauntTimerRef.current) clearTimeout(roundTauntTimerRef.current);
    roundTauntTimerRef.current = setTimeout(() => {
      setRoundTauntText(null);
      roundTauntTimerRef.current = null;
    }, 3200);
  }, [cpuId, personality, todd]);

  const handleTimerExpire = useCallback(() => {
    setRoundEndState({ reason: 'timeout', roundNumber });
  }, [roundNumber]);

  const { seconds: timerSeconds, resetTimer, addSeconds: addTimerSeconds } = useRoundTimer({
    initialSeconds: ROUND_TIMER_SECONDS,
    isPaused: Boolean(roundEndState) || Boolean(winner),
    isFrozen: timerFrozen,
    warningAtSeconds: 8,
    warningSound: 'heartbeat',
    playSound,
    onExpire: handleTimerExpire,
  });

  const finishTurn = useCallback((nextBoard: BoardCell[], meta?: TurnEndMeta) => {
    if (currentPlayer === 'player1') {
      playerMoveCountRef.current += 1;
      if (meta?.moveType === 'power') playerPowerUseCountRef.current += 1;
    }

    const nextWinner = getWinner(nextBoard);
    if (nextWinner) {
      const wasTornadoWin = meta?.effectId === 'tornado';
      playSound(getWinSound(nextWinner.type, nextWinner.player === 'player1'));
      setWinner(nextWinner);
      const roundScore = getScoreForWinner(nextWinner, meta?.moveType === 'roll', wasTornadoWin);
      const nextPlayerScore = nextWinner.player === 'player1' ? playerBattleScore + roundScore : playerBattleScore;
      const nextCpuScore    = nextWinner.player === 'player2' ? cpuBattleScore + roundScore    : cpuBattleScore;
      const battleComplete  = nextWinner.player === 'player1' ? nextPlayerScore >= 2000 : nextCpuScore >= 2000;
      applyRoundWinScore(nextWinner, meta?.moveType === 'roll', wasTornadoWin);
      if (nextWinner.player === 'player1') {
        battleRewards.grantPlayerRoundRewards(nextWinner, meta?.moveType === 'roll', battleComplete);
        // Adaptive bump: player epic win → CPU gets harder
        if (isEpicOrLegendaryWinner(nextWinner)) {
          bumpDifficulty(personality.epicAdaptDelta);
        }
        const moveBump = playerMoveCountRef.current <= 6 ? 0.5 : playerMoveCountRef.current <= 10 ? 0.25 : 0;
        const powerBump = playerPowerUseCountRef.current === 0 ? 0.2 : 0;
        const timeBump = timerSeconds >= 75 ? 0.35 : timerSeconds >= 45 ? 0.18 : 0;
        const performanceBump = moveBump + powerBump + timeBump;
        if (performanceBump > 0) {
          bumpDifficulty(performanceBump);
        }
      } else if (battleComplete) {
        battleRewards.clearCpuBattleCompleteRewards();
      }
      setRoundEndState({ reason: nextWinner.player === 'player1' ? 'playerWin' : 'cpuWin', roundNumber, battleComplete });
      return;
    }
    setTortureUsedThisTurn(false);
    setCurrentPlayer(p => p === 'player1' ? 'player2' : 'player1');
  }, [applyRoundWinScore, battleRewards, bumpDifficulty, cpuBattleScore, currentPlayer, personality.epicAdaptDelta, playSound, playerBattleScore, roundNumber, timerSeconds]);

  const createBattleEpiPowerHandler = useCallback(({ rerollCurrentRack }: { rerollCurrentRack: () => void }) => (
    powerId: BattlePowerId,
  ) => {
    if (powerId === 'power-plus-10-seconds') { addTimerSeconds(10); todd.triggerPlayerPowerResponse(); return true; }
    if (powerId === 'power-clock-freeze')    { setTimerFrozen(true); playSound('iceFreeze'); todd.triggerPlayerPowerResponse(); return true; }
    if (powerId === 'power-reverse-time')    { resetTimer(ROUND_TIMER_SECONDS); todd.triggerPlayerPowerResponse(); return true; }
    if (powerId === 'power-rerack')          { if (tortureUsedThisTurn) return false; rerollCurrentRack(); return true; }
    return false;
  }, [addTimerSeconds, playSound, resetTimer, todd, tortureUsedThisTurn]);

  const {
    board, playerRacks, selectedEmojiIndex, rackScales, lastMoveIndex,
    rollFlow, selectedPowerSlotId, ep1Visible, ep1EffectLabel, ep1AnimationEvent, clearEp1, showEp1Launch,
    handleSquarePress, handleSelectRackIndex,
    setBoard, setPlayerRacks, setLastMoveIndex,
    resetBoardState,
    powerSlotsByPlayer, buildPowerSlotsArrayForPlayer,
    handlePowerSlotPress, resetPowers,
  } = useModeBoardController({
    currentPlayer,
    onTurnEnd: finishTurn,
    powerLoadouts: {
      player1: setup.powerSlotIds,
      player2: { slot1: null, slot2: null },
    },
    allowEpi: true,
    rollsDisabled: Boolean(winner) || Boolean(roundEndState) || currentPlayer !== 'player1' || playerRollsRemaining <= 0,
    interactionDisabled: Boolean(winner) || Boolean(roundEndState) || currentPlayer !== 'player1',
    soloMode: 'battle',
    roundNumber,
    initialPlayerRacks: createSharedPlayerRacks(),
    onRackLocked: () => setTortureUsedThisTurn(true),
    onRollConsumed: () => setPlayerRollsRemaining(c => Math.max(0, c - 1)),
    playSound,
    createOnEpiPower: createBattleEpiPowerHandler,
  });

  // Keep a ref to lastMoveIndex so the effect below can read it without triggering
  lastMoveIndexRef.current = lastMoveIndex;

  useTieDetection({
    board,
    isRoundOver: Boolean(winner || roundEndState),
    playerRollsRemaining,
    cpuRollsRemaining: 0, // Battle CPU never rolls
    totalPowerUsesRemaining: (powerSlotsByPlayer.player1.slot1?.usesLeft ?? 0) + (powerSlotsByPlayer.player1.slot2?.usesLeft ?? 0),
    onTie: () => setRoundEndState({ reason: 'tie', roundNumber }),
  });

  // Bump difficulty as player score crosses 501 / 1001 / 1501
  useEffect(() => {
    const thresholds = [501, 1001, 1501];
    for (const t of thresholds) {
      if (playerBattleScore >= t && !scoreThresholdsBumpedRef.current.has(t)) {
        scoreThresholdsBumpedRef.current.add(t);
        bumpDifficulty(0.3);
      }
    }
  }, [playerBattleScore, bumpDifficulty]);

  // Nico reacts when currentPlayer flips from player1 → player2 (player just moved)
  useEffect(() => {
    if (cpuId !== 'nico') return;
    if (prevPlayerRef.current === 'player1' && currentPlayer === 'player2') {
      nico.triggerPlayerSquareResponse(board, lastMoveIndexRef.current);
    }
    prevPlayerRef.current = currentPlayer;
  }, [currentPlayer, cpuId, board, nico]);

  const powerSlotsArray = buildPowerSlotsArrayForPlayer('player1');

  const interceptCpuTurn = useCallback((ctx: CpuTurnContext) => {
    if (cpuId === 'nico') {
      return nico.executeTurn(ctx, { playerRacks, roundNumber, stageNumber, setBoard, setPlayerRacks, setLastMoveIndex, showEp1Launch, onBumpDifficulty: bumpDifficulty });
    }
    return todd.executeTurn(ctx, { addTimerSeconds, setBoard, setLastMoveIndex, showEp1Launch, playerRacks, rollFlow, roundNumber, setPlayerRacks, timerFrozen });
  }, [cpuId, nico, todd, addTimerSeconds, setBoard, setLastMoveIndex, showEp1Launch, playerRacks, rollFlow, roundNumber, stageNumber, setPlayerRacks, bumpDifficulty, timerFrozen]);

  useSoloCpu({
    board,
    currentPlayer,
    winnerTitle: winner || roundEndState ? 'battle-over' : null,
    soloMode: 'battle',
    soloRoundNumber: roundNumber,
    cpuDifficultyLevel: adaptiveDifficulty,
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

  const resetCpuBehaviorRound = useCallback(() => {
    todd.resetToddRound();
    nico.resetNicoRound();
  }, [todd, nico]);

  const resetCpuBehavior = useCallback(() => {
    todd.resetTodd();
    nico.resetNico();
  }, [todd, nico]);

  const handleContinue = useCallback(() => {
    if (roundEndState?.battleComplete) return;
    resetBoardState(undefined, createSharedPlayerRacks());
    setCurrentPlayer(roundNumber % 2 === 0 ? 'player1' : 'player2');
    setWinner(null);
    battleRewards.clearRewardPreview();
    setRoundEndState(null);
    setTimerFrozen(false);
    resetCpuBehaviorRound();
    setTortureUsedThisTurn(false);
    resetPowers();
    playerMoveCountRef.current = 0;
    playerPowerUseCountRef.current = 0;
    setRoundNumber(r => r + 1);
    showRoundTaunt();
  }, [battleRewards, resetBoardState, resetCpuBehaviorRound, resetPowers, roundEndState?.battleComplete, roundNumber, showRoundTaunt]);

  const handleBattleReset = useCallback(() => {
    resetBoardState(undefined, createSharedPlayerRacks());
    setCurrentPlayer('player1');
    setWinner(null);
    battleRewards.resetBattleRewards();
    setRoundEndState(null);
    resetTimer(ROUND_TIMER_SECONDS);
    setTimerFrozen(false);
    resetCpuBehavior();
    setTortureUsedThisTurn(false);
    resetPowers();
    setRoundNumber(1);
    setPlayerRollsRemaining(3);
    resetBattleScore();
    setAdaptiveDifficulty(baseDifficulty);
    setRoundTauntText(null);
    playerMoveCountRef.current = 0;
    playerPowerUseCountRef.current = 0;
    scoreThresholdsBumpedRef.current = new Set();
  }, [baseDifficulty, battleRewards, resetBattleScore, resetBoardState, resetCpuBehavior, resetPowers, resetTimer]);

  const cpuThoughtText = roundTauntText ?? (cpuId === 'nico' ? nico.thoughtText : todd.thoughtText);

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
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1,
    powerSlotsArray,
    selectedPowerSlotId,
    rewardPreview: battleRewards.rewardPreview,
    pendingStickerRewards: battleRewards.pendingStickerRewards,
    playerBattleScore,
    cpuBattleScore,
    playerRollsRemaining,
    battleOver,
    toddThoughtText: cpuThoughtText,   // kept same key so BattleGameScreen needs no change
    isTimerStealing,
    adaptiveDifficulty,
    handleSquarePress,
    handleSelectRackIndex,
    handlePowerSlotPress,
    handleContinue,
    handleBattleReset,
  };
}
