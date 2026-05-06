import { useState } from 'react';
import type { BattlePowerId, BattlePowerSlotLoadout } from '../../types';

export function usePowerSlots(initial?: Partial<BattlePowerSlotLoadout>) {
  const [slot1, setSlot1] = useState<BattlePowerId | null>(initial?.slot1 ?? null);
  const [slot2, setSlot2] = useState<BattlePowerId | null>(initial?.slot2 ?? null);

  const bothFull = slot1 !== null && slot2 !== null;
  const isSelected = (id: BattlePowerId) => slot1 === id || slot2 === id;
  const loadout: BattlePowerSlotLoadout = { slot1, slot2 };

  const select = (id: BattlePowerId) => {
    if (isSelected(id) || bothFull) return;
    if (slot1 === null) { setSlot1(id); return; }
    setSlot2(id);
  };

  const remove = (id: BattlePowerId) => {
    if (slot1 === id) setSlot1(null);
    else if (slot2 === id) setSlot2(null);
  };

  const reset = () => { setSlot1(null); setSlot2(null); };

  return { slot1, slot2, loadout, bothFull, isSelected, select, remove, reset };
}
