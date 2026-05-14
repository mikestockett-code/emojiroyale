import React from 'react';
import { EPI_CONFIG } from './epiConfig';
import { EPI_CARD_SIZE } from './powerCardStyles';
import { PowerSection } from './PowerSection';
import type { PowerSelectionSectionProps } from './types';

export function EPISection({ slot1, slot2, albumCounts, onAssignSlot }: PowerSelectionSectionProps) {
  return (
    <PowerSection
      title="EMOJI POWER"
      subtitle="Use as many as you own each round"
      rows={[{ cards: EPI_CONFIG }]}
      slot1={slot1}
      slot2={slot2}
      albumCounts={albumCounts}
      onAssignSlot={onAssignSlot}
      headerMarginTop={16}
      cardSize={EPI_CARD_SIZE}
    />
  );
}
