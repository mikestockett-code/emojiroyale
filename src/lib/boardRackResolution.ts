import type { BoardCell, Player, SoloModeId, StickerId } from '../types';
import { buildDieCell } from './diceLogic';
import { createSharedRack } from './sharedRackLogic';

type LockedRackSlot = { index: number; stickerId: StickerId } | null;

type ResolveRackPlacementOptions = {
  board: BoardCell[];
  currentPlayer: Player;
  currentRack: StickerId[];
  boardIndex: number;
  rackIndex: number;
  lockedRackSlot: LockedRackSlot;
  soloMode: SoloModeId;
  roundNumber: number;
};

export function resolveRackPlacement({
  board,
  currentPlayer,
  currentRack,
  boardIndex,
  rackIndex,
  lockedRackSlot,
  soloMode,
  roundNumber,
}: ResolveRackPlacementOptions) {
  if (board[boardIndex] !== null) return null;
  const selectedStickerId = currentRack[rackIndex];
  if (!selectedStickerId) return null;

  const nextBoard = [...board];
  nextBoard[boardIndex] = buildDieCell(currentPlayer, selectedStickerId, roundNumber, soloMode);

  const nextRack = createSharedRack(undefined, { soloMode, roundNumber });
  if (lockedRackSlot && lockedRackSlot.index !== rackIndex) {
    nextRack[lockedRackSlot.index] = lockedRackSlot.stickerId;
  }

  return {
    nextBoard,
    nextRack,
    shouldClearLockedSlot: lockedRackSlot?.index === rackIndex,
  };
}

export function createRerolledRack({
  lockedRackSlot,
  soloMode,
  roundNumber,
}: {
  lockedRackSlot: LockedRackSlot;
  soloMode: SoloModeId;
  roundNumber: number;
}) {
  const nextRack = createSharedRack(undefined, { soloMode, roundNumber });
  if (lockedRackSlot) {
    nextRack[lockedRackSlot.index] = lockedRackSlot.stickerId;
  }
  return nextRack;
}
