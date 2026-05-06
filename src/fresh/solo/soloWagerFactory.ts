import type { SoloModeId, SoloWagerTier } from '../../types';
import { STICKER_CATALOG } from '../../data/stickerPool';
import type { FreshSoloSetup, FreshSoloWager } from './soloSetup.types';

function pickRandomStickerId(rarity: SoloWagerTier) {
  const candidates = STICKER_CATALOG.filter((entry) => {
    if (entry.id === 'golden-phoenix') return false;
    if (rarity === 'epicLite') {
      return entry.rarity === 'common' && entry.playable === false;
    }
    return entry.rarity === rarity && entry.playable === false;
  });

  const fallbackCandidates = STICKER_CATALOG.filter((entry) => {
    if (entry.id === 'golden-phoenix') return false;
    if (rarity === 'epicLite') {
      return entry.rarity === 'common';
    }
    return entry.rarity === rarity;
  });

  const pool = candidates.length > 0 ? candidates : fallbackCandidates;
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)]?.id ?? null;
}

function createPracticeWager(): FreshSoloWager {
  return {
    tier: 'skip',
    stickerId: null,
    stickerCount: 0,
    label: 'No Wager',
  };
}

function createEpicLiteWager(): FreshSoloWager {
  return {
    tier: 'epicLite',
    stickerId: pickRandomStickerId('epicLite'),
    stickerCount: 25,
    label: '25 Common Stickers',
  };
}

function createEpicWager(): FreshSoloWager {
  return {
    tier: 'epic',
    stickerId: pickRandomStickerId('epic'),
    stickerCount: 1,
    label: '1 Epic Sticker',
  };
}

export function createFreshSoloSetup(modeId: SoloModeId): FreshSoloSetup {
  if (modeId === 'epicLite') {
    return {
      modeId,
      wager: createEpicLiteWager(),
    };
  }

  if (modeId === 'epic') {
    return {
      modeId,
      wager: createEpicWager(),
    };
  }

  return {
    modeId: 'practice',
    wager: createPracticeWager(),
  };
}
