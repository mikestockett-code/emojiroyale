import { useEffect, useCallback, useRef } from 'react';
import type { BoardCell, Player, SoloModeId, StickerId } from '../types';
import { getSoloCpuDecision, getSoloCpuDifficultyLevel } from '../lib/soloCpuDecision';
import { createSharedRack } from '../lib/sharedRackLogic';
import { buildDieCell } from '../lib/diceLogic';
import type { GameBoardEffectEvent, GameBoardEffectId } from '../lib/gameBoardEffects';
import { resolveBoardRoll } from '../lib/boardResolution';
import type { CpuRollFlow } from './rollFlowTypes';

export const CPU_PLACE_FINISH_DELAY_MS = 882;
export const CPU_ROLL_FINISH_DELAY_MS = 546;
const CPU_TURN_START_DELAY_MS = 273;

export type CpuTurnContext = {
  board: BoardCell[];
  finishTurn: (nextBoard: BoardCell[], delayMs?: number) => void;
};

type Props = {
  board: BoardCell[];
  currentPlayer: Player;
  winnerTitle: string | null;
  soloMode: SoloModeId;
  soloRoundNumber: number;
  cpuDifficultyLevel?: number;
  cpuRollsRemaining: number;
  playerRacks: Record<Player, StickerId[]>;
  rollFlow?: CpuRollFlow;
  onCpuRollUsed?: () => void;
  onCpuPowerRefill?: () => { label: string; bonusCount?: number; banked?: boolean } | null;
  setIsSoloCpuThinking?: (thinking: boolean) => void;
  setBoard: (newBoard: BoardCell[]) => void;
  setPlayerRacks: (newRacks: Record<Player, StickerId[]>) => void;
  setLastMoveIndex: (index: number | null) => void;
  onEp1Launched?: (event?: GameBoardEffectEvent | string, showStatus?: boolean, statusLabel?: string) => void;
  onCpuMoveComplete: (nextBoard: BoardCell[]) => void;
  interceptCpuTurn?: (ctx: CpuTurnContext) => boolean;
};

