import { useCallback, useEffect, useRef, useState } from 'react';

type SoloWinnerType = 'win' | 'epic' | 'legendary' | null;

export function useSoloResultOverlay() {
  const [winnerTitle, setWinnerTitle] = useState<string | null>(null);
  const [winnerType, setWinnerType] = useState<SoloWinnerType>(null);
  const [winningLineIndices, setWinningLineIndices] = useState<number[]>([]);
  const [isResultOverlayVisible, setIsResultOverlayVisible] = useState(false);
  const resultOverlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResultOverlayTimer = useCallback(() => {
    if (resultOverlayTimerRef.current) {
      clearTimeout(resultOverlayTimerRef.current);
      resultOverlayTimerRef.current = null;
    }
  }, []);

  const scheduleResultOverlay = useCallback(() => {
    clearResultOverlayTimer();
    setIsResultOverlayVisible(false);
    resultOverlayTimerRef.current = setTimeout(() => {
      setIsResultOverlayVisible(true);
      resultOverlayTimerRef.current = null;
    }, 2000);
  }, [clearResultOverlayTimer]);

  const showRoundResult = useCallback((title: string, type: SoloWinnerType, lineIndices: number[]) => {
    setWinnerTitle(title);
    setWinnerType(type);
    setWinningLineIndices(lineIndices);
    scheduleResultOverlay();
  }, [scheduleResultOverlay]);

  const resetRoundResult = useCallback(() => {
    clearResultOverlayTimer();
    setWinnerTitle(null);
    setWinnerType(null);
    setWinningLineIndices([]);
    setIsResultOverlayVisible(false);
  }, [clearResultOverlayTimer]);

  useEffect(() => clearResultOverlayTimer, [clearResultOverlayTimer]);

  return {
    winnerTitle,
    winnerType,
    winningLineIndices,
    isResultOverlayVisible,
    showRoundResult,
    resetRoundResult,
  };
}
