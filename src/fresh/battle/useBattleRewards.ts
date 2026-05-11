import { useCallback, useState } from 'react';
import type { StickerId, WinnerInfo } from '../../types';
import type { FreshSoloRewardPreview } from '../../lib/soloRewardRules';
import { buildRoundRewardPreviews, grantRoundRewardPreviews } from '../../lib/sharedRoundRewards';
import { createWizardOfOzRewardPreview, grantWizardOfOzJackpot } from '../../lib/jackpotRewards';
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
  stageNumber: BattleJourneyStageNumber;
  rewardOptions: BattleRewardOptions;
};

export function useBattleRewards({ stageNumber, rewardOptions }: BattleRewardsOptions) {
  const [rewardPreview, setRewardPreview] = useState<FreshSoloRewardPreview | null>(null);
  const [pendingStickerRewards, setPendingStickerRewards] = useState<FreshSoloRewardPreview[]>([]);
  const [isWizardOfOzJackpot, setIsWizardOfOzJackpot] = useState(false);

  const grantPlayerRoundRewards = useCallback((
    winner: NonNullable<WinnerInfo>,
    wasRollWin: boolean,
    battleComplete: boolean,
    isWizardJackpot: boolean,
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

    const jackpotPreview = isWizardJackpot ? createWizardOfOzRewardPreview() : null;
    setRewardPreview(jackpotPreview ?? rewardPreviews[0] ?? null);

    if (isWizardJackpot) {
      setIsWizardOfOzJackpot(true);
      grantWizardOfOzJackpot(rewardOptions.activeProfileId, rewardOptions.onGrantAlbumSticker);
    }

    if (battleComplete) {
      void completeBattleJourneyStage(
        stageNumber,
        allPendingStickerRewards,
        rewardOptions.activeProfileId,
        rewardOptions.onGrantAlbumSticker,
        rewardOptions.onGrantAlbumPuzzlePiece,
      );
    }
  }, [rewardOptions, stageNumber]);

  const clearCpuBattleCompleteRewards = useCallback(() => {
    setPendingStickerRewards([]);
    void clearBattleJourneyPendingStickerRewards();
  }, []);

  const clearRewardPreview = useCallback(() => {
    setRewardPreview(null);
    setIsWizardOfOzJackpot(false);
  }, []);

  const resetBattleRewards = useCallback(() => {
    setRewardPreview(null);
    setPendingStickerRewards([]);
    setIsWizardOfOzJackpot(false);
  }, []);

  return {
    rewardPreview,
    pendingStickerRewards,
    isWizardOfOzJackpot,
    grantPlayerRoundRewards,
    clearCpuBattleCompleteRewards,
    clearRewardPreview,
    resetBattleRewards,
  };
}

