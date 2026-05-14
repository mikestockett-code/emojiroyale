import type { BattlePowerId, BattlePowerSlotId } from '../../types';

export type PowerSelectionSectionProps = {
  slot1: BattlePowerId | null;
  slot2: BattlePowerId | null;
  albumCounts?: Record<string, number>;
  onAssignSlot: (slotId: BattlePowerSlotId, id: BattlePowerId | null) => void;
};
