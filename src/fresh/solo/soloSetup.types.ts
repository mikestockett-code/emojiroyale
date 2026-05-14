import type { BattlePowerSlotLoadout, SoloModeId, SoloWagerTier, StickerId } from '../../types';

export type FreshSoloModeAvailability = {
  modeId: SoloModeId;
  isSelectable: boolean;
  reason: string | null;
};

export type FreshSoloWager = {
  tier: SoloWagerTier;
  stickerId: StickerId | null;
  stickerCount: number;
  label: string;
};

export type FreshSoloSetup = {
  modeId: SoloModeId;
  wager: FreshSoloWager;
  powerSlotIds: BattlePowerSlotLoadout;
};
