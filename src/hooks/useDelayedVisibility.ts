import { useEffect, useState } from 'react';

export function useDelayedVisibility(isActive: boolean, delayMs = 2000) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, isActive]);

  return isVisible;
}
