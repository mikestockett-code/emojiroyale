import { useCallback } from 'react';
import type { BattlePowerId, BattlePowerSlotId, BoardCell } from '../types';
import type { TurnEndMeta } from './useModeBoardController';
import type { GamePowerSlotData } from './useGamePowerSlots';
import { applyFourSquarePower, applyTornadoPower } from '../lib/battlePowerEffects';
import { createGameBoardEffectEvent } from '../lib/gameBoardEffects';

type GamePowerSlotsById = Record<BattlePowerSlotId, GamePowerSlotData | null>;

type BoardPowerResult = {
  effectId: NonNullable<TurnEndMeta['effectId']>;
  effectLabel: string;
  nextBoard: BoardCell[];
  lastMoveIndex: number | null;
  affectedIndices: number[];
};

type UseGamePowerPressOptions = {
  board: BoardCell[];
  powerSlots: GamePowerSlotsById;
  disabled?: boolean;
  selectedPowerSlotId: BattlePowerSlotId | null;
  setSelectedPowerSlotId: (value: BattlePowerSlotId | null | ((current: BattlePowerSlotId | null) => BattlePowerSlotId | null)) => void;
  consumePower: (slotId: BattlePowerSlotId) => void;
  setBoard: (board: BoardCell[]) => void;
  setLastMoveIndex: (index: number | null) => void;
  showEp1Launch: (event: ReturnType<typeof createGameBoardEffectEvent>, showStatus?: boolean) => void;
  finishTurn: (nextBoard: BoardCell[], meta: TurnEndMeta & Record<string, unknown>) => void;
  getPowerTurnMeta?: (powerId: BattlePowerId) => Record<string, unknown>;
  onEpiPower?: (powerId: BattlePowerId, slotId: BattlePowerSlotId) => boolean;
};

export function useGamePowerPress({
  board,
  powerSlots,
  disabled = false,
  selectedPowerSlotId,
  setSelectedPowerSlotId,
  consumePower,
  setBoard,
  setLastMoveIndex,
  showEp1Launch,
  finishTurn,
  getPowerTurnMeta,
  onEpiPower,
}: UseGamePowerPressOptions) {
  return useCallback((slotId: BattlePowerSlotId) => {
    if (disabled) return;

    const slot = powerSlots[slotId];
    if (!slot || slot.usesLeft <= 0) return;

    if (slot.type === 'EPI') {
      const didApply = onEpiPower?.(slot.powerId, slotId) ?? false;
      if (!didApply) return;
      setSelectedPowerSlotId(null);
      consumePower(slotId);
      return;
    }

    const boardPower = applyBoardPower(slot.powerId, board);
    if (!boardPower) {
      setSelectedPowerSlotId((current) => (current === slotId ? null : slotId));
      return;
    }

    if (boardPower.affectedIndices.length === 0) return;

    showEp1Launch(createGameBoardEffectEvent(
      boardPower.effectId,
      boardPower.effectLabel,
      boardPower.affectedIndices,
      board,
    ));
    setBoard(boardPower.nextBoard);
    setLastMoveIndex(boardPower.lastMoveIndex);
    setSelectedPowerSlotId(null);
    consumePower(slotId);
    finishTurn(boardPower.nextBoard, {
      moveType: 'power',
      effectId: boardPower.effectId,
      ...(getPowerTurnMeta?.(slot.powerId) ?? {}),
    });
  }, [
    board,
    consumePower,
    disabled,
    finishTurn,
    getPowerTurnMeta,
    onEpiPower,
    powerSlots,
    setBoard,
    setLastMoveIndex,
    setSelectedPowerSlotId,
    showEp1Launch,
  ]);
}

function applyBoardPower(powerId: BattlePowerId, board: BoardCell[]): BoardPowerResult | null {
  if (powerId === 'power-four-square') {
    return {
      ...applyFourSquarePower(board),
      effectId: 'fourSquare',
      effectLabel: 'Four Square',
    };
  }

  if (powerId === 'power-tornado') {
    return {
      ...applyTornadoPower(board),
      effectId: 'tornado',
      effectLabel: 'Tornado',
    };
  }

  return null;
}
