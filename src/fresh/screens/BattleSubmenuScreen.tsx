import React from 'react';
import type { BattleSubmenuNavigation } from '../types/navigation';
import { ModePowerSetupScreen } from '../shared/setup/ModePowerSetupScreen';

export default function BattleSubmenuScreen({ onBackToMenu, onStartBattleGame, activeProfile }: BattleSubmenuNavigation) {
  return (
    <ModePowerSetupScreen
      playerLabel="BATTLE MODE  •  PICK 2"
      actionLabel="START BATTLE"
      p1Profile={activeProfile ?? null}
      allowEpi
      albumCounts={activeProfile?.albumCounts}
      onBack={onBackToMenu}
      onConfirm={(loadout) => {
        onStartBattleGame({ playerProfileId: activeProfile?.id ?? null, powerSlotIds: loadout });
      }}
    />
  );
}
