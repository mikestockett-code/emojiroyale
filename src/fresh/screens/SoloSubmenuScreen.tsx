// SoloSubmenuScreen.tsx
// New Solo submenu screen.
//
// This screen intentionally reuses the existing Solo submenu UI,
// because that UI already matches the desired design.

import React from 'react';
import { Alert } from 'react-native';
import type { SoloSubmenuNavigation } from '../types/navigation';
import SoloSubMenu from '../../screens/SoloSubMenu';
import { useSoloSubmenuState } from '../solo/useSoloSubmenuState';
import { useAudioContext } from '../audio/AudioContext';

export default function SoloSubmenuScreen({
  onBackToMenu,
  onStartSoloGame,
  onOpenProfiles,
  activeProfileAvatar,
  activeProfile,
}: SoloSubmenuNavigation) {
  const { playSound } = useAudioContext();
  const {
    selectedMode,
    selectableModeIds,
    canStart,
    startMessage,
    handleSelectMode,
    buildSoloSetup,
  } = useSoloSubmenuState(activeProfile ?? null);

  return (
    <SoloSubMenu
      onBack={onBackToMenu}
      onStart={() => {
        const setup = buildSoloSetup();
        if (!setup) {
          Alert.alert('Not Enough Stickers', startMessage ?? 'You do not qualify for this mode yet.');
          return;
        }
        playSound('rumble');
        onStartSoloGame(setup);
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
