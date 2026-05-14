import type { BattlePowerSlotLoadout, StickerId } from '../../types';

export type FreshPassPlaySetup = {
  selectedWagerId: string;
  p1WagerStickerId: StickerId | null;
  p2WagerStickerId: StickerId | null;
  player1ProfileId: string | null;
  player2ProfileId: string | null;
  powerSlotIds: {
    player1: BattlePowerSlotLoadout;
    player2: BattlePowerSlotLoadout;
  };
};
