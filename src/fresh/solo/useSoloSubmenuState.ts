import { useMemo, useState } from 'react';
import type { SoloModeId } from '../../types';
import type { FreshProfile } from '../profile/types';
import { getFreshSoloModeAvailability, getFreshSoloStartMessage } from './soloSubmenuValidation';
import { createFreshSoloSetup } from './soloWagerFactory';

const SUPPORTED_SOLO_MODES: SoloModeId[] = ['practice', 'epicLite', 'epic'];

export function useSoloSubmenuState(activeProfile: FreshProfile | null) {
  const [selectedMode, setSelectedMode] = useState<SoloModeId>('practice');

  const modeAvailability = useMemo(() => {
    return Object.fromEntries(
      SUPPORTED_SOLO_MODES.map((modeId) => [modeId, getFreshSoloModeAvailability(activeProfile, modeId)]),
    ) as Partial<Record<SoloModeId, ReturnType<typeof getFreshSoloModeAvailability>>>;
  }, [activeProfile]);

  const selectedAvailability = modeAvailability[selectedMode] ?? modeAvailability.practice;

  return {
    selectedMode,
    selectableModeIds: SUPPORTED_SOLO_MODES,
    modeAvailability,
    canStart: selectedAvailability?.isSelectable ?? false,
    startMessage: getFreshSoloStartMessage(selectedAvailability),
    handleSelectMode: (modeId: SoloModeId) => {
      setSelectedMode(modeId);
    },
    buildSoloSetup: () => {
      if (!selectedAvailability?.isSelectable) return null;
      return createFreshSoloSetup(selectedMode);
    },
  };
}
