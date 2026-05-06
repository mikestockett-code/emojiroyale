import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEEN_KEY = '@battle_mode_explanation_seen';

export function useBattleModeSelect() {
  const [selectedMode,    setSelectedMode]    = useState('epicDuel');
  const [showExplanation, setShowExplanation] = useState(false);
  const [neverShow,       setNeverShow]       = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY).then((val) => {
      if (!val) setShowExplanation(true);
    });
  }, []);

  const handleDismiss = async () => {
    if (neverShow) await AsyncStorage.setItem(SEEN_KEY, 'true');
    setShowExplanation(false);
  };

  const toggleNeverShow = () => setNeverShow(v => !v);

  return {
    selectedMode,
    setSelectedMode,
    showExplanation,
    neverShow,
    toggleNeverShow,
    handleDismiss,
  };
}
