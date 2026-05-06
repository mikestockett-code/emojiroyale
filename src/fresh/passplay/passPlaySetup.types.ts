import type { BattlePowerSlotLoadout } from '../../types';

export type FreshPassPlaySetup = {
  selectedWagerId: string;
  player1ProfileId: string | null;
  player2ProfileId: string | null;
  powerSlotIds: {
    player1: BattlePowerSlotLoadout;
    player2: BattlePowerSlotLoadout;
  };
};
