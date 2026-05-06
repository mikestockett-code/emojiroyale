import type { BattlePowerId } from '../../types';

export type PowerSelectionSectionProps = {
  slot1: BattlePowerId | null;
  slot2: BattlePowerId | null;
  albumCounts?: Record<string, number>;
  onSelect: (id: BattlePowerId) => void;
  onRemove: (id: BattlePowerId) => void;
};
