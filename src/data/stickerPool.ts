import type { StickerEntry, StickerId, StickerPoolRarity } from '../types';
import diceEp1 from '../../assets/CustomEmojis/diceemojis/random.png';
import diceFree from '../../assets/CustomEmojis/diceemojis/free.png';
import sticker67 from '../../assets/CustomEmojis/67.png';
import epicwinner from '../../assets/CustomEmojis/epicwinner.png';
import phoenixemoji from '../../assets/CustomEmojis/phoenixemoji.png';
import polly from '../../assets/CustomEmojis/polly.png';
import powerClearColumn from '../../assets/PowersSlots/ColumnClear.png';
import powerClearRow from '../../assets/PowersSlots/RowClearSelector.png';
import powerClockFreeze from '../../assets/PowersSlots/PowerSlotBattleMode/powerfreeze.png';
import powerPlus10Seconds from '../../assets/PowersSlots/PowerSlotBattleMode/10secondsadded.png';
import powerRemoveTile from '../../assets/PowersSlots/TheEraserSelector.png';
import powerTortureRack from '../../assets/PowersSlots/TortureRackSelector.png';
import psemoji from '../../assets/CustomEmojis/psemoji.png';
import thehiddenson from '../../assets/CustomEmojis/thehiddenson.png';
import theWizardOfOz from '../../assets/CustomEmojis/the_wiz.png';
import { GENERATED_STICKER_SPECS } from './generatedStickerSpecs';

export type StickerPoolEntry = {
  id: StickerId;
  name: string;
  rarity: StickerPoolRarity;
  playable: boolean;
  albumNumber: number;
  emoji?: string;
  imageSource?: number;
  rewardOnly?: boolean;
  eventOnly?: boolean;
};

const EXISTING_GAMEPLAY_STICKERS: Omit<StickerPoolEntry, 'albumNumber'>[] = [
  { id: 'sunny-smile', emoji: '😀', name: 'Sunny Smile', rarity: 'common', playable: true },
  { id: 'cool-shades', emoji: '😎', name: 'Cool Shades', rarity: 'common', playable: true },
  { id: 'heart-eyes', emoji: '😍', name: 'Heart Eyes', rarity: 'common', playable: true },
  { id: 'laugh-cry', emoji: '😂', name: 'Laugh Cry', rarity: 'common', playable: true },
  { id: 'thinking-face', emoji: '🤔', name: 'Big Thinker', rarity: 'common', playable: true },
  { id: 'wink-face', emoji: '😉', name: 'Wink Face', rarity: 'common', playable: true },
  { id: 'mischief-grin', emoji: '😈', name: 'Mischief Grin', rarity: 'rare', playable: true },
  { id: 'big-tears', emoji: '😭', name: 'Big Tears', rarity: 'rare', playable: true },
  { id: 'party-face', emoji: '🥳', name: 'Party Face', rarity: 'rare', playable: true },
  { id: 'mind-blown', emoji: '🤯', name: 'Mind Blown', rarity: 'rare', playable: true },
  { id: 'cowboy', emoji: '🤠', name: 'Cowboy', rarity: 'rare', playable: true },
  { id: 'nerd-face', emoji: '🤓', name: 'Nerd Face', rarity: 'rare', playable: true },
  { id: 'blaze-face', emoji: '😡', name: 'Blaze Face', rarity: 'epic', playable: true },
  { id: 'cold-face', emoji: '🥶', name: 'Ice Cold', rarity: 'epic', playable: true },
  { id: 'hot-face', emoji: '🥵', name: 'Heat Wave', rarity: 'epic', playable: true },
  { id: 'skull', emoji: '💀', name: 'Skull', rarity: 'epic', playable: true },
  { id: 'psemoji-sticker', emoji: '🎮', name: 'PS Emoji', rarity: 'epic', playable: true },
  { id: 'halo-hero', emoji: '😇', name: 'Halo Hero', rarity: 'legendary', playable: true },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', rarity: 'legendary', playable: true },
  { id: 'crown', emoji: '👑', name: 'The Crown', rarity: 'legendary', playable: true },
  { id: 'alien', emoji: '👽', name: 'Alien', rarity: 'legendary', playable: true },
  {
    id: 'phoenix-emoji-sticker',
    emoji: '🔥',
    name: 'Phoenix',
    rarity: 'legendary',
    playable: true,
    imageSource: phoenixemoji,
  },
  {
    id: 'hidden-son',
    emoji: '⭐',
    name: 'Hidden Son',
    rarity: 'platinum',
    playable: true,
    imageSource: thehiddenson,
    rewardOnly: true,
  },
  {
    id: 'family-dog',
    emoji: '🐶',
    name: 'Polly',
    rarity: 'legendary',
    playable: true,
    imageSource: polly,
  },
  {
    id: 'secret-67',
    name: 'Lucky 67',
    rarity: 'platinum',
    playable: false,
    imageSource: sticker67,
    rewardOnly: true,
  },
  {
    id: 'epic-winner',
    name: 'Epic Winner',
    rarity: 'legendary',
    playable: false,
    imageSource: epicwinner,
    rewardOnly: true,
  },
];

