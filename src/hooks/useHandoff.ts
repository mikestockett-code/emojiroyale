import { useCallback, useEffect, useRef, useState } from 'react';

export function useHandoff() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHandoffVisible, setIsHandoffVisible] = useState(false);

  const clearHandoffTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const scheduleHandoff = useCallback((delayMs: number) => {
    clearHandoffTimer();
    timerRef.current = setTimeout(() => {
      setIsHandoffVisible(true);
      timerRef.current = null;
    }, delayMs);
  }, [clearHandoffTimer]);

  const hideHandoff = useCallback(() => {
    clearHandoffTimer();
    setIsHandoffVisible(false);
  }, [clearHandoffTimer]);

  useEffect(() => clearHandoffTimer, [clearHandoffTimer]);

  return {
    isHandoffVisible,
    scheduleHandoff,
    hideHandoff,
    clearHandoffTimer,
  };
}
