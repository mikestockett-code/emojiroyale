import { useCallback, useState } from 'react';
import type { WinnerInfo } from '../../types';
import {
  getSoloRewardPreview,
  getSoloScoreForWinner,
  mapWinnerToSoloRewardWinType,
  type FreshSoloRewardPreview,
} from '../../lib/soloRewardRules';
import type { FreshSoloSetup } from '../../fresh/solo/soloSetup.types';
import type { SoloGameStateOptions } from './soloGameStateTypes';

type SoloRewardsOptions = SoloGameStateOptions & {
  soloSetup: FreshSoloSetup;
};

export function useSoloRewards({
  activeProfileId,
  albumPuzzlePieces = {},
  soloSetup,
  onGrantAlbumSticker,
  onGrantAlbumPuzzlePiece,
}: SoloRewardsOptions) {
  const [rewardPreview, setRewardPreview] = useState<FreshSoloRewardPreview | null>(null);
  const [currentScore, setCurrentScore] = useState(0);

  const grantPlayerWinReward = useCallback((winner: NonNullable<WinnerInfo>, wasRollWin: boolean) => {
    setCurrentScore((score) => score + getSoloScoreForWinner(winner, wasRollWin));

    const nextRewardPreview = getSoloRewardPreview(
      mapWinnerToSoloRewardWinType(winner, wasRollWin),
      soloSetup.wager.tier,
      false,
      albumPuzzlePieces,
    );

    if (nextRewardPreview?.kind === 'puzzlePiece' && nextRewardPreview.puzzleId && nextRewardPreview.puzzlePieceId) {
      onGrantAlbumPuzzlePiece(activeProfileId, nextRewardPreview.puzzleId, nextRewardPreview.puzzlePieceId, 1);
    } else if (nextRewardPreview?.stickerId) {
      onGrantAlbumSticker(activeProfileId, nextRewardPreview.stickerId, nextRewardPreview.count);
    }

    setRewardPreview(nextRewardPreview);
    return nextRewardPreview;
  }, [
    activeProfileId,
    albumPuzzlePieces,
    onGrantAlbumPuzzlePiece,
    onGrantAlbumSticker,
    soloSetup.wager.tier,
  ]);

  const clearRewardPreview = useCallback(() => {
    setRewardPreview(null);
  }, []);

  const resetRewards = useCallback(() => {
    setRewardPreview(null);
    setCurrentScore(0);
  }, []);

  return {
    rewardPreview,
    currentScore,
    grantPlayerWinReward,
    clearRewardPreview,
    resetRewards,
  };
}
