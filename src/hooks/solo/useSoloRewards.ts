import { useCallback, useState } from 'react';
import type { WinnerInfo } from '../../types';
import {
  getSoloRewardPreviews,
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
  const [runRewardPreviews, setRunRewardPreviews] = useState<FreshSoloRewardPreview[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

  const grantPlayerWinReward = useCallback((
    winner: NonNullable<WinnerInfo>,
    wasRollWin: boolean,
    wasTornadoWin = false,
  ) => {
    setCurrentScore((score) => score + getSoloScoreForWinner(winner, wasRollWin, wasTornadoWin));

    const nextRewardPreviews = getSoloRewardPreviews(
      mapWinnerToSoloRewardWinType(winner, wasRollWin),
      soloSetup.wager.tier,
      false,
      albumPuzzlePieces,
    );
    const nextRewardPreview = nextRewardPreviews[0] ?? null;

    for (const preview of nextRewardPreviews) {
      if (preview.kind === 'puzzlePiece' && preview.puzzleId && preview.puzzlePieceId) {
        onGrantAlbumPuzzlePiece(activeProfileId, preview.puzzleId, preview.puzzlePieceId, 1);
      } else if (preview.stickerId) {
        onGrantAlbumSticker(activeProfileId, preview.stickerId, preview.count);
      }
    }
    setRunRewardPreviews((previews) => [
      ...previews,
      ...nextRewardPreviews,
    ]);
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
    setRunRewardPreviews([]);
    setCurrentScore(0);
  }, []);

  return {
    rewardPreview,
    runRewardPreviews,
    currentScore,
    grantPlayerWinReward,
    clearRewardPreview,
    resetRewards,
  };
}
