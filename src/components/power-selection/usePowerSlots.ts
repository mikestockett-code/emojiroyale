import { useState } from 'react';
import type { BattlePowerId, BattlePowerSlotId, BattlePowerSlotLoadout } from '../../types';

export function usePowerSlots(initial?: Partial<BattlePowerSlotLoadout>) {
  const [slot1, setSlot1] = useState<BattlePowerId | null>(initial?.slot1 ?? null);
  const [slot2, setSlot2] = useState<BattlePowerId | null>(initial?.slot2 ?? null);

  const loadout: BattlePowerSlotLoadout = { slot1, slot2 };

  const assignSlot = (slotId: BattlePowerSlotId, id: BattlePowerId | null) => {
    if (slotId === 'slot1') setSlot1(id);
    else setSlot2(id);
  };

  const reset = () => { setSlot1(null); setSlot2(null); };

  return { slot1, slot2, loadout, assignSlot, reset };
}
