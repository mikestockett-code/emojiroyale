import type { FreshProfile } from '../profile/types';
import { ALBUM_STICKER_CATALOG } from '../album/albumStickerCatalog';

export function getPassPlayWagerBlockReason(
  wagerId: string,
  p1Profile: FreshProfile | null,
  p2Profile: FreshProfile | null,
) {
  if (!p1Profile || !p2Profile) return 'Choose both P1 and P2 before starting Pass & Play.';
  if (wagerId === 'none') return null;

  const chapterId = wagerId === 'legendary' ? 'legendary' : wagerId === 'epic' ? 'epic' : null;
  if (!chapterId) return null;

  const missingNames = [p1Profile, p2Profile]
    .filter((profile) => {
      const albumCounts = profile.albumCounts ?? {};
      return !ALBUM_STICKER_CATALOG.some((sticker) => sticker.chapterId === chapterId && (albumCounts[sticker.id] ?? 0) > 0);
    })
    .map((profile) => profile.name);

  if (missingNames.length === 0) return null;

  const label = chapterId === 'legendary' ? 'Legendary' : 'Epic';
  return `${missingNames.join(' and ')} need at least one ${label} sticker to play this wager.`;
}
