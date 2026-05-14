import React, { useMemo } from 'react';
import { PassPlayPowerScreen } from '../../../components/game/power-setup';
import type { BattlePowerSlotLoadout, Profile, StickerId } from '../../../types';
import type { FreshProfile } from '../../profile/types';
import { useAudioContext } from '../../audio/AudioContext';
import { PassPlayPowerHeader } from '../../screens/PassPlayPowerHeader';

type ModePowerSetupProfile = Profile | FreshProfile | null;

type Props = {
  playerLabel: string;
  actionLabel: string;
  p1Profile: ModePowerSetupProfile;
  p2Profile?: ModePowerSetupProfile;
  initialSlots?: BattlePowerSlotLoadout;
  allowEpi?: boolean;
  albumCounts?: Record<StickerId, number>;
  playConfirmSound?: boolean;
  onConfirm: (slots: BattlePowerSlotLoadout) => void;
  onBack: () => void;
};

export function ModePowerSetupScreen({
  playerLabel,
  actionLabel,
  p1Profile,
  p2Profile = null,
  initialSlots,
  allowEpi = false,
  albumCounts,
  playConfirmSound = true,
  onConfirm,
  onBack,
}: Props) {
  const { playSound } = useAudioContext();
  const header = useMemo(() => <PassPlayPowerHeader />, []);

  return (
    <PassPlayPowerScreen
      headerLogo={header}
      playerLabel={playerLabel}
      actionLabel={actionLabel}
      p1Profile={p1Profile as Profile | null}
      p2Profile={p2Profile as Profile | null}
      initialSlots={initialSlots}
      allowEpi={allowEpi}
      albumCounts={albumCounts}
      onBack={onBack}
      onConfirm={(slots) => {
        if (playConfirmSound) playSound('rumble');
        onConfirm(slots);
      }}
    />
  );
}
