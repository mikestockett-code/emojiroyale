import React from 'react';
import { Text, View } from 'react-native';
import type { BattlePowerId } from '../../types';
import { PowerCard } from './PowerCard';
import type { PowerConfig } from './ep1Config';
import { cardStyles } from './powerCardStyles';

// Testing mode: keep all power cards selectable until album-based unlock rules are final.
const UNLOCK_ALL_POWERS_FOR_TESTING = true;

type PowerSectionRow = {
  cards: PowerConfig[];
  marginTop?: number;
};

type Props = {
  title: string;
  subtitle: string;
  rows: PowerSectionRow[];
  slot1: BattlePowerId | null;
  slot2: BattlePowerId | null;
  albumCounts?: Record<string, number>;
  onAssignSlot: (slotId: 'slot1' | 'slot2', id: BattlePowerId | null) => void;
  headerMarginTop?: number;
  cardSize?: number;
};

export function PowerSection({
  title,
  subtitle,
  rows,
  slot1,
  slot2,
  albumCounts,
  onAssignSlot,
  headerMarginTop,
  cardSize,
}: Props) {
  const isOwned = (id: BattlePowerId) => (
    UNLOCK_ALL_POWERS_FOR_TESTING || (albumCounts ? (albumCounts[id] ?? 0) > 0 : true)
  );

  return (
    <>
      <View style={[cardStyles.sectionHead, headerMarginTop ? { marginTop: headerMarginTop } : null]}>
        <Text style={cardStyles.sectionLabel}>{title}</Text>
        <Text style={cardStyles.sectionSub}>{subtitle}</Text>
      </View>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[cardStyles.cardRow, row.marginTop ? { marginTop: row.marginTop } : null]}
        >
          {row.cards.map((power) => {
            const id = power.powerId;
            const isInSlot1 = slot1 === id;
            const isInSlot2 = slot2 === id;
            return (
              <PowerCard
                key={id}
                imageSource={power.imageSource}
                label={power.label}
                isInSlot1={isInSlot1}
                isInSlot2={isInSlot2}
                slot1Free={slot1 === null}
                slot2Free={slot2 === null}
                isOwned={isOwned(id)}
                onPressLeft={() => {
                  if (isInSlot1) onAssignSlot('slot1', null);
                  else if (slot1 === null) onAssignSlot('slot1', id);
                }}
                onPressRight={() => {
                  if (isInSlot2) onAssignSlot('slot2', null);
                  else if (slot2 === null) onAssignSlot('slot2', id);
                }}
                cardSize={cardSize}
              />
            );
          })}
        </View>
      ))}
    </>
  );
}
