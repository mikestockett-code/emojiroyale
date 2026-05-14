import type { SoloModeId } from '../../types';
import type { FreshProfile } from '../profile/types';
import type { FreshSoloModeAvailability } from './soloSetup.types';
import { hasCommonStack, hasStickerInTier } from '../shared/wagers/wagerInventory';

function getLockedReason(modeId: SoloModeId, activeProfile: FreshProfile | null): string | null {
  if (modeId === 'practice') return null;
  if (modeId === 'hard' || modeId === 'battle') return 'This mode is still paused.';
  if (!activeProfile) return 'Create a profile to unlock wager modes.';
  const albumCounts = activeProfile.albumCounts ?? {};

  if (modeId === 'epicLite') {
    if (!hasCommonStack(albumCounts, 25)) return 'You need one Common sticker stack of 25 to enter Epic Lite.';
  }

  if (modeId === 'epic') {
    if (!hasStickerInTier(albumCounts, 'epic')) return 'You need at least one epic sticker to enter Epic mode.';
  }

  return null;
}

export function getFreshSoloModeAvailability(
  activeProfile: FreshProfile | null,
  modeId: SoloModeId,
): FreshSoloModeAvailability {
  const reason = getLockedReason(modeId, activeProfile);
  return {
    modeId,
    isSelectable: reason === null,
    reason,
  };
}

export function getFreshSoloStartMessage(availability: FreshSoloModeAvailability | undefined): string | null {
  if (!availability) return null;
  if (!availability.isSelectable) {
    return availability.reason;
  }

  if (availability.modeId === 'practice') {
    return 'Practice is always open. No sticker is put at risk.';
  }

  if (availability.modeId === 'epicLite') {
    return 'Start uses one Common sticker stack of 25 for the Epic Lite wager.';
  }

  if (availability.modeId === 'epic') {
    return 'Start will auto-pick one epic sticker for the Epic wager.';
  }

  return null;
}
