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
  playerLabel,
  actionLabel,
  onConfirm,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const { slot1, slot2, loadout, select, remove } = usePowerSlots(initialSlots);

  return (
    <PowerScreenLayout
      headerLogo={headerLogo}
      playerLabel={playerLabel}
      slot1Id={slot1}
      slot2Id={slot2}
      onCardSelect={select}
      onCardRemove={remove}
      actionLabel={actionLabel}
      onAction={() => onConfirm(loadout)}
      p1Profile={p1Profile}
      p2Profile={p2Profile}
      onBack={onBack}
      bottomInset={insets.bottom}
    />
  );
}
