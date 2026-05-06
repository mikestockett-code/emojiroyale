// useSoloCpu.ts
// Controls the Solo CPU turn flow.

import { useEffect, useCallback, useRef } from 'react';
import type { BoardCell, Player, SoloModeId, StickerId } from '../types';
import { getSoloCpuDecision, getSoloCpuDifficultyLevel } from '../lib/soloCpuDecision';
import { createSharedRack } from '../lib/sharedRackLogic';
import { buildDieCell, applyDieFace } from '../lib/diceLogic';
import { applyRandomGameBoardEffect, createGameBoardEffectEvent } from '../lib/gameBoardEffects';
import type { GameBoardEffectEvent, GameBoardEffectId } from '../lib/gameBoardEffects';
import type { CpuRollFlow } from './soloRollTypes';

const CPU_TURN_START_DELAY_MS = 260;
const CPU_PLACE_FINISH_DELAY_MS = 882;
const CPU_ROLL_FINISH_DELAY_MS = 546;

type Props = {
  board: BoardCell[];
  currentPlayer: Player;
  winnerTitle: string | null;
  soloMode: SoloModeId;
  soloRoundNumber: number;
  cpuRollsRemaining: number;
  playerRacks: Record<Player, StickerId[]>;
  rollFlow?: CpuRollFlow;
  onCpuRollUsed?: () => void;
  setIsSoloCpuThinking: (thinking: boolean) => void;
  setBoard: (newBoard: BoardCell[]) => void;
  setPlayerRacks: (newRacks: Record<Player, StickerId[]>) => void;
  setLastMoveIndex: (index: number | null) => void;
  onEp1Launched?: (event?: GameBoardEffectEvent | string) => void;
  onCpuMoveComplete: (nextBoard: BoardCell[]) => void;
};

export function useSoloCpu({
  board,
  currentPlayer,
  winnerTitle,
  soloMode,
  soloRoundNumber,
  cpuRollsRemaining,
  playerRacks,
  rollFlow,
  onCpuRollUsed,
  setIsSoloCpuThinking,
  setBoard,
  setPlayerRacks,
  setLastMoveIndex,
  onEp1Launched,
  onCpuMoveComplete,
}: Props) {
  const cpuTurnInFlightRef = useRef(false);
  const lastCpuEp1EffectIdRef = useRef<GameBoardEffectId | null>(null);
  const cpuStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeCpuTurn = useCallback(() => {
    if (cpuTurnInFlightRef.current) return;
    if (winnerTitle) return;
    if (currentPlayer !== 'player2') return;

    cpuTurnInFlightRef.current = true;
    setIsSoloCpuThinking(true);

    const difficultyLevel = getSoloCpuDifficultyLevel(soloMode, soloRoundNumber);
    const decision = getSoloCpuDecision({
      board,
      difficultyLevel,
      cpuHasRollsLeft: cpuRollsRemaining > 0,
    });

    const emptySpots = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter(i => i !== -1);

    if (emptySpots.length === 0) {
      setIsSoloCpuThinking(false);
      cpuTurnInFlightRef.current = false;
      onCpuMoveComplete(board);
      return;
    }

    const cpuRack = playerRacks.player2;
    const rackIndex = cpuRack.findIndex(Boolean);
    const stickerToPlace = rackIndex >= 0 ? cpuRack[rackIndex] : undefined;

    if (!stickerToPlace) {
      setIsSoloCpuThinking(false);
      cpuTurnInFlightRef.current = false;
      onCpuMoveComplete(board);
      return;
    }

    // After roll (or immediately if no roll), place the tile and finish the turn
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

      setTimeout(() => {
        setIsSoloCpuThinking(false);
        cpuTurnInFlightRef.current = false;
        onCpuMoveComplete(newBoard);
      }, CPU_PLACE_FINISH_DELAY_MS);
    };

    const finishCpuRoll = (rolledBoard: BoardCell[], rolledIndex: number) => {
      setBoard(rolledBoard);
      setLastMoveIndex(rolledIndex);

      setTimeout(() => {
        setIsSoloCpuThinking(false);
        cpuTurnInFlightRef.current = false;
        onCpuMoveComplete(rolledBoard);
      }, CPU_ROLL_FINISH_DELAY_MS);
    };

    // A CPU roll consumes the CPU turn, matching the human roll flow.
    if (decision.rollTargetIndex !== undefined && rollFlow) {
      const target = decision.rollTargetIndex;
      const cell = board[target];
      if (cell?.faces) {
        // Pick final face (5-side: excludes die-free at index 5). EP1 itself chooses a varied random EP1 effect.
        const finalFaceIndex = Math.floor(Math.random() * 5);
        onCpuRollUsed?.();
        rollFlow.startCpuRoll(target, finalFaceIndex, (idx, faceIndex) => {
          const rolledBoard = [...board];
          const rolledCell = rolledBoard[idx];
          const landedFace = rolledCell?.faces?.[faceIndex];
          if (landedFace === 'die-ep1') {
            const ep1Result = applyRandomGameBoardEffect(rolledBoard, idx, lastCpuEp1EffectIdRef.current);
            lastCpuEp1EffectIdRef.current = ep1Result.effectId;
            onEp1Launched?.(createGameBoardEffectEvent(ep1Result.effectId, ep1Result.effectLabel, ep1Result.affectedIndices, rolledBoard));
            finishCpuRoll(ep1Result.nextBoard, ep1Result.lastMoveIndex ?? idx);
            return;
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
    board, currentPlayer, winnerTitle, soloMode, soloRoundNumber,
    cpuRollsRemaining, playerRacks, rollFlow, onCpuRollUsed,
    setIsSoloCpuThinking, setBoard, setPlayerRacks, setLastMoveIndex, onEp1Launched, onCpuMoveComplete,
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
