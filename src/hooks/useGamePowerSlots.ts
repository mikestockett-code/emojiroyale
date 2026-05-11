import { useCallback, useMemo } from 'react';
import type {
  BattlePowerId,
  BattlePowerSlotLoadout,
  BattlePowerSlotId,
  BattlePowerType,
} from '../types';
import { BATTLE_TEST_POWERS } from '../data/battlePowers';
import { useEP1Powers } from './useEP1Powers';
import { useEpiPowers } from './useEpiPowers';

export type GamePowerSlotData = {
  powerId: BattlePowerId;
  type: BattlePowerType;
  label: string;
  detail: string;
  icon: string;
  usesLeft: number;
};

type UseGamePowerSlotsOptions = {
  albumCounts?: Record<string, number>;
  allowEpi?: boolean;
};

export function useGamePowerSlots(
  slotIds: BattlePowerSlotLoadout,
  { albumCounts, allowEpi = false }: UseGamePowerSlotsOptions = {},
) {
  const ep1 = useEP1Powers(slotIds);
  const epi = useEpiPowers(slotIds, albumCounts);

  const powerSlotData = useMemo(() => {
    const result: Record<BattlePowerSlotId, GamePowerSlotData | null> = { slot1: null, slot2: null };

    (['slot1', 'slot2'] as BattlePowerSlotId[]).forEach((slotId) => {
      const powerId = slotIds[slotId];
      if (!powerId) return;
      const power = BATTLE_TEST_POWERS.find((entry) => entry.id === powerId);
      if (!power) return;
      if (power.type === 'EPI' && !allowEpi) return;
      const usesLeft = power.type === 'EP1' ? ep1.usesLeft(slotId) : epi.epiUsesLeft[slotId];
      result[slotId] = {
        powerId,
        type: power.type,
        label: power.label,
        detail: power.detail,
        icon: power.icon,
        usesLeft,
      };
    });

    return result;
  }, [allowEpi, ep1, epi.epiUsesLeft, slotIds]);

  const consumePower = useCallback((slotId: BattlePowerSlotId) => {
    const slot = powerSlotData[slotId];
    if (!slot) return;
    if (slot.type === 'EP1') ep1.consume(slotId);
    else epi.consume(slotId);
  }, [ep1, epi, powerSlotData]);

  const resetPowers = useCallback(() => {
    ep1.reset();
    epi.reset();
  }, [ep1, epi]);

  const buildPowerSlotsArray = useCallback((selectedPowerSlotId: BattlePowerSlotId | null) => (
    (['slot1', 'slot2'] as BattlePowerSlotId[])
      .map((slotId) => {
        const slot = powerSlotData[slotId];
        if (!slot) return null;
        return {
          slotId,
          icon: slot.icon,
          powerId: slot.powerId,
          isSelected: selectedPowerSlotId === slotId,
        };
      })
      .filter(Boolean) as { slotId: string; icon: string; powerId: string; isSelected: boolean }[]
  ), [powerSlotData]);

  return {
    powerSlotData,
    buildPowerSlotsArray,
    consumePower,
    resetPowers,
  };
}

export function toGameBoardPowerSlot(slot: GamePowerSlotData | null) {
  if (!slot) return null;
  return { powerId: slot.powerId, type: slot.type, usesLeft: slot.usesLeft };
}
