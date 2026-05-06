import React from 'react';
import { Text, View } from 'react-native';
import type { BattlePowerId } from '../../types';
import { PowerCard } from './PowerCard';
import type { PowerConfig } from './ep1Config';
import { cardStyles } from './powerCardStyles';

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
  onSelect: (id: BattlePowerId) => void;
  onRemove: (id: BattlePowerId) => void;
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
  onSelect,
  onRemove,
  headerMarginTop,
  cardSize,
}: Props) {
  const bothFull = slot1 !== null && slot2 !== null;
  const isSelected = (id: BattlePowerId) => slot1 === id || slot2 === id;
  const isOwned = (id: BattlePowerId) => (albumCounts ? (albumCounts[id] ?? 0) > 0 : true);

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
          {row.cards.map((power) => (
            <PowerCard
              key={power.powerId}
              imageSource={power.imageSource}
              label={power.label}
              isSelected={isSelected(power.powerId)}
              isOwned={isOwned(power.powerId)}
              canAdd={!bothFull}
              onSelect={() => onSelect(power.powerId)}
              onRemove={() => onRemove(power.powerId)}
              cardSize={cardSize}
            />
          ))}
        </View>
      ))}
    </>
  );
}
