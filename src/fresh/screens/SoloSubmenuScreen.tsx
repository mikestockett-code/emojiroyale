import React, { useState } from 'react';
import { Alert } from 'react-native';
import type { SoloSubmenuNavigation } from '../types/navigation';
import { useSoloSubmenuState } from '../solo/useSoloSubmenuState';
import { ModePowerSetupScreen } from '../shared/setup/ModePowerSetupScreen';
import type { FreshSoloSetup } from '../solo/soloSetup.types';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import { SOLO_MODE_CARDS } from '../shared/submenu/CarouselCardDeck';
import { CarouselSubmenuScreen } from '../shared/submenu/CarouselSubmenuScreen';
import type { SoloModeId } from '../../types';

const BG = require('../../../assets/backgrounds/backgroundgamearea.png');

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
    <CarouselSubmenuScreen
      backgroundSource={BG}
      cards={SOLO_MODE_CARDS}
      selectedCardId={selectedMode}
      onSelectCard={(mode) => handleSelectMode(mode as SoloModeId)}
      selectableCardIds={selectableModeIds}
      getCardOpacity={(cardId) => (selectableModeIds.includes(cardId as SoloModeId) ? 1 : 0.48)}
      dots={SOLO_MODE_CARDS}
      selectedDotId={selectedMode}
      onStart={() => {
        const setup = buildSoloSetup();
        if (!setup) {
          Alert.alert('Not Enough Stickers', startMessage ?? 'You do not qualify for this mode yet.');
          return;
        }
        setPendingSetup(setup);
        setPhase('power');
      }}
      startDisabled={!canStart}
      startMessage={startMessage}
      bottomNav={(
        <SharedBottomNav
          profileName={activeProfile?.name ?? 'Profile'}
          profileAvatar={activeProfileAvatar}
          profileColor={activeProfile?.color ?? 'sunset'}
          scoreLabel="Score"
          scoreValue={0}
          onProfilePress={onOpenProfiles}
          onBackPress={onBackToMenu}
          onHowToPress={() => {}}
        />
      )}
    />
  );
}
