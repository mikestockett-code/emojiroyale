import { ALBUM_STICKER_CATALOG } from '../fresh/album/albumStickerCatalog';
import type { StickerId } from '../types';
import type { FreshSoloRewardPreview } from './soloRewardRules';

export const WIZARD_OF_OZ_STICKER_ID = 'wizard-of-oz';
export const WIZARD_OF_OZ_STICKER_NAME = 'The Wizard Of Oz';

const EP1_JACKPOT_IDS: StickerId[] = [
  'power-torture-rack',
  'power-clear-row',
  'power-clear-column',
  'power-remove-emoji',
  'power-four-square',
  'power-tornado',
];

const EPI_JACKPOT_IDS: StickerId[] = [
  'power-plus-10-seconds',
  'power-clock-freeze',
  'power-reverse-time',
  'power-rerack',
];

type GrantSticker = (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;

export function createWizardOfOzRewardPreview(): FreshSoloRewardPreview {
  return {
    kind: 'easterEgg',
    count: 1,
    stickerId: WIZARD_OF_OZ_STICKER_ID,
    stickerName: WIZARD_OF_OZ_STICKER_NAME,
  };
}

export function isWizardOfOzRewardPreview(rewardPreview?: FreshSoloRewardPreview | null) {
  return rewardPreview?.stickerId === WIZARD_OF_OZ_STICKER_ID;
}

export function grantWizardOfOzJackpot(
  profileId: string | null | undefined,
  grantSticker?: GrantSticker,
) {
  if (!profileId || !grantSticker) return false;

  grantSticker(profileId, WIZARD_OF_OZ_STICKER_ID, 1);
  grantRandomAlbumStickers(profileId, grantSticker, 'common', 2);
  grantRandomAlbumStickers(profileId, grantSticker, 'epic', 2);
  grantRandomAlbumStickers(profileId, grantSticker, 'legendary', 2);
  grantRandomStickerIds(profileId, grantSticker, EP1_JACKPOT_IDS, 2);
  grantRandomStickerIds(profileId, grantSticker, EPI_JACKPOT_IDS, 2);

  return true;
}

function grantRandomAlbumStickers(
  profileId: string,
  grantSticker: GrantSticker,
  chapterId: 'common' | 'epic' | 'legendary',
  count: number,
) {
  const pool = ALBUM_STICKER_CATALOG.filter((sticker) => sticker.chapterId === chapterId);
  grantRandomStickerIds(profileId, grantSticker, pool.map((sticker) => sticker.id), count);
}

function grantRandomStickerIds(
  profileId: string,
  grantSticker: GrantSticker,
  pool: StickerId[],
  count: number,
) {
  if (pool.length === 0) return;

  for (let index = 0; index < count; index += 1) {
    const stickerId = pool[Math.floor(Math.random() * pool.length)];
    if (stickerId) grantSticker(profileId, stickerId, 1);
  }
}
