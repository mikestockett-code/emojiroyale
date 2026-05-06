import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOLDEN_PHOENIX_HOLDER_KEY } from '../constants/gameConstants';

export function useGoldenPhoenixHolder(): string {
  const [holderName, setHolderName] = useState<string>('OPEN');

  useEffect(() => {
    AsyncStorage.getItem(GOLDEN_PHOENIX_HOLDER_KEY).then((val) => {
      setHolderName(val && val.trim() ? val.trim() : 'OPEN');
    });
  }, []);

  return holderName;
}
