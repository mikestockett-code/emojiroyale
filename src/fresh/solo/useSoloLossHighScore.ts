import { useEffect, useRef } from 'react';

type Options = {
  activeProfileId?: string | null;
  currentScore: number;
  isLoss: boolean;
  soloRoundNumber: number;
  onUpdateSoloHighScore: (profileId: string | null | undefined, score: number) => void;
};

export function useSoloLossHighScore({
  activeProfileId,
  currentScore,
  isLoss,
  soloRoundNumber,
  onUpdateSoloHighScore,
}: Options) {
  const savedLossScoreKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoss || currentScore <= 0) {
      savedLossScoreKeyRef.current = null;
      return;
    }

    const scoreKey = `${activeProfileId ?? 'no-profile'}:${soloRoundNumber}:${currentScore}`;
    if (savedLossScoreKeyRef.current === scoreKey) return;

    savedLossScoreKeyRef.current = scoreKey;
    onUpdateSoloHighScore(activeProfileId ?? null, currentScore);
  }, [activeProfileId, currentScore, isLoss, onUpdateSoloHighScore, soloRoundNumber]);
}

