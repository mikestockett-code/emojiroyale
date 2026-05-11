import type { FreshProfile } from '../profile/types';

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
