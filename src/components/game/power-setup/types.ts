import type React from 'react';
import type { BattlePowerSlotLoadout, Profile, StickerId } from '../../../types';

export type PowerPickProps = {
  headerLogo: React.ReactNode;
  p1Profile: Profile | null;
  p2Profile: Profile | null;
  initialSlots?: BattlePowerSlotLoadout;
  allowEpi?: boolean;
  albumCounts?: Record<StickerId, number>;
  onConfirm: (slots: BattlePowerSlotLoadout) => void;
  onBack: () => void;
};
