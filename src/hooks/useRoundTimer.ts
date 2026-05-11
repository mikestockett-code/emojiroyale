import { useCallback, useEffect, useRef, useState } from 'react';
import type { AudioSourceKey } from '../lib/audio';

type UseRoundTimerOptions = {
  initialSeconds: number;
  isPaused?: boolean;
  isFrozen?: boolean;
  warningAtSeconds?: number;
  playSound?: (key: AudioSourceKey) => void;
  warningSound?: AudioSourceKey;
  onExpire?: () => void;
};

export function useRoundTimer({
  initialSeconds,
  isPaused = false,
  isFrozen = false,
  warningAtSeconds,
  playSound,
  warningSound = 'timer',
  onExpire,
}: UseRoundTimerOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const warningFiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const playSoundRef = useRef(playSound);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    playSoundRef.current = playSound;
  }, [playSound]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (isFrozen) return;

      setSeconds((currentSeconds) => {
        if (warningAtSeconds !== undefined && currentSeconds === warningAtSeconds + 1 && !warningFiredRef.current) {
          warningFiredRef.current = true;
          playSoundRef.current?.(warningSound);
        }

        if (currentSeconds <= 1) {
          clearInterval(timer);
          onExpireRef.current?.();
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFrozen, isPaused, warningAtSeconds, warningSound]);

  const resetTimer = useCallback((nextSeconds = initialSeconds) => {
    warningFiredRef.current = false;
    setSeconds(nextSeconds);
  }, [initialSeconds]);

  const addSeconds = useCallback((amount: number) => {
    setSeconds((currentSeconds) => Math.max(0, currentSeconds + amount));
  }, []);

  return {
    seconds,
    resetTimer,
    setSeconds,
    addSeconds,
  };
}
