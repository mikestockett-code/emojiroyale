import type React from 'react';
import type { BattlePowerSlotLoadout, Profile } from '../../../types';

export type PowerPickProps = {
  headerLogo: React.ReactNode;
  p1Profile: Profile | null;
  p2Profile: Profile | null;
  initialSlots?: BattlePowerSlotLoadout;
  onConfirm: (slots: BattlePowerSlotLoadout) => void;
  onBack: () => void;
  bottomInset: number;
};

export type PowerP1Props = PowerPickProps;
export type PowerP2Props = PowerPickProps;
