import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { CARD_SIZE, cardStyles } from './powerCardStyles';
import { useAudioContext } from '../../fresh/audio/AudioContext';

type SlotBadgeProps = {
  inSlot: boolean;
  slotFree: boolean;
  side: 'left' | 'right';
  onPress: () => void;
};

function SlotBadge({ inSlot, slotFree, side, onPress }: SlotBadgeProps) {
  const { playSound } = useAudioContext();
  const canInteract = inSlot || slotFree;
  return (
    <Pressable
      onPress={() => {
        if (!canInteract) return;
        playSound('button');
        onPress();
      }}
      style={({ pressed }) => [
        cardStyles.badge,
        side === 'left' ? cardStyles.badgeLeft : cardStyles.badgeRight,
        inSlot ? cardStyles.badgeRemove : cardStyles.badgeAdd,
        !canInteract && cardStyles.badgeDim,
        pressed && canInteract && { opacity: 0.75 },
      ]}
      hitSlop={8}
    >
      <Text style={cardStyles.badgeText}>{inSlot ? '−' : '+'}</Text>
    </Pressable>
  );
}

type Props = {
  imageSource: any;
  label: string;
  isInSlot1: boolean;
  isInSlot2: boolean;
  slot1Free: boolean;
  slot2Free: boolean;
  isOwned: boolean;
  onPressLeft: () => void;
  onPressRight: () => void;
  cardSize?: number;
};

export function PowerCard({
  imageSource,
  label,
  isInSlot1,
  isInSlot2,
  slot1Free,
  slot2Free,
  isOwned,
  onPressLeft,
  onPressRight,
  cardSize = CARD_SIZE,
}: Props) {
  return (
    <View pointerEvents={isOwned ? 'auto' : 'none'} style={[cardStyles.wrapper, !isOwned && cardStyles.dimmed]}>
      <View style={[cardStyles.card, { width: cardSize, height: cardSize * 0.75 }]}>
        <Image source={imageSource} style={cardStyles.img} resizeMode="contain" />
        <SlotBadge inSlot={isInSlot1} slotFree={slot1Free} side="left"  onPress={onPressLeft} />
        <SlotBadge inSlot={isInSlot2} slotFree={slot2Free} side="right" onPress={onPressRight} />
      </View>
      <Text style={cardStyles.cardLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}
