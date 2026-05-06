import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  BattlePowerId,
  BattlePowerSlotId,
  BattlePowerType,
  BoardCell,
  Player,
} from '../../types';
import { useGameBoard } from '../../hooks/useGameBoard';
import { useEP1Powers } from '../../hooks/useEP1Powers';
import { useSoloCpu } from '../../hooks/useSoloCpu';
import { useBattleEpiPowers } from './useBattleEpiPowers';
import { applyFourSquarePower, applyTornadoPower } from '../../lib/battlePowerEffects';
import { createGameBoardEffectEvent } from '../../lib/gameBoardEffects';
import { getWinner } from '../../lib/scoring';
import { createSharedPlayerRacks } from '../../lib/sharedRackLogic';
import { BATTLE_TEST_POWERS } from '../../data/battlePowers';
import type { FreshBattleSetup } from './battleSetup.types';
import { useAudioContext } from '../audio/AudioContext';
import { getWinSound } from '../../lib/audio';

const ROUND_TIMER_SECONDS = 130;
const BATTLE_WIN_SCORE = 2000;

function getBattleRoundScore(winType: string): number {
  if (winType === 'legendary') return 2000;
  if (winType === 'epic') return 750;
  return 250;
}

export type BattleRoundEndReason = 'playerWin' | 'cpuWin' | 'timeout';

export type BattleRoundEndState = {
  reason: BattleRoundEndReason;
  roundNumber: number;
};