const PROGRESSION_BOOST_STICKERS: Omit<StickerPoolEntry, 'albumNumber'>[] = [
  { id: 'green-apple', emoji: '🍏', name: 'Green Apple', rarity: 'common', playable: false },
  { id: 'red-apple', emoji: '🍎', name: 'Red Apple', rarity: 'common', playable: false },
  { id: 'pear-drop', emoji: '🍐', name: 'Pear Drop', rarity: 'common', playable: false },
  { id: 'peach-pop', emoji: '🍑', name: 'Peach Pop', rarity: 'common', playable: false },
  { id: 'berry-burst', emoji: '🍓', name: 'Berry Burst', rarity: 'common', playable: false },
  { id: 'cherry-pair', emoji: '🍒', name: 'Cherry Pair', rarity: 'common', playable: false },
  { id: 'lemon-zing', emoji: '🍋', name: 'Lemon Zing', rarity: 'common', playable: false },
  { id: 'melon-slice', emoji: '🍉', name: 'Melon Slice', rarity: 'common', playable: false },
  { id: 'grape-bunch', emoji: '🍇', name: 'Grape Bunch', rarity: 'common', playable: false },
  { id: 'mushroom-cap', emoji: '🍄', name: 'Mushroom Cap', rarity: 'common', playable: false },
  { id: 'sunflower-field', emoji: '🌻', name: 'Sunflower Field', rarity: 'common', playable: false },
  { id: 'spring-blossom', emoji: '🌼', name: 'Spring Blossom', rarity: 'common', playable: false },
  { id: 'garden-tulip', emoji: '🌷', name: 'Garden Tulip', rarity: 'common', playable: false },
  { id: 'maple-glow', emoji: '🍁', name: 'Maple Glow', rarity: 'common', playable: false },
  { id: 'forest-cactus', emoji: '🌵', name: 'Forest Cactus', rarity: 'common', playable: false },
  { id: 'moon-glow', emoji: '🌙', name: 'Moon Glow', rarity: 'common', playable: false },
  { id: 'sun-halo', emoji: '🌞', name: 'Sun Halo', rarity: 'common', playable: false },
  { id: 'snow-crystal', emoji: '❄️', name: 'Snow Crystal', rarity: 'common', playable: false },
  { id: 'lucky-clover', emoji: '☘️', name: 'Lucky Clover', rarity: 'common', playable: false },
  { id: 'rain-cloud', emoji: '🌧️', name: 'Rain Cloud', rarity: 'common', playable: false },
  { id: 'rocket-rush', emoji: '🚀', name: 'Rocket Rush', rarity: 'epic', playable: false },
  { id: 'thunder-flash', emoji: '⚡', name: 'Thunder Flash', rarity: 'epic', playable: false },
  { id: 'dart-hit', emoji: '🎯', name: 'Dart Hit', rarity: 'epic', playable: false },
  { id: 'joystick-jam', emoji: '🕹️', name: 'Joystick Jam', rarity: 'epic', playable: false },
  { id: 'game-die', emoji: '🎲', name: 'Game Die', rarity: 'epic', playable: false },
  { id: 'mic-drop', emoji: '🎤', name: 'Mic Drop', rarity: 'epic', playable: false },
  { id: 'headphone-hype', emoji: '🎧', name: 'Headphone Hype', rarity: 'epic', playable: false },
  { id: 'electric-guitar', emoji: '🎸', name: 'Electric Guitar', rarity: 'epic', playable: false },
  { id: 'soccer-strike', emoji: '⚽', name: 'Soccer Strike', rarity: 'epic', playable: false },
  { id: 'anchor-drop', emoji: '⚓', name: 'Anchor Drop', rarity: 'epic', playable: false },
  { id: 'treasure-key', emoji: '🗝️', name: 'Treasure Key', rarity: 'epic', playable: false },
  { id: 'shield-spark', emoji: '🛡️', name: 'Shield Spark', rarity: 'epic', playable: false },
  { id: 'dragon-face-crest', emoji: '🐲', name: 'Dragon Face', rarity: 'legendary', playable: false },
  { id: 'royal-castle', emoji: '🏰', name: 'Royal Castle', rarity: 'legendary', playable: false },
  { id: 'victory-trophy', emoji: '🏆', name: 'Victory Trophy', rarity: 'legendary', playable: false },
  { id: 'crystal-gem', emoji: '💎', name: 'Crystal Gem', rarity: 'legendary', playable: false },
  { id: 'mystic-orb', emoji: '🔮', name: 'Mystic Orb', rarity: 'legendary', playable: false },
  { id: 'volcano-core', emoji: '🌋', name: 'Volcano Core', rarity: 'legendary', playable: false },
  { id: 'starlit-sky', emoji: '🌌', name: 'Starlit Sky', rarity: 'legendary', playable: false },
  { id: 'golden-ring', emoji: '💍', name: 'Golden Ring', rarity: 'legendary', playable: false },
];

