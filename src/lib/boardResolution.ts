import type { BattlePowerId, BoardCell, Player } from '../types';
import { applyDieFace } from './diceLogic';
import {
  applyRandomGameBoardEffect,
  applyTargetedGameBoardEffect,
  createGameBoardEffectEvent,
  type GameBoardEffectEvent,
  type GameBoardEffectId,
} from './gameBoardEffects';

export type RollResolution =
  | {
      kind: 'effect';
      nextBoard: BoardCell[];
      lastMoveIndex: number | null;
      effectId: GameBoardEffectId;
      effectLabel: string;
      effectEvent: GameBoardEffectEvent;
    }
  | {
      kind: 'refill';
      nextBoard: BoardCell[];
      lastMoveIndex: number;
    }
  | {
      kind: 'face';
      nextBoard: BoardCell[];
      lastMoveIndex: number;
    };

type ResolveBoardRollOptions = {
  board: BoardCell[];
  index: number;
  faceIndex: number;
  previousEffectId: GameBoardEffectId | null;
  currentPlayer: Player;
};

export function resolveBoardRoll({
  board,
  index,
  faceIndex,
  previousEffectId,
  currentPlayer,
}: ResolveBoardRollOptions): RollResolution | null {
  const selectedCell = board[index];
  if (!selectedCell?.faces) return null;

  const landedFace = selectedCell.faces[faceIndex];
  if (landedFace === 'die-ep1') {
    const ep1Result = applyRandomGameBoardEffect(board, index, previousEffectId, currentPlayer);
    return {
      kind: 'effect',
      nextBoard: ep1Result.nextBoard,
      lastMoveIndex: ep1Result.lastMoveIndex,
      effectId: ep1Result.effectId,
      effectLabel: ep1Result.effectLabel,
      effectEvent: createGameBoardEffectEvent(
        ep1Result.effectId,
        ep1Result.effectLabel,
        ep1Result.affectedIndices,
        board,
      ),
    };
  }

  if (landedFace === 'die-free') {
    return { kind: 'refill', nextBoard: [...board], lastMoveIndex: index };
  }

  const nextBoard = [...board];
  nextBoard[index] = applyDieFace(selectedCell, faceIndex);
  return { kind: 'face', nextBoard, lastMoveIndex: index };
}

export function resolveTargetedBoardPower(
  board: BoardCell[],
  targetIndex: number,
  powerId: BattlePowerId,
) {
  const effectResult = applyTargetedGameBoardEffect(board, targetIndex, powerId);
  if (!effectResult) return null;

  return {
    ...effectResult,
    effectEvent: createGameBoardEffectEvent(
      effectResult.effectId,
      effectResult.effectLabel,
      effectResult.affectedIndices,
      board,
    ),
  };
}
