import { useCallback, useMemo } from 'react';
import type {
  BattlePowerId,
  BattlePowerSlotId,
  BattlePowerSlotLoadout,
  BoardCell,
  Player,
  SoloModeId,
  StickerId,
} from '../types';
import type { AudioSourceKey } from '../lib/audio';
import { useBoardStateController, type TurnEndMeta } from './useBoardStateController';
import { useGamePowerPress } from './useGamePowerPress';
import { useGamePowerSlots, toGameBoardPowerSlot } from './useGamePowerSlots';

export type { TurnEndMeta } from './useBoardStateController';

type PowerLoadoutsByPlayer = Record<Player, BattlePowerSlotLoadout>;

type UseModeBoardControllerOptions = {
  currentPlayer: Player;
  powerLoadouts: PowerLoadoutsByPlayer;
  allowEpi?: boolean;
  onTurnEnd: (nextBoard: BoardCell[], meta: TurnEndMeta & Record<string, unknown>) => void;
  rollsDisabled: boolean;
  interactionDisabled?: boolean;
  soloMode?: SoloModeId;
  roundNumber?: number;
  initialBoard?: BoardCell[];
  initialPlayerRacks?: Record<Player, StickerId[]>;
  onRollConsumed?: () => void;
  onRackLocked?: () => void;
  playSound?: (key: AudioSourceKey) => void;
  getPowerTurnMeta?: (powerId: BattlePowerId) => Record<string, unknown>;
  onEpiPower?: (powerId: BattlePowerId, slotId: BattlePowerSlotId) => boolean;
  createOnEpiPower?: (helpers: {
    rerollCurrentRack: () => void;
  }) => (powerId: BattlePowerId, slotId: BattlePowerSlotId) => boolean;
};

export function useModeBoardController({
  currentPlayer,
  powerLoadouts,
  allowEpi = false,
  onTurnEnd,
  rollsDisabled,
  interactionDisabled = false,
  soloMode = 'battle',
  roundNumber = 1,
  initialBoard,
  initialPlayerRacks,
  onRollConsumed,
  onRackLocked,
  playSound,
  getPowerTurnMeta,
  onEpiPower,
  createOnEpiPower,
}: UseModeBoardControllerOptions) {
  const player1Powers = useGamePowerSlots(powerLoadouts.player1, { allowEpi });
  const player2Powers = useGamePowerSlots(powerLoadouts.player2, { allowEpi });

  const currentPowerSlots = useMemo(
    () => (currentPlayer === 'player1' ? player1Powers.powerSlotData : player2Powers.powerSlotData),
    [currentPlayer, player1Powers.powerSlotData, player2Powers.powerSlotData],
  );

  const consumePower = useCallback((slotId: BattlePowerSlotId) => {
    if (currentPlayer === 'player1') player1Powers.consumePower(slotId);
    else player2Powers.consumePower(slotId);
  }, [currentPlayer, player1Powers, player2Powers]);

  const refillCurrentPlayerPower = useCallback(() => {
    const result = currentPlayer === 'player1'
      ? player1Powers.refillPowerJackpot()
      : player2Powers.refillPowerJackpot();
    if (!result) return null;
    return {
      label: result.label,
      bonusCount: result.bonusCount,
      banked: result.banked,
    };
  }, [currentPlayer, player1Powers, player2Powers]);

  const boardController = useBoardStateController({
    currentPlayer,
    onTurnEnd,
    rollsDisabled,
    interactionDisabled,
    soloMode,
    roundNumber,
    initialBoard,
    initialPlayerRacks,
    powerSlots: {
      slot1: toGameBoardPowerSlot(currentPowerSlots.slot1),
      slot2: toGameBoardPowerSlot(currentPowerSlots.slot2),
    },
    onConsumePower: consumePower,
    onPowerRefill: refillCurrentPlayerPower,
    onRollConsumed,
    onRackLocked,
    playSound,
  });

  const resolvedOnEpiPower = useMemo(
    () => createOnEpiPower?.({ rerollCurrentRack: boardController.rerollCurrentRack }) ?? onEpiPower,
    [boardController.rerollCurrentRack, createOnEpiPower, onEpiPower],
  );

  const handlePowerSlotPress = useGamePowerPress({
    board: boardController.board,
    powerSlots: currentPowerSlots,
    disabled: interactionDisabled,
    selectedPowerSlotId: boardController.selectedPowerSlotId,
    setSelectedPowerSlotId: boardController.setSelectedPowerSlotId,
    consumePower,
    setBoard: boardController.setBoard,
    setLastMoveIndex: boardController.setLastMoveIndex,
    showEp1Launch: boardController.showEp1Launch,
    finishTurn: onTurnEnd,
    getPowerTurnMeta,
    onEpiPower: resolvedOnEpiPower,
  });

  const powerSlotsArray = useMemo(
    () => (currentPlayer === 'player1' ? player1Powers : player2Powers)
      .buildPowerSlotsArray(boardController.selectedPowerSlotId),
    [boardController.selectedPowerSlotId, currentPlayer, player1Powers, player2Powers],
  );

  const buildPowerSlotsArrayForPlayer = useCallback((
    player: Player,
    selectedPowerSlotId = boardController.selectedPowerSlotId,
  ) => (
    player === 'player1' ? player1Powers : player2Powers
  ).buildPowerSlotsArray(selectedPowerSlotId), [
    boardController.selectedPowerSlotId,
    player1Powers,
    player2Powers,
  ]);

  const resetPowers = useCallback(() => {
    player1Powers.resetPowers();
    player2Powers.resetPowers();
  }, [player1Powers, player2Powers]);

  const refillPowersForPlayer = useCallback((player: Player) => {
    const result = player === 'player1'
      ? player1Powers.refillPowerJackpot()
      : player2Powers.refillPowerJackpot();
    if (!result) return null;
    return {
      label: result.label,
      bonusCount: result.bonusCount,
      banked: result.banked,
    };
  }, [player1Powers, player2Powers]);

  return {
    ...boardController,
    currentPowerSlots,
    powerSlotsByPlayer: {
      player1: player1Powers.powerSlotData,
      player2: player2Powers.powerSlotData,
    },
    handlePowerSlotPress,
    powerSlotsArray,
    buildPowerSlotsArrayForPlayer,
    resetPowers,
    refillPowersForPlayer,
  };
}
