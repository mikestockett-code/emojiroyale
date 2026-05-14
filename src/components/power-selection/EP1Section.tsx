import React from 'react';
import { useWindowDimensions } from 'react-native';
import { EP1_CONFIG } from './ep1Config';
import { PowerSection } from './PowerSection';
import type { PowerSelectionSectionProps } from './types';

export function EP1Section({ slot1, slot2, albumCounts, onAssignSlot }: PowerSelectionSectionProps) {
  const { height } = useWindowDimensions();

  return (
    <PowerSection
      title="EMOJI POWER +"
      subtitle="Once per round"
      rows={[
        { cards: EP1_CONFIG.slice(0, 3) },
        { cards: EP1_CONFIG.slice(3, 6), marginTop: height * 0.05 },
      ]}
      slot1={slot1}
      slot2={slot2}
      albumCounts={albumCounts}
      onAssignSlot={onAssignSlot}
    />
  );
}
