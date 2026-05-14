// SoloSubmenuScreen.tsx
// New Solo submenu screen.
//
// This screen intentionally reuses the existing Solo submenu UI,
// because that UI already matches the desired design.

import React, { useState } from 'react';
import { Alert } from 'react-native';
import type { SoloSubmenuNavigation } from '../types/navigation';
import SoloSubMenu from '../../screens/SoloSubMenu';
import { useSoloSubmenuState } from '../solo/useSoloSubmenuState';
import { ModePowerSetupScreen } from '../shared/setup/ModePowerSetupScreen';
import type { FreshSoloSetup } from '../solo/soloSetup.types';

export default function SoloSubmenuScreen({
  onBackToMenu,
  onStartSoloGame,
  onOpenProfiles,
  activeProfileAvatar,
  activeProfile,
}: SoloSubmenuNavigation) {
  const [phase, setPhase] = useState<'setup' | 'power'>('setup');
  const [pendingSetup, setPendingSetup] = useState<FreshSoloSetup | null>(null);
  const {
    selectedMode,
    selectableModeIds,
    canStart,
    startMessage,
    handleSelectMode,
    buildSoloSetup,
  } = useSoloSubmenuState(activeProfile ?? null);

  if (phase === 'power' && pendingSetup) {
    return (
      <ModePowerSetupScreen
        playerLabel="PICK YOUR POWERS"
        actionLabel="START GAME"
        p1Profile={activeProfile ?? null}
        initialSlots={{ slot1: null, slot2: null }}
        onBack={() => setPhase('setup')}
        onConfirm={(loadout) => {
          onStartSoloGame({ ...pendingSetup, powerSlotIds: loadout });
        }}
      />
    );
  }

  return (
    <SoloSubMenu
      onBack={onBackToMenu}
      onStart={() => {
        const setup = buildSoloSetup();
        if (!setup) {
          Alert.alert('Not Enough Stickers', startMessage ?? 'You do not qualify for this mode yet.');
          return;
        }
        setPendingSetup(setup);
        setPhase('power');
      }}
      onOpenProfiles={onOpenProfiles}
      profileAvatar={activeProfileAvatar}
      profileName={activeProfile?.name ?? 'Profile'}
      profileColor={activeProfile?.color ?? 'sunset'}
      soloMode={selectedMode}
      onChangeSoloMode={handleSelectMode}
      selectableModeIds={selectableModeIds}
      startDisabled={!canStart}
      startMessage={startMessage}
    />
  );
}