const DICE_FACE_STICKERS: Omit<StickerPoolEntry, 'albumNumber'>[] = [
  { id: 'die-ep1', name: 'EP1 Effect', rarity: 'emojiPowers', playable: false, imageSource: diceEp1, rewardOnly: true },
  { id: 'die-free', name: 'Free Sticker', rarity: 'emojiPowers', playable: false, imageSource: diceFree, rewardOnly: true },
];

const POWER_EMOJI_STICKERS: Omit<StickerPoolEntry, 'albumNumber'>[] = [
  { id: 'power-torture-rack', name: 'Torture Rack', rarity: 'emojiPowers', playable: false, imageSource: powerTortureRack, rewardOnly: true },
  { id: 'power-clear-row', name: 'Clear Row', rarity: 'emojiPowers', playable: false, imageSource: powerClearRow, rewardOnly: true },
  { id: 'power-clear-column', name: 'Clear Column', rarity: 'emojiPowers', playable: false, imageSource: powerClearColumn, rewardOnly: true },
  { id: 'power-remove-emoji', name: 'Remove Emoji', rarity: 'emojiPowers', playable: false, imageSource: powerRemoveTile, rewardOnly: true },
];

const POWER_EMOJI_PLUS_STICKERS: Omit<StickerPoolEntry, 'albumNumber'>[] = [
  { id: 'power-plus-10-seconds', name: '+10 Seconds', rarity: 'emojiPowers', playable: false, imageSource: powerPlus10Seconds, rewardOnly: true },
  { id: 'power-clock-freeze', name: 'Clock Freeze', rarity: 'emojiPowers', playable: false, imageSource: powerClockFreeze, rewardOnly: true },
  { id: 'power-plus-torture-rack', name: 'Torture Rack+', rarity: 'emojiPowers', playable: false, imageSource: powerTortureRack, rewardOnly: true },
  { id: 'power-plus-clear-row', name: 'Clear Row+', rarity: 'emojiPowers', playable: false, imageSource: powerClearRow, rewardOnly: true },
  { id: 'power-plus-clear-column', name: 'Clear Column+', rarity: 'emojiPowers', playable: false, imageSource: powerClearColumn, rewardOnly: true },
  { id: 'power-plus-remove-emoji', name: 'Remove Emoji+', rarity: 'emojiPowers', playable: false, imageSource: powerRemoveTile, rewardOnly: true },
  { id: 'power-plus-plus-10-seconds', name: '+10 Seconds+', rarity: 'emojiPowers', playable: false, imageSource: powerPlus10Seconds, rewardOnly: true },
];

const HOLIDAY_EVENT_STICKERS: Omit<StickerPoolEntry, 'albumNumber'>[] = [
  { id: 'holiday-christmas', emoji: '🎄', name: 'Santa Hat', rarity: 'ultra', playable: false, eventOnly: true },
  { id: 'holiday-halloween', emoji: '🎃', name: 'Jack O Lantern', rarity: 'ultra', playable: false, eventOnly: true },
  { id: 'holiday-thanksgiving', emoji: '🦃', name: 'Turkey', rarity: 'ultra', playable: false, eventOnly: true },
  { id: 'holiday-easter', emoji: '🐣', name: 'Easter Bunny', rarity: 'ultra', playable: false, eventOnly: true },
  { id: 'holiday-new-year', emoji: '🎆', name: 'Fireworks', rarity: 'ultra', playable: false, eventOnly: true },
  { id: 'holiday-valentine', emoji: '💘', name: 'Heart Box', rarity: 'ultra', playable: false, eventOnly: true },
  { id: 'holiday-july-fourth', emoji: '🎇', name: 'Uncle Sam Hat', rarity: 'ultra', playable: false, eventOnly: true },
  { id: 'holiday-birthday', emoji: '🎂', name: 'Birthday Cake', rarity: 'ultra', playable: false, eventOnly: true },
];

