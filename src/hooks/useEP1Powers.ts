import { useCallback, useState } from 'react';
import type { BattlePowerId, BattlePowerSlotId } from '../types';

export function useEP1Powers(
  slotIds: { slot1: BattlePowerId | null; slot2: BattlePowerId | null },
) {
  const [slotUsed, setSlotUsed] = useState<Record<BattlePowerSlotId, boolean>>({
    slot1: false,
    slot2: false,
  });

  const consume = useCallback((slotId: BattlePowerSlotId) => {
    setSlotUsed((cur) => ({ ...cur, [slotId]: true }));
  }, []);

  const reset = useCallback(() => {
    setSlotUsed({ slot1: false, slot2: false });
  }, []);

  const usesLeft = useCallback(
    (slotId: BattlePowerSlotId) => (slotIds[slotId] && !slotUsed[slotId] ? 1 : 0),
    [slotIds, slotUsed],
  );

  return { slotUsed, consume, reset, usesLeft };
}