export function useBattleGameState(
  setup: FreshBattleSetup,
  albumCounts?: Record<string, number>,
) {
  const { playSound } = useAudioContext();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerAlarmFiredRef = useRef(false);

  const ep1 = useEP1Powers(setup.powerSlotIds);
  const epi = useBattleEpiPowers(setup.powerSlotIds, albumCounts);

  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [winner, setWinner] = useState<ReturnType<typeof getWinner>>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundEndState, setRoundEndState] = useState<BattleRoundEndState | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(ROUND_TIMER_SECONDS);
  const [timerFrozen, setTimerFrozen] = useState(false);
  const [tortureUsedThisTurn, setTortureUsedThisTurn] = useState(false);
  const [, setIsSoloCpuThinking] = useState(false);
  const [playerBattleScore, setPlayerBattleScore] = useState(0);
  const [cpuBattleScore, setCpuBattleScore] = useState(0);
  const [playerRollsRemaining, setPlayerRollsRemaining] = useState(3);
  const [battleOver, setBattleOver] = useState(false);

  useEffect(() => {
    if (roundEndState || winner) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (timerFrozen) return;
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          clearInterval(timerRef.current!);
          setRoundEndState({ reason: 'timeout', roundNumber });
          return 0;
        }
        if (seconds === 11 && !timerAlarmFiredRef.current) {
          timerAlarmFiredRef.current = true;
          playSound('timer');
        }
        return seconds - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playSound, roundEndState, roundNumber, timerFrozen, winner]);

  const powerSlotData = useMemo(() => {
    const result: Record<
      BattlePowerSlotId,
      { powerId: BattlePowerId; type: BattlePowerType; label: string; icon: string; usesLeft: number } | null
    > = { slot1: null, slot2: null };

    (['slot1', 'slot2'] as BattlePowerSlotId[]).forEach((slotId) => {
      const powerId = setup.powerSlotIds[slotId];
      if (!powerId) return;
      const power = BATTLE_TEST_POWERS.find((entry) => entry.id === powerId);
      if (!power) return;
      const usesLeft = power.type === 'EP1' ? ep1.usesLeft(slotId) : epi.epiUsesLeft[slotId];
      result[slotId] = { powerId, type: power.type, label: power.label, icon: power.icon, usesLeft };
    });

    return result;
  }, [ep1, epi.epiUsesLeft, setup.powerSlotIds]);

  const consumePower = useCallback((slotId: BattlePowerSlotId) => {
    const slot = powerSlotData[slotId];
    if (!slot) return;
    if (slot.type === 'EP1') ep1.consume(slotId);
    else epi.consume(slotId);
  }, [ep1, epi, powerSlotData]);

  const finishTurn = useCallback((nextBoard: BoardCell[]) => {
    const nextWinner = getWinner(nextBoard);
    if (nextWinner) {
      playSound(getWinSound(nextWinner.type, nextWinner.player === 'player1'));
      setWinner(nextWinner);

      const roundScore = getBattleRoundScore(nextWinner.type);
      if (nextWinner.player === 'player1') {
        setPlayerBattleScore((prev) => {
          const next = prev + roundScore;
          if (next >= BATTLE_WIN_SCORE) setBattleOver(true);
          return next;
        });
      } else {
        setCpuBattleScore((prev) => {
          const next = prev + roundScore;
          if (next >= BATTLE_WIN_SCORE) setBattleOver(true);
          return next;
        });
      }

      setRoundEndState({
        reason: nextWinner.player === 'player1' ? 'playerWin' : 'cpuWin',
        roundNumber,
      });
      return;
    }

    setTortureUsedThisTurn(false);
    setCurrentPlayer((player) => (player === 'player1' ? 'player2' : 'player1'));
  }, [playSound, roundNumber]);

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
      slot1: powerSlotData.slot1
        ? { powerId: powerSlotData.slot1.powerId, type: powerSlotData.slot1.type, usesLeft: powerSlotData.slot1.usesLeft }
        : null,
      slot2: powerSlotData.slot2
        ? { powerId: powerSlotData.slot2.powerId, type: powerSlotData.slot2.type, usesLeft: powerSlotData.slot2.usesLeft }
        : null,
    },
    onConsumePower: consumePower,
    onRackLocked: () => setTortureUsedThisTurn(true),
    onRollConsumed: () => setPlayerRollsRemaining((count) => Math.max(0, count - 1)),
    playSound,
  });

  const powerSlotsArray = useMemo(
    () =>
      (['slot1', 'slot2'] as BattlePowerSlotId[])
        .map((slotId) => {
          const slot = powerSlotData[slotId];
          if (!slot) return null;
          return { slotId, icon: slot.icon, powerId: slot.powerId, isSelected: selectedPowerSlotId === slotId };
        })
        .filter(Boolean) as { slotId: string; icon: string; powerId: string; isSelected: boolean }[],
    [powerSlotData, selectedPowerSlotId],
  );

  useSoloCpu({
    board,
    currentPlayer,
    winnerTitle: winner || roundEndState ? 'battle-over' : null,
    soloMode: 'battle',
    soloRoundNumber: roundNumber,
    cpuRollsRemaining: 0,
    playerRacks,
    rollFlow,
    setIsSoloCpuThinking,
    setBoard,
    setPlayerRacks,
    setLastMoveIndex,
    onEp1Launched: showEp1Launch,
    onCpuMoveComplete: finishTurn,
  });

  const handlePowerSlotPress = useCallback((slotId: BattlePowerSlotId) => {
    if (winner || roundEndState || currentPlayer !== 'player1') return;

    const slot = powerSlotData[slotId];
    if (!slot || slot.usesLeft <= 0) return;

    if (slot.type === 'EPI') {
      if (slot.powerId === 'power-plus-10-seconds') {
        setTimerSeconds((s) => s + 10);
        setSelectedPowerSlotId(null);
        epi.consume(slotId);
        return;
      }
      if (slot.powerId === 'power-clock-freeze') {
        setTimerFrozen(true);
        playSound('iceFreeze');
        setSelectedPowerSlotId(null);
        epi.consume(slotId);
        return;
      }
      if (slot.powerId === 'power-reverse-time') {
        setTimerSeconds(ROUND_TIMER_SECONDS);
        setSelectedPowerSlotId(null);
        epi.consume(slotId);
        return;
      }
      if (slot.powerId === 'power-rerack') {
        if (tortureUsedThisTurn) return;
        rerollCurrentRack();
        setSelectedPowerSlotId(null);
        epi.consume(slotId);
        return;
      }
    }

    if (slot.powerId === 'power-four-square') {
      const { nextBoard, lastMoveIndex, affectedIndices } = applyFourSquarePower(board);
      if (affectedIndices.length === 0) return;
      showEp1Launch(createGameBoardEffectEvent('fourSquare', 'Four Square', affectedIndices, board));
      setBoard(nextBoard);
      setLastMoveIndex(lastMoveIndex);
      setSelectedPowerSlotId(null);
      ep1.consume(slotId);
      finishTurn(nextBoard);
      return;
    }

    if (slot.powerId === 'power-tornado') {
      const { nextBoard, lastMoveIndex, affectedIndices } = applyTornadoPower(board);
      if (affectedIndices.length === 0) return;
      showEp1Launch(createGameBoardEffectEvent('tornado', 'Tornado', affectedIndices, board));
      setBoard(nextBoard);
      setLastMoveIndex(lastMoveIndex);
      setSelectedPowerSlotId(null);
      ep1.consume(slotId);
      finishTurn(nextBoard);
      return;
    }

    setSelectedPowerSlotId((current) => (current === slotId ? null : slotId));
  }, [
    board, currentPlayer, ep1, epi, finishTurn, powerSlotData,
    rerollCurrentRack, roundEndState, setBoard, setLastMoveIndex,
    setSelectedPowerSlotId, showEp1Launch, tortureUsedThisTurn, winner,
  ]);

  const handleContinue = useCallback(() => {
    timerAlarmFiredRef.current = false;
    resetBoardState(undefined, createSharedPlayerRacks());
    setCurrentPlayer('player1');
    setWinner(null);
    setRoundEndState(null);
    setTimerSeconds(ROUND_TIMER_SECONDS);
    setTimerFrozen(false);
    setTortureUsedThisTurn(false);
    ep1.reset();
    epi.reset();
    setRoundNumber((round) => round + 1);
  }, [ep1, epi, resetBoardState]);

  const handleBattleReset = useCallback(() => {
    timerAlarmFiredRef.current = false;
    resetBoardState(undefined, createSharedPlayerRacks());
    setCurrentPlayer('player1');
    setWinner(null);
    setRoundEndState(null);
    setTimerSeconds(ROUND_TIMER_SECONDS);
    setTimerFrozen(false);
    setTortureUsedThisTurn(false);
    ep1.reset();
    epi.reset();
    setRoundNumber(1);
    setPlayerBattleScore(0);
    setCpuBattleScore(0);
    setPlayerRollsRemaining(3);
    setBattleOver(false);
  }, [ep1, epi, resetBoardState]);

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
    playerBattleScore,
    cpuBattleScore,
    playerRollsRemaining,
    battleOver,
    handleSquarePress,
    handleSelectRackIndex,
    handlePowerSlotPress,
    handleContinue,
    handleBattleReset,
  };
}
