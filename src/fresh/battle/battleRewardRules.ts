import type { SoloWagerTier } from '../../types';
import type { FreshSoloRewardKind, FreshSoloRewardPreview } from '../../lib/soloRewardRules';

export type BattleJourneyStageNumber = 1 | 2 | 3;

const STAGE_WAGER_TIERS: Record<BattleJourneyStageNumber, SoloWagerTier> = {
  1: 'skip',
  2: 'epicLite',
  3: 'epic',
};

const IMMEDIATE_REWARD_KINDS = new Set<FreshSoloRewardKind>(['power', 'powerPlus', 'puzzlePiece']);

export function getBattleStageWagerTier(stageNumber: BattleJourneyStageNumber): SoloWagerTier {
  return STAGE_WAGER_TIERS[stageNumber] ?? 'skip';
}

export function isImmediateBattleReward(preview: FreshSoloRewardPreview) {
  return IMMEDIATE_REWARD_KINDS.has(preview.kind);
}

export function isPendingBattleStickerReward(preview: FreshSoloRewardPreview) {
  return !isImmediateBattleReward(preview) && Boolean(preview.stickerId);
}
