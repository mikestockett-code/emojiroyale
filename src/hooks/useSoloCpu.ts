import { useEffect, useCallback, useRef } from 'react';
import type { BoardCell, Player, SoloModeId, StickerId } from '../types';
import { getSoloCpuDecision, getSoloCpuDifficultyLevel } from '../lib/soloCpuDecision';
import { createSharedRack } from '../lib/sharedRackLogic';
import { buildDieCell, applyDieFace } from '../lib/diceLogic';
import { applyRandomGameBoardEffect, createGameBoardEffectEvent } from '../lib/gameBoardEffects';
import type { GameBoardEffectEvent, GameBoardEffectId } from '../lib/gameBoardEffects';
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
            const rolledBoard = [...board];
            const rolledCell = rolledBoard[idx];
            const landedFace = rolledCell?.faces?.[faceIndex];
            if (landedFace === 'die-ep1') {
              const ep1Result = applyRandomGameBoardEffect(rolledBoard, idx, lastCpuEp1EffectIdRef.current, 'player2');
              lastCpuEp1EffectIdRef.current = ep1Result.effectId;
              onEp1Launched?.(
                createGameBoardEffectEvent(ep1Result.effectId, ep1Result.effectLabel, ep1Result.affectedIndices, rolledBoard),
                true,
                `CPU dice landed on Random Power and sparked ${ep1Result.effectLabel}`,
              );
              finishCpuRoll(ep1Result.nextBoard, ep1Result.lastMoveIndex ?? idx);
            } else if (landedFace === 'die-free') {
              const refillResult = onCpuPowerRefill?.();
              const refillLabel = refillResult
                ? refillResult.banked
                  ? `banked +${refillResult.bonusCount ?? 1} on ${refillResult.label}`
                  : `filled up ${refillResult.label}`
                : 'no power selected';
              onEp1Launched?.(`CPU dice landed on Emoji Power refill and ${refillLabel}`, true);
              lastCpuEp1EffectIdRef.current = null;
              finishCpuRoll(rolledBoard, idx);
            } else if (rolledCell) {
              rolledBoard[idx] = applyDieFace(rolledCell, faceIndex);
              lastCpuEp1EffectIdRef.current = null;
              finishCpuRoll(rolledBoard, idx);
            } else {
              finishCpuRoll(rolledBoard, idx);
            }
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

    const finishCpuRoll = (rolledBoard: BoardCell[], rolledIndex: number) => {
      setBoard(rolledBoard);
      setLastMoveIndex(rolledIndex);
      finishTurn(rolledBoard, CPU_ROLL_FINISH_DELAY_MS);
    };

    if (decision.rollTargetIndex !== undefined && rollFlow) {
      const target = decision.rollTargetIndex;
      const cell = board[target];
      if (cell?.faces) {
        const finalFaceIndex = Math.floor(Math.random() * 6);
        onCpuRollUsed?.();
        rollFlow.startCpuRoll(target, finalFaceIndex, (idx, faceIndex) => {
          const rolledBoard = [...board];
          const rolledCell = rolledBoard[idx];
          const landedFace = rolledCell?.faces?.[faceIndex];
          if (landedFace === 'die-ep1') {
            const ep1Result = applyRandomGameBoardEffect(rolledBoard, idx, lastCpuEp1EffectIdRef.current, 'player2');
            lastCpuEp1EffectIdRef.current = ep1Result.effectId;
            onEp1Launched?.(
              createGameBoardEffectEvent(ep1Result.effectId, ep1Result.effectLabel, ep1Result.affectedIndices, rolledBoard),
              true,
              `CPU dice landed on Random Power and sparked ${ep1Result.effectLabel}`,
            );
            finishCpuRoll(ep1Result.nextBoard, ep1Result.lastMoveIndex ?? idx);
            return;
          } else if (landedFace === 'die-free') {
            const refillResult = onCpuPowerRefill?.();
            const refillLabel = refillResult
              ? refillResult.banked
                ? `banked +${refillResult.bonusCount ?? 1} on ${refillResult.label}`
                : `filled up ${refillResult.label}`
              : 'no power selected';
            onEp1Launched?.(`CPU dice landed on Emoji Power refill and ${refillLabel}`, true);
            lastCpuEp1EffectIdRef.current = null;
          } else if (rolledCell) {
            rolledBoard[idx] = applyDieFace(rolledCell, faceIndex);
            lastCpuEp1EffectIdRef.current = null;
          }
          finishCpuRoll(rolledBoard, idx);
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
