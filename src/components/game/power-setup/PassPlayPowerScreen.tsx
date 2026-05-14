import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePowerSlots } from '../../power-selection/usePowerSlots';
import { PowerScreenLayout } from './PowerScreenLayout';
import type { PowerPickProps } from './types';

type Props = PowerPickProps & {
  playerLabel: string;
  actionLabel: string;
};

export function PassPlayPowerScreen({
  headerLogo,
  p1Profile,
  p2Profile,
  initialSlots,
  allowEpi = false,
  albumCounts,
  playerLabel,
  actionLabel,
  onConfirm,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const { slot1, slot2, loadout, assignSlot } = usePowerSlots(initialSlots);

  return (
    <PowerScreenLayout
      headerLogo={headerLogo}
      playerLabel={playerLabel}
      slot1Id={slot1}
      slot2Id={slot2}
      onAssignSlot={assignSlot}
      allowEpi={allowEpi}
      albumCounts={albumCounts}
      actionLabel={actionLabel}
      onAction={() => onConfirm(loadout)}
      p1Profile={p1Profile}
      p2Profile={p2Profile}
      onBack={onBack}
      bottomInset={insets.bottom}
    />
  );
}
