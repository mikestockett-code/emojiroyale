import React from 'react';
import type { MainMenuNavigation } from '../types/navigation';
import HomeScreen from '../../components/game/HomeScreen';

export default function MainMenuScreen({
  onGoToSoloSubmenu,
  onGoToPassPlaySubmenu,
  onGoToBattleSubmenu,
  onGoToAlbum,
  onGoToHowToPlay,
  onGoToCTA,
  onToggleMute,
  onOpenProfiles,
  activeProfile,
}: MainMenuNavigation) {
  return (
    <HomeScreen
      onGoToSolo={onGoToSoloSubmenu}
      onGoToPassPlay={onGoToPassPlaySubmenu}
      onGoToBattle={onGoToBattleSubmenu}
      onGoToAlbum={onGoToAlbum}
      onGoToHowToPlay={onGoToHowToPlay}
      onGoToCTA={onGoToCTA}
      onToggleMute={onToggleMute}
      onOpenProfiles={onOpenProfiles}
      activeProfile={activeProfile}
    />
  );
}
