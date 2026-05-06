import type { BattlePowerId } from '../../types';

export type FreshBattleSetup = {
  playerProfileId: string | null;
  powerSlotIds: {
    slot1: BattlePowerId | null;
    slot2: BattlePowerId | null;
  };
};
