import type { Rarity, SoloModeId, StickerEntry, StickerDisplayItem, StickerReward, StickerId } from '../types';
import { RACK_POOL_EMOJIS, STICKER_CATALOG } from '../data/stickerPool';
import { ALBUM_STICKER_ENTRIES } from '../fresh/album/albumStickerCatalog';

export function getRewardVisual(rarity: Rarity, stickerId: StickerId) {
  if (stickerId === 'hidden-son') {
    return {
      accent: '#f8fafc',
      backgroundColor: '#f8fafc',
      borderColor: '#e5e7eb',
      glowColor: 'rgba(255,255,255,0.8)',
      panelTint: '#f8fafc',
      label: 'Platinum',
    };
  }

  switch (rarity) {
    case 'easterEgg':
      return {
        accent: '#16a34a',
        backgroundColor: '#dcfce7',
        borderColor: '#86efac',
        glowColor: 'rgba(34, 197, 94, 0.5)',
        panelTint: '#f0fdf4',
        label: 'Easter Egg',
      };
    case 'platinum':
      return {
        accent: '#475569',
        backgroundColor: '#e2e8f0',
        borderColor: '#94a3b8',
        glowColor: 'rgba(148, 163, 184, 0.55)',
        panelTint: '#f8fafc',
        label: 'Platinum',
      };
    case 'ultra':
      return {
        accent: '#be123c',
        backgroundColor: '#ffe4e6',
        borderColor: '#fb7185',
        glowColor: 'rgba(244, 63, 94, 0.4)',
        panelTint: '#fff1f2',
        label: 'Ultra',
      };
    case 'legendary':
      return {
        accent: '#d97706',
        backgroundColor: '#fef3c7',
        borderColor: '#facc15',
        glowColor: 'rgba(245, 158, 11, 0.5)',
        panelTint: '#fffbeb',
        label: 'Legendary',
      };
    case 'epic':
      return {
        accent: '#9333ea',
        backgroundColor: '#f3e8ff',
        borderColor: '#c084fc',
        glowColor: 'rgba(147, 51, 234, 0.45)',
        panelTint: '#faf5ff',
        label: 'Epic',
      };
    case 'rare':
      return {
        accent: '#2563eb',
        backgroundColor: '#dbeafe',
        borderColor: '#60a5fa',
        glowColor: 'rgba(37, 99, 235, 0.42)',
        panelTint: '#eff6ff',
        label: 'Rare',
      };
    case 'common':
    default:
      return {
        accent: '#6b7280',
        backgroundColor: '#e5e7eb',
        borderColor: '#9ca3af',
        glowColor: 'rgba(107, 114, 128, 0.28)',
        panelTint: '#f3f4f6',
        label: 'Common',
      };
  }
}


export function getStickerRarityRank(rarity: Rarity) {
  switch (rarity) {
    case 'ultra':
      return 6;
    case 'platinum':
      return 5;
    case 'legendary':
      return 4;
    case 'epic':
      return 3;
    case 'rare':
      return 2;
    case 'common':
    default:
      return 1;
  }
}

export function getStickerById(stickerId: StickerId) {
  return STICKER_CATALOG.find((e) => e.id === stickerId) ?? ALBUM_STICKER_ENTRIES.find((e) => e.id === stickerId) ?? STICKER_CATALOG[0];
}

export function getRandomStickerId() {
  return RACK_POOL_EMOJIS[Math.floor(Math.random() * RACK_POOL_EMOJIS.length)].id;
}

export function getStickerRarityVisual(sticker: StickerEntry) {
  if (sticker.id === 'hidden-son') {
    return {
      borderColor: '#f8fafc',
      shadowColor: '#e5e7eb',
      shadowOpacity: 0.65,
      shadowRadius: 14,
      elevation: 10,
    };
  }

  switch (sticker.rarity) {
    case 'easterEgg':
      return {
        borderColor: '#86efac',
        shadowColor: '#22c55e',
        shadowOpacity: 0.75,
        shadowRadius: 16,
        elevation: 11,
      };
    case 'ultra':
      return {
        borderColor: '#fb7185',
        shadowColor: '#e11d48',
        shadowOpacity: 0.7,
        shadowRadius: 16,
        elevation: 11,
      };
    case 'platinum':
      return {
        borderColor: '#cbd5e1',
        shadowColor: '#94a3b8',
        shadowOpacity: 0.65,
        shadowRadius: 14,
        elevation: 10,
      };
    case 'legendary':
      return {
        borderColor: '#facc15',
        shadowColor: '#f59e0b',
        shadowOpacity: 0.55,
        shadowRadius: 12,
        elevation: 9,
      };
    case 'epic':
      return {
        borderColor: '#c084fc',
        shadowColor: '#9333ea',
        shadowOpacity: 0.5,
        shadowRadius: 11,
        elevation: 8,
      };
    case 'rare':
      return {
        borderColor: '#60a5fa',
        shadowColor: '#2563eb',
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 7,
      };
    case 'common':
    default:
      return {
        borderColor: '#9ca3af',
        shadowColor: '#9ca3af',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
      };
  }
}

export function isCustomStickerId(stickerId: StickerId) {
  return Boolean(getStickerById(stickerId).imageSource);
}

export const LEGENDARY_STICKER_IDS: StickerId[] = ['phoenix-emoji-sticker', 'hidden-son', 'family-dog'];
export const SOLO_EPIC_MODE_IDS: SoloModeId[] = ['epicLite', 'epic', 'hard', 'battle'];

export function buildSoloRecapDisplayItems(soloRunRewards: import('../types').SoloRunRewardEntry[]): StickerDisplayItem[] {
  return soloRunRewards.map((entry) => ({
    id: `recap-${entry.stickerId}`,
    stickerId: entry.stickerId,
    name: entry.name,
    rarity: entry.rarity,
    wonCount: entry.count,
  }));
}

export function buildRewardDisplayItems(primaryReward: StickerReward | null, queuedRewards: StickerReward[]) {
  const rewards = primaryReward ? [primaryReward, ...queuedRewards] : [];
  const groupedRewards = rewards.reduce((map, reward, index) => {
    const existingReward = map.get(reward.stickerId);
    if (existingReward) {
      existingReward.ownedCount = reward.totalOwned;
      existingReward.wonCount = (existingReward.wonCount ?? 0) + 1;
    } else {
      map.set(reward.stickerId, {
        id: `${reward.stickerId}-${index}`,
        stickerId: reward.stickerId,
        name: reward.name,
        rarity: reward.rarity,
        ownedCount: reward.totalOwned,
        wonCount: 1,
      } satisfies StickerDisplayItem);
    }
    return map;
  }, new Map<StickerId, StickerDisplayItem>());
  return Array.from(groupedRewards.values());
}

export function chunkStickerDisplayItems<T>(items: T[], chunkSize: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    pages.push(items.slice(i, i + chunkSize));
  }
  return pages;
}

export function getVisibleAlbumPagerDots(pageItems: number[], currentPage: number, maxVisible = 7) {
  if (pageItems.length <= maxVisible) return pageItems;
  const halfWindow = Math.floor(maxVisible / 2);
  const maxStart = Math.max(0, pageItems.length - maxVisible);
  const startIndex = Math.min(Math.max(0, currentPage - halfWindow), maxStart);
  return pageItems.slice(startIndex, startIndex + maxVisible);
}
