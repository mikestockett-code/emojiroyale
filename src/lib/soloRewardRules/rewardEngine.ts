import type { SoloWagerTier } from '../../types';
import type { FreshSoloReward, FreshSoloRewardKind, FreshSoloRewardWinType } from './types';

export function getSoloRewards(
  winType: FreshSoloRewardWinType,
  wagerTier: SoloWagerTier = 'skip',
  hasGoldAlbum = false,
): FreshSoloReward[] {
  const rewards: FreshSoloReward[] = [];

  switch (winType) {
    case 'common':
      rewards.push({ kind: 'common', count: 1 });
      break;

    case 'commonRoll':
      rewards.push({ kind: 'common', count: 1 });
      rewards.push(getRandomReward(['common', 'epic', 'legendary', 'power'], [80, 10, 5, 5]));
      break;

    case 'epic':
      rewards.push({ kind: 'epic', count: 1 });
      rewards.push(getRandomReward(['epic', 'legendary', 'power', 'powerPlus'], [80, 10, 5, 5]));
      break;

    case 'epicRoll':
      rewards.push({ kind: 'epic', count: 1 });
      rewards.push(getRandomReward(['epic', 'legendary', 'power', 'powerPlus'], [65, 15, 10, 10]));
      rewards.push(getRandomReward(['epic', 'legendary', 'power', 'powerPlus'], [65, 15, 10, 10]));
      break;

    case 'legendary':
      rewards.push({ kind: 'legendary', count: 1 });
      rewards.push(getLegendaryBonusReward(hasGoldAlbum));
      break;

    case 'legendaryRoll':
      rewards.push({ kind: 'legendary', count: 1 });
      rewards.push(getRandomReward(['legendary', 'platinum', 'power', 'powerPlus'], [60, 20, 10, 10], hasGoldAlbum));
      rewards.push(getRandomReward(['legendary', 'platinum', 'power', 'powerPlus'], [60, 20, 10, 10], hasGoldAlbum));
      break;
  }

  if (wagerTier === 'epicLite' || wagerTier === 'epic') {
    rewards.push({ kind: mapWinTypeToRewardKind(winType), count: 1 });
  }

  return mergeRewards(rewards);
}

function mapWinTypeToRewardKind(winType: FreshSoloRewardWinType): FreshSoloRewardKind {
  if (winType.includes('legendary')) return 'legendary';
  if (winType === 'epic') return 'epic';
  return 'common';
}

function getRandomReward(
  kinds: FreshSoloRewardKind[],
  weights: number[],
  hasGoldAlbum = false,
): FreshSoloReward {
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  let roll = Math.random() * totalWeight;

  for (let i = 0; i < kinds.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      const kind = kinds[i];
      if (kind === 'platinum' && !hasGoldAlbum) {
        return { kind: Math.random() < 0.5 ? 'power' : 'powerPlus', count: 1 };
      }
      return { kind, count: 1 };
    }
  }
  return { kind: 'common', count: 1 };
}

function getLegendaryBonusReward(hasGoldAlbum: boolean): FreshSoloReward {
  const roll = Math.random() * 100;
  if (roll < 70) {
    return { kind: 'legendary', count: 1 };
  }

  const subRoll = Math.random() * 30;
  if (subRoll < 10) {
    return hasGoldAlbum
      ? { kind: 'platinum', count: 1 }
      : { kind: Math.random() < 0.5 ? 'power' : 'powerPlus', count: 1 };
  }
  if (subRoll < 20) {
    return { kind: 'power', count: 1 };
  }
  return { kind: 'powerPlus', count: 1 };
}

function mergeRewards(rewards: FreshSoloReward[]): FreshSoloReward[] {
  const merged = new Map<FreshSoloRewardKind, FreshSoloReward>();

  for (const reward of rewards) {
    const existing = merged.get(reward.kind);
    if (existing) {
      existing.count += reward.count;
    } else {
      merged.set(reward.kind, { ...reward });
    }
  }

  return Array.from(merged.values());
}
