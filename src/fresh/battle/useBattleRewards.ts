import { useCallback, useState } from 'react';
import type { StickerId, WinnerInfo } from '../../types';
import type { FreshSoloRewardPreview } from '../../lib/soloRewardRules';
import { buildRoundRewardPreviews, grantRoundRewardPreviews } from '../../lib/sharedRoundRewards';
import type { AlbumPuzzleId, AlbumPuzzlePieceCounts } from '../album/album.types';
import {
  getBattleStageWagerTier,
  isImmediateBattleReward,
  isPendingBattleStickerReward,
  type BattleJourneyStageNumber,
} from './battleRewardRules';
import {
  clearBattleJourneyPendingStickerRewards,
  completeBattleJourneyStage,
} from './useBattleJourneyState';

export type BattleRewardOptions = {
  activeProfileId?: string | null;
  albumPuzzlePieces?: AlbumPuzzlePieceCounts;
  onGrantAlbumSticker?: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;
  onGrantAlbumPuzzlePiece?: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void;
};

type BattleRewardsOptions = {
  cpuId: string;
  stageNumber: BattleJourneyStageNumber;
  rewardOptions: BattleRewardOptions;
};

export function useBattleRewards({ cpuId, stageNumber, rewardOptions }: BattleRewardsOptions) {
  const [rewardPreview, setRewardPreview] = useState<FreshSoloRewardPreview | null>(null);
  const [pendingStickerRewards, setPendingStickerRewards] = useState<FreshSoloRewardPreview[]>([]);

  const grantPlayerRoundRewards = useCallback((
    winner: NonNullable<WinnerInfo>,
    wasRollWin: boolean,
    battleComplete: boolean,
  ) => {
    const rewardPreviews = buildRoundRewardPreviews({
      winner,
      wasRollWin,
      wagerTier: getBattleStageWagerTier(stageNumber),
      albumPuzzlePieces: rewardOptions.albumPuzzlePieces ?? {},
    });

    grantRoundRewardPreviews(rewardPreviews, {
      profileId: rewardOptions.activeProfileId,
      onGrantAlbumSticker: rewardOptions.onGrantAlbumSticker,
      onGrantAlbumPuzzlePiece: rewardOptions.onGrantAlbumPuzzlePiece,
      shouldGrantSticker: isImmediateBattleReward,
      shouldGrantPuzzlePiece: () => false,
    });

    const nextPendingStickerRewards = rewardPreviews.filter(isPendingBattleStickerReward);
    let allPendingStickerRewards: FreshSoloRewardPreview[] = [];
    setPendingStickerRewards((current) => {
      allPendingStickerRewards = [...current, ...nextPendingStickerRewards];
      return allPendingStickerRewards;
    });

    setRewardPreview(rewardPreviews[0] ?? null);

    if (battleComplete) {
      void completeBattleJourneyStage(
        cpuId as 'todd' | 'nico',
        stageNumber,
        allPendingStickerRewards,
        rewardOptions.activeProfileId,
        rewardOptions.onGrantAlbumSticker,
        rewardOptions.onGrantAlbumPuzzlePiece,
      );
    }
  }, [cpuId, rewardOptions, stageNumber]);

  const clearCpuBattleCompleteRewards = useCallback(() => {
    setPendingStickerRewards([]);
    void clearBattleJourneyPendingStickerRewards(rewardOptions.activeProfileId);
  }, [rewardOptions.activeProfileId]);

  const clearRewardPreview = useCallback(() => {
    setRewardPreview(null);
  }, []);

  const resetBattleRewards = useCallback(() => {
    setRewardPreview(null);
    setPendingStickerRewards([]);
  }, []);

  return {
    rewardPreview,
    pendingStickerRewards,
    grantPlayerRoundRewards,
    clearCpuBattleCompleteRewards,
    clearRewardPreview,
    resetBattleRewards,
  };
}
