import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { CARD_SIZE, cardStyles } from './powerCardStyles';
import { useAudioContext } from '../../fresh/audio/AudioContext';

type Props = {
  imageSource: any;
  label: string;
  isSelected: boolean;
  isOwned: boolean;
  canAdd: boolean;
  onSelect: () => void;
  onRemove: () => void;
  cardSize?: number;
};

export function PowerCard({ imageSource, label, isSelected, isOwned, canAdd, onSelect, onRemove, cardSize = CARD_SIZE }: Props) {
  const { playSound } = useAudioContext();

  return (
    <View pointerEvents={isOwned ? 'auto' : 'none'} style={[cardStyles.wrapper, !isOwned && cardStyles.dimmed]}>
      <View style={[cardStyles.card, { width: cardSize, height: cardSize * 0.75 }]}>
        <Image source={imageSource} style={cardStyles.img} resizeMode="contain" />
        <Pressable
          onPress={() => {
            playSound('button');
            if (isSelected) {
              onRemove();
              return;
            }
            onSelect();
          }}
          style={({ pressed }) => [
            cardStyles.badge,
            isSelected ? cardStyles.badgeRemove : cardStyles.badgeAdd,
            !isSelected && !canAdd && cardStyles.badgeDim,
            pressed && { opacity: 0.75 },
          ]}
          hitSlop={8}
        >
          <Text style={cardStyles.badgeText}>{isSelected ? '−' : '+'}</Text>
        </Pressable>
      </View>
      <Text style={cardStyles.cardLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}
