import { useState } from 'react';
import type { BattlePowerSlotLoadout, StickerId } from '../../types';
import type { FreshPassPlaySetup } from './passPlaySetup.types';
import { pickOwnedStickerInTier } from '../shared/wagers/wagerInventory';

function pickOwnedStickerId(wagerId: string, counts: Record<string, number>): StickerId | null {
  const tier = wagerId === 'legendary' ? 'legendary' : wagerId === 'epic' ? 'epic' : null;
  if (!tier) return null;
  return pickOwnedStickerInTier(counts, tier);
}

export type SetupPhase = 'setup' | 'powerP1' | 'powerP2';

const EMPTY: BattlePowerSlotLoadout = { slot1: null, slot2: null };

export function usePassPlaySubmenu(
  activeProfileId: string | null,
  secondaryProfileId: string | null,
  initialWagerId = 'none',
  p1AlbumCounts: Record<string, number> = {},
  p2AlbumCounts: Record<string, number> = {},
) {
  const [selectedWager, setSelectedWager] = useState(initialWagerId);
  const [setupPhase, setSetupPhase] = useState<SetupPhase>('setup');
  const [p1Loadout, setP1Loadout] = useState<BattlePowerSlotLoadout>(EMPTY);
  const [p2Loadout, setP2Loadout] = useState<BattlePowerSlotLoadout>(EMPTY);

  const buildSetup = (p1: BattlePowerSlotLoadout, p2: BattlePowerSlotLoadout): FreshPassPlaySetup => ({
    selectedWagerId: selectedWager,
    p1WagerStickerId: pickOwnedStickerId(selectedWager, p1AlbumCounts),
    p2WagerStickerId: pickOwnedStickerId(selectedWager, p2AlbumCounts),
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
