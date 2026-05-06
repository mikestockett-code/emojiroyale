import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PowerScreenLayout } from './PowerScreenLayout';
import { usePowerSlots } from '../../power-selection/usePowerSlots';
import type { PowerP1Props } from './types';

export function PassPlayPowerP1Screen({ headerLogo, p1Profile, p2Profile, initialSlots, onConfirm, onBack }: PowerP1Props) {
  const insets = useSafeAreaInsets();
  const { slot1, slot2, loadout, select, remove } = usePowerSlots(initialSlots);

  return (
    <PowerScreenLayout
      headerLogo={headerLogo}
      playerLabel="PLAYER ONE  •  PICK 2"
      slot1Id={slot1}
      slot2Id={slot2}
      onCardSelect={select}
      onCardRemove={remove}
      actionLabel="PASS TO P2 →"
      onAction={() => onConfirm(loadout)}
      p1Profile={p1Profile}
      p2Profile={p2Profile}
      onBack={onBack}
      bottomInset={insets.bottom}
    />
  );
}
