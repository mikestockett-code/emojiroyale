import React, { useState } from 'react';

import { SoloModeCardDeck } from '../components/game/SoloModeCardDeck';
import { SharedBottomNav } from '../fresh/shared/SharedBottomNav';
import { CarouselSubmenuScreen } from '../fresh/shared/submenu/CarouselSubmenuScreen';
import type { SoloModeId } from '../types';
import type { FreshProfileColor } from '../fresh/profile/types';

const BG = require('../../assets/backgrounds/backgroundgamearea.png');

type Props = {
  onBack: () => void;
  onStart?: () => void;
  onOpenProfiles?: () => void;
  profileAvatar?: string | null;
  profileName?: string;
  profileColor?: FreshProfileColor | null;
  soloMode?: SoloModeId;
  onChangeSoloMode?: (mode: SoloModeId) => void;
  selectableModeIds?: SoloModeId[];
  startDisabled?: boolean;
  startMessage?: string | null;
};

export default function SoloSubMenu({
  onBack,
  onStart,
  onOpenProfiles,
  profileAvatar = '🙂',
  profileName = 'Profile',
  profileColor = 'sunset',
  soloMode: controlledSoloMode,
  onChangeSoloMode,
  selectableModeIds = ['practice', 'epicLite', 'epic'],
  startDisabled = false,
  startMessage = null,
}: Props) {
  const [localSoloMode, setLocalSoloMode] = useState<SoloModeId>('practice');
  const soloMode = controlledSoloMode ?? localSoloMode;

  const handleSelectMode = (mode: string) => {
    const nextMode = mode as SoloModeId;
    onChangeSoloMode?.(nextMode);
    if (!controlledSoloMode) {
      setLocalSoloMode(nextMode);
    }
  };

  return (
    <CarouselSubmenuScreen
      backgroundSource={BG}
      startPlacement="flow"
      onStart={onStart}
      startDisabled={startDisabled}
      startMessage={startMessage}
      bottomNav={(
        <SharedBottomNav
          profileName={profileName}
          profileAvatar={profileAvatar}
          profileColor={profileColor}
          scoreLabel="Score"
          scoreValue={0}
          onProfilePress={onOpenProfiles}
          onBackPress={onBack}
          onHowToPress={() => {}}
        />
      )}
      deck={(
        <SoloModeCardDeck
          selectedId={soloMode}
          onSelect={handleSelectMode}
          playSound={() => {}}
          selectableIds={selectableModeIds}
        />
      )}
    />
  );
}