export function useSoloCpu({
  board,
  currentPlayer,
  winnerTitle,
  soloMode,
  soloRoundNumber,
  cpuDifficultyLevel,
  cpuRollsRemaining,
  playerRacks,
  rollFlow,
  onCpuRollUsed,
  onCpuPowerRefill,
  setIsSoloCpuThinking,
  setBoard,
  setPlayerRacks,
  setLastMoveIndex,
  onEp1Launched,
  onCpuMoveComplete,
  interceptCpuTurn,
}: Props) {
  const cpuTurnInFlightRef = useRef(false);
  const lastCpuEp1EffectIdRef = useRef<GameBoardEffectId | null>(null);
  const cpuStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeCpuTurn = useCallback(() => {
    if (cpuTurnInFlightRef.current) return;
    if (winnerTitle) return;
    if (currentPlayer !== 'player2') return;

    cpuTurnInFlightRef.current = true;
    setIsSoloCpuThinking?.(true);

    const finishTurn = (nextBoard: BoardCell[], delayMs = CPU_PLACE_FINISH_DELAY_MS) => {
      setTimeout(() => {
        setIsSoloCpuThinking?.(false);
        cpuTurnInFlightRef.current = false;
        onCpuMoveComplete(nextBoard);
      }, delayMs);
    };

    function finishCpuRoll(rolledBoard: BoardCell[], rolledIndex: number) {
      setBoard(rolledBoard);
      setLastMoveIndex(rolledIndex);
      finishTurn(rolledBoard, CPU_ROLL_FINISH_DELAY_MS);
    }

    const resolveCpuRoll = (rolledBoard: BoardCell[], idx: number, faceIndex: number) => {
      const resolution = resolveBoardRoll({
        board: rolledBoard,
        index: idx,
        faceIndex,
        previousEffectId: lastCpuEp1EffectIdRef.current,
        currentPlayer: 'player2',
      });
      if (!resolution) return { nextBoard: rolledBoard, lastMoveIndex: idx };

      if (resolution.kind === 'effect') {
        lastCpuEp1EffectIdRef.current = resolution.effectId;
        onEp1Launched?.(
          resolution.effectEvent,
          true,
          `CPU rolled, it landed on Random, which launched ${resolution.effectLabel}`,
        );
        return { nextBoard: resolution.nextBoard, lastMoveIndex: resolution.lastMoveIndex ?? idx };
      }
      if (resolution.kind === 'refill') {
        const refillResult = onCpuPowerRefill?.();
        const refillLabel = refillResult
          ? refillResult.banked
            ? `banked +${refillResult.bonusCount ?? 1} on ${refillResult.label}`
            : `filled up ${refillResult.label}`
          : 'no power selected';
        onEp1Launched?.(`Dice landed on refill and ${refillLabel}`, true);
        lastCpuEp1EffectIdRef.current = null;
        return { nextBoard: resolution.nextBoard, lastMoveIndex: resolution.lastMoveIndex };
      }
      lastCpuEp1EffectIdRef.current = null;
      return { nextBoard: resolution.nextBoard, lastMoveIndex: resolution.lastMoveIndex };
    };

    const emptySpots = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter(i => i !== -1);

    if (emptySpots.length === 0) {
      // Board is full — try rolling a board die if rolls remain (may land EP1 and open spots)
      if (cpuRollsRemaining > 0 && rollFlow) {
        const rollableIdx = board.findIndex(cell => cell !== null && cell.faces != null);
        if (rollableIdx >= 0) {
          const finalFaceIndex = Math.floor(Math.random() * 6);
          onCpuRollUsed?.();
          rollFlow.startCpuRoll(rollableIdx, finalFaceIndex, (idx, faceIndex) => {
            const result = resolveCpuRoll([...board], idx, faceIndex);
            finishCpuRoll(result.nextBoard, result.lastMoveIndex);
          });
          return;
        }
      }
      // Nothing can be done — signal done, tie detector will handle it
      setIsSoloCpuThinking?.(false);
      cpuTurnInFlightRef.current = false;
      onCpuMoveComplete(board);
      return;
    }

    const cpuRack = playerRacks.player2;
    const rackIndex = cpuRack.findIndex(Boolean);
    const stickerToPlace = rackIndex >= 0 ? cpuRack[rackIndex] : undefined;

    if (!stickerToPlace) {
      setIsSoloCpuThinking?.(false);
      cpuTurnInFlightRef.current = false;
      onCpuMoveComplete(board);
      return;
    }

    if (interceptCpuTurn?.({ board, finishTurn })) return;

    const difficultyLevel = cpuDifficultyLevel ?? getSoloCpuDifficultyLevel(soloMode, soloRoundNumber);
    const decision = getSoloCpuDecision({
      board,
      difficultyLevel,
      cpuHasRollsLeft: cpuRollsRemaining > 0,
    });

    const doPlace = (boardAfterRoll: BoardCell[]) => {
      const newBoard = [...boardAfterRoll];
      const placeIndex =
        typeof decision.boardIndex === 'number' && newBoard[decision.boardIndex] === null
          ? decision.boardIndex
          : emptySpots.find(i => newBoard[i] === null) ?? emptySpots[0];

      newBoard[placeIndex] = buildDieCell('player2', stickerToPlace, soloRoundNumber, soloMode);
      setBoard(newBoard);
      setPlayerRacks({
        ...playerRacks,
        player2: createSharedRack(undefined, { soloMode, roundNumber: soloRoundNumber }),
      });
      setLastMoveIndex(placeIndex);
      lastCpuEp1EffectIdRef.current = null;
      finishTurn(newBoard);
    };

    if (decision.rollTargetIndex !== undefined && rollFlow) {
      const target = decision.rollTargetIndex;
      const cell = board[target];
      if (cell?.faces) {
        const finalFaceIndex = Math.floor(Math.random() * 6);
        onCpuRollUsed?.();
        rollFlow.startCpuRoll(target, finalFaceIndex, (idx, faceIndex) => {
          const result = resolveCpuRoll([...board], idx, faceIndex);
          finishCpuRoll(result.nextBoard, result.lastMoveIndex);
        });
        return;
      }
    }

    doPlace(board);
  }, [
    board, currentPlayer, winnerTitle, soloMode, soloRoundNumber, cpuDifficultyLevel,
    cpuRollsRemaining, playerRacks, rollFlow, onCpuPowerRefill, onCpuRollUsed,
    setIsSoloCpuThinking, setBoard, setPlayerRacks, setLastMoveIndex, onEp1Launched,
    onCpuMoveComplete, interceptCpuTurn,
  ]);

  useEffect(() => {
    if (cpuStartTimerRef.current) {
      clearTimeout(cpuStartTimerRef.current);
      cpuStartTimerRef.current = null;
    }

    if (currentPlayer !== 'player2') {
      cpuTurnInFlightRef.current = false;
      return;
    }

    cpuStartTimerRef.current = setTimeout(() => {
      cpuStartTimerRef.current = null;
      executeCpuTurn();
    }, CPU_TURN_START_DELAY_MS);

    return () => {
      if (cpuStartTimerRef.current) {
        clearTimeout(cpuStartTimerRef.current);
        cpuStartTimerRef.current = null;
      }
    };
  }, [currentPlayer, executeCpuTurn]);

  return { executeCpuTurn };
}