const GOLDEN_PHOENIX_STICKER: Omit<StickerPoolEntry, 'albumNumber'> = {
  id: 'golden-phoenix',
  emoji: '🔥',
  name: 'Golden Phoenix',
  rarity: 'legendary',
  playable: false,
  imageSource: psemoji,
  rewardOnly: true,
};

const WIZARD_OF_OZ_STICKER: Omit<StickerPoolEntry, 'albumNumber'> = {
  id: 'wizard-of-oz',
  name: 'The Wizard Of Oz',
  rarity: 'easterEgg',
  playable: false,
  imageSource: theWizardOfOz,
  rewardOnly: true,
};

function getBetaRarity(seed: number): Exclude<StickerPoolRarity, 'ultra' | 'rare' | 'easterEgg' | 'emojiPowers'> {
  const roll = seed % 100;
  if (roll < 56) return 'common';
  if (roll < 80) return 'epic';
  if (roll < 93) return 'legendary';
  return 'platinum';
}

function buildGeneratedStickers(): Omit<StickerPoolEntry, 'albumNumber'>[] {
  return GENERATED_STICKER_SPECS.map((spec, index) => ({
    id: `beta-${spec.key}-${spec.codePoint.toString(16)}`,
    emoji: String.fromCodePoint(spec.codePoint),
    name: spec.name,
    rarity: getBetaRarity(spec.codePoint + index + 1),
    playable: false,
  }));
}

const GENERATED_STICKERS = buildGeneratedStickers();

const ALL_STICKERS_RAW: Omit<StickerPoolEntry, 'albumNumber'>[] = [
  ...EXISTING_GAMEPLAY_STICKERS,
  ...PROGRESSION_BOOST_STICKERS,
  ...DICE_FACE_STICKERS,
  ...POWER_EMOJI_STICKERS,
  ...POWER_EMOJI_PLUS_STICKERS,
  ...GENERATED_STICKERS,
  ...HOLIDAY_EVENT_STICKERS,
  GOLDEN_PHOENIX_STICKER,
  WIZARD_OF_OZ_STICKER,
];

const ALL_STICKERS: StickerPoolEntry[] = ALL_STICKERS_RAW.map((sticker, index) => ({
  ...sticker,
  albumNumber: index + 1,
}));

export function getAllStickers() {
  return ALL_STICKERS;
}

export function getPlayableStickers() {
  return ALL_STICKERS.filter((sticker) => sticker.playable);
}

export function getRandomRewardSticker(
  rarity: Exclude<StickerPoolRarity, 'epic' | 'ultra' | 'easterEgg' | 'emojiPowers'>,
  excludedIds: string[] = []
) {
  const excludedSet = new Set(excludedIds);
  const pool = ALL_STICKERS.filter(
    (sticker) =>
      sticker.rarity === rarity &&
      !sticker.eventOnly &&
      !sticker.rewardOnly &&
      !excludedSet.has(sticker.id)
  );

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

export const RACK_POOL_STICKER_IDS: StickerId[] = EXISTING_GAMEPLAY_STICKERS
  .filter((sticker) => sticker.playable)
  .map((sticker) => sticker.id);

export function toStickerEntry(sticker: StickerPoolEntry): StickerEntry {
  return {
    ...sticker,
    initialOwned: 0,
  };
}

export const PLAYABLE_EMOJIS: StickerEntry[] = getPlayableStickers().map(toStickerEntry);
export const STICKER_EMOJIS: StickerEntry[] = getAllStickers().map(toStickerEntry);
export const STICKER_CATALOG: StickerEntry[] = STICKER_EMOJIS;
export const RACK_POOL_EMOJIS: StickerEntry[] = RACK_POOL_STICKER_IDS
  .map((stickerId) => STICKER_CATALOG.find((entry) => entry.id === stickerId))
  .filter((entry): entry is StickerEntry => Boolean(entry));
