import { useCallback, useEffect, useRef, useState } from 'react';
import type { AudioSourceKey } from '../lib/audio';

type UseRoundTimerOptions = {
  initialSeconds: number;
  isPaused?: boolean;
  isFrozen?: boolean;
  warningAtSeconds?: number;
  playSound?: (key: AudioSourceKey, volume?: number) => void;
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
        if (warningAtSeconds !== undefined && currentSeconds <= warningAtSeconds && currentSeconds > 0) {
          const elapsedWarningSeconds = warningAtSeconds - currentSeconds;
          const volume = Math.min(1, 0.24 + ((elapsedWarningSeconds + 1) / warningAtSeconds) * 0.76);
          playSoundRef.current?.(warningSound, volume);
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
