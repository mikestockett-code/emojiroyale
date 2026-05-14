import type { FreshProfile } from '../profile/types';
import { hasStickerInTier } from '../shared/wagers/wagerInventory';

type PassPlayWagerValidationOptions = {
  goldenPhoenixRequired?: boolean;
  goldenPhoenixHolderName?: string;
};

export function getPassPlayWagerBlockReason(
  wagerId: string,
  p1Profile: FreshProfile | null,
  p2Profile: FreshProfile | null,
  options: PassPlayWagerValidationOptions = {},
) {
  if (!p1Profile || !p2Profile) return 'Choose both P1 and P2 before starting Pass & Play.';

  if (wagerId === 'epic' || wagerId === 'legendary') {
    const p1Counts = p1Profile.albumCounts ?? {};
    const p2Counts = p2Profile.albumCounts ?? {};
    const hasP1 = hasStickerInTier(p1Counts, wagerId);
    const hasP2 = hasStickerInTier(p2Counts, wagerId);
    if (!hasP1 && !hasP2) return `Both players need at least one ${wagerId} sticker to wager.`;
    if (!hasP1) return `${p1Profile.name} needs at least one ${wagerId} sticker to wager.`;
    if (!hasP2) return `${p2Profile.name} needs at least one ${wagerId} sticker to wager.`;
  }
  if (!options.goldenPhoenixRequired) return null;

  if (wagerId !== 'legendary') {
    return 'The Golden Phoenix challenge needs the legendary sticker wager.';
  }

  const holderName = options.goldenPhoenixHolderName?.trim();
  if (!holderName) {
    return 'Checking who holds the Golden Phoenix trophy...';
  }

  if (holderName.toLowerCase() === 'open') {
    return 'The Golden Phoenix trophy is still open. Claim it with a legendary win first.';
  }

  const p1Name = p1Profile.name.trim().toLowerCase();
  const p2Name = p2Profile.name.trim().toLowerCase();
  const holderKey = holderName.toLowerCase();
  if (p1Name !== holderKey && p2Name !== holderKey) {
    return `The Golden Phoenix is held by ${holderName}. Choose that profile as P1 or P2 to start.`;
  }

  return null;
}
