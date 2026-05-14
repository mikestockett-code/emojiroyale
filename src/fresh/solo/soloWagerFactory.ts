import type { BattlePowerSlotLoadout, SoloModeId, SoloWagerTier } from '../../types';
import { pickAnyStickerInTier, pickCommonStackSticker, pickOwnedStickerInTier } from '../shared/wagers/wagerInventory';
import type { FreshSoloSetup, FreshSoloWager } from './soloSetup.types';

function pickRandomStickerId(rarity: SoloWagerTier, albumCounts: Record<string, number> = {}): string | null {
  if (rarity === 'epicLite') {
    return pickCommonStackSticker(albumCounts, 25) ?? pickAnyStickerInTier('common');
  }
  if (rarity === 'epic') {
    return pickOwnedStickerInTier(albumCounts, 'epic') ?? pickAnyStickerInTier('epic');
  }
  return null;
}

function createPracticeWager(): FreshSoloWager {
  return { tier: 'skip', stickerId: null, stickerCount: 0, label: 'No Wager' };
}

function createEpicLiteWager(albumCounts: Record<string, number>): FreshSoloWager {
  return { tier: 'epicLite', stickerId: pickRandomStickerId('epicLite', albumCounts), stickerCount: 25, label: '25 Common Stickers' };
}

function createEpicWager(albumCounts: Record<string, number>): FreshSoloWager {
  return { tier: 'epic', stickerId: pickRandomStickerId('epic', albumCounts), stickerCount: 1, label: '1 Epic Sticker' };
}

const EMPTY_POWER_LOADOUT: BattlePowerSlotLoadout = { slot1: null, slot2: null };

export function createFreshSoloSetup(
  modeId: SoloModeId,
  albumCounts: Record<string, number> = {},
  powerSlotIds: BattlePowerSlotLoadout = EMPTY_POWER_LOADOUT,
): FreshSoloSetup {
  if (modeId === 'epicLite') return { modeId, wager: createEpicLiteWager(albumCounts), powerSlotIds };
  if (modeId === 'epic') return { modeId, wager: createEpicWager(albumCounts), powerSlotIds };
  return { modeId: 'practice', wager: createPracticeWager(), powerSlotIds };
}
