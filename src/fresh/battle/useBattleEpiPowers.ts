import { useCallback, useMemo, useState } from 'react';
import type { BattlePowerId, BattlePowerSlotId } from '../../types';
import { BATTLE_TEST_POWERS } from '../../data/battlePowers';

type SlotUses = Record<BattlePowerSlotId, number>;

function buildInitialEpiUses(
  slotIds: { slot1: BattlePowerId | null; slot2: BattlePowerId | null },
  albumCounts?: Record<string, number>,
): SlotUses {
  const countFor = (powerId: BattlePowerId | null) => {
    if (!powerId) return 0;
    const power = BATTLE_TEST_POWERS.find((entry) => entry.id === powerId);
    if (!power || power.type !== 'EPI') return 0;
    return Math.max(1, albumCounts?.[powerId] ?? 1);
  };
  return { slot1: countFor(slotIds.slot1), slot2: countFor(slotIds.slot2) };
}

export function useBattleEpiPowers(
  slotIds: { slot1: BattlePowerId | null; slot2: BattlePowerId | null },
  albumCounts?: Record<string, number>,
) {
  const initialUses = useMemo(
    () => buildInitialEpiUses(slotIds, albumCounts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [epiUsesLeft, setEpiUsesLeft] = useState<SlotUses>(initialUses);

  const consume = useCallback((slotId: BattlePowerSlotId) => {
    setEpiUsesLeft((cur) => ({ ...cur, [slotId]: Math.max(0, cur[slotId] - 1) }));
  }, []);

  const reset = useCallback(() => {
    setEpiUsesLeft(buildInitialEpiUses(slotIds, albumCounts));
  }, [slotIds, albumCounts]);

  return { epiUsesLeft, consume, reset };
}
