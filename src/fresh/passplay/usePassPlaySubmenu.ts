import { useState } from 'react';
import type { BattlePowerSlotLoadout } from '../../types';
import type { FreshPassPlaySetup } from './passPlaySetup.types';

export type SetupPhase = 'setup' | 'powerP1' | 'powerP2';

const EMPTY: BattlePowerSlotLoadout = { slot1: null, slot2: null };

export function usePassPlaySubmenu(
  activeProfileId: string | null,
  secondaryProfileId: string | null,
  initialWagerId = 'none',
) {
  const [selectedWager, setSelectedWager] = useState(initialWagerId);
  const [setupPhase, setSetupPhase] = useState<SetupPhase>('setup');
  const [p1Loadout, setP1Loadout] = useState<BattlePowerSlotLoadout>(EMPTY);
  const [p2Loadout, setP2Loadout] = useState<BattlePowerSlotLoadout>(EMPTY);

  const buildSetup = (p1: BattlePowerSlotLoadout, p2: BattlePowerSlotLoadout): FreshPassPlaySetup => ({
    selectedWagerId: selectedWager,
    player1ProfileId: activeProfileId,
    player2ProfileId: secondaryProfileId,
    powerSlotIds: { player1: p1, player2: p2 },
  });

  const goToP2 = (slots: BattlePowerSlotLoadout) => {
    setP1Loadout(slots);
    setSetupPhase('powerP2');
  };

  return {
    selectedWager, setSelectedWager,
    setupPhase, setSetupPhase,
    p1Loadout,
    p2Loadout, setP2Loadout,
    goToP2,
    buildSetup,
  };
}
