import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOLDEN_PHOENIX_HOLDER_KEY } from '../constants/gameConstants';

export async function setGoldenPhoenixHolderName(holderName: string) {
  const safeHolderName = holderName.trim();
  if (!safeHolderName) return;
  await AsyncStorage.setItem(GOLDEN_PHOENIX_HOLDER_KEY, safeHolderName);
}

export function useGoldenPhoenixHolder(): string {
  const [holderName, setHolderName] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem(GOLDEN_PHOENIX_HOLDER_KEY).then((val) => {
      setHolderName(val && val.trim() ? val.trim() : 'OPEN');
    });
  }, []);

  return holderName;
}
