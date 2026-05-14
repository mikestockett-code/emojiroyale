import { useCallback, useMemo, useState } from 'react';
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
  bonusCount: number;
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
  const [bonusUses, setBonusUses] = useState<Record<BattlePowerSlotId, number>>({ slot1: 0, slot2: 0 });

  const powerSlotData = useMemo(() => {
    const result: Record<BattlePowerSlotId, GamePowerSlotData | null> = { slot1: null, slot2: null };

    (['slot1', 'slot2'] as BattlePowerSlotId[]).forEach((slotId) => {
      const powerId = slotIds[slotId];
      if (!powerId) return;
      const power = BATTLE_TEST_POWERS.find((entry) => entry.id === powerId);
      if (!power) return;
      if (power.type === 'EPI' && !allowEpi) return;
      const baseUsesLeft = power.type === 'EP1' ? ep1.usesLeft(slotId) : epi.epiUsesLeft[slotId];
      const bonusCount = bonusUses[slotId] ?? 0;
      result[slotId] = {
        powerId,
        type: power.type,
        label: power.label,
        detail: power.detail,
        icon: power.icon,
        usesLeft: baseUsesLeft + bonusCount,
        bonusCount,
      };
    });

    return result;
  }, [allowEpi, bonusUses, ep1, epi.epiUsesLeft, slotIds]);

  const consumePower = useCallback((slotId: BattlePowerSlotId) => {
    const slot = powerSlotData[slotId];
    if (!slot) return;
    if (slot.bonusCount > 0) {
      setBonusUses((current) => ({ ...current, [slotId]: Math.max(0, current[slotId] - 1) }));
      return;
    }
    if (slot.type === 'EP1') ep1.consume(slotId);
    else epi.consume(slotId);
  }, [ep1, epi, powerSlotData]);

  const resetPowers = useCallback(() => {
    ep1.reset();
    epi.reset();
    setBonusUses({ slot1: 0, slot2: 0 });
  }, [ep1, epi]);

  const refillPowerJackpot = useCallback(() => {
    const slotOrder: BattlePowerSlotId[] = ['slot1', 'slot2'];
    const spentSlotId = slotOrder.find((slotId) => {
      const slot = powerSlotData[slotId];
      return slot && slot.usesLeft <= 0;
    });

    if (spentSlotId) {
      const slot = powerSlotData[spentSlotId];
      if (!slot) return null;
      if (slot.type === 'EP1') ep1.refill(spentSlotId);
      else epi.refill(spentSlotId);
      return { slotId: spentSlotId, label: slot.label, bonusCount: slot.bonusCount, banked: false };
    }

    const bonusSlotId = slotOrder.find((slotId) => Boolean(powerSlotData[slotId]));
    if (!bonusSlotId) return null;
    const slot = powerSlotData[bonusSlotId];
    if (!slot) return null;
    const nextBonusCount = (bonusUses[bonusSlotId] ?? 0) + 1;
    setBonusUses((current) => ({ ...current, [bonusSlotId]: nextBonusCount }));
    return { slotId: bonusSlotId, label: slot.label, bonusCount: nextBonusCount, banked: true };
  }, [bonusUses, ep1, epi, powerSlotData]);

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
        usesLeft: slot.usesLeft,
        bonusCount: slot.bonusCount,
        isDisabled: slot.usesLeft <= 0,
      };
      })
      .filter(Boolean) as { slotId: string; icon: string; powerId: string; isSelected: boolean; usesLeft: number; bonusCount: number; isDisabled: boolean }[]
  ), [powerSlotData]);

  return {
    powerSlotData,
    buildPowerSlotsArray,
    consumePower,
    resetPowers,
    refillPowerJackpot,
  };
}

export function toGameBoardPowerSlot(slot: GamePowerSlotData | null) {
  if (!slot) return null;
  return { powerId: slot.powerId, type: slot.type, usesLeft: slot.usesLeft };
}
