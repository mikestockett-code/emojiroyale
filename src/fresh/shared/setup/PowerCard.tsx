import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useAudioContext } from '../../audio/AudioContext';
import { CARD_SIZE, styles } from './ModePowerSetupScreen.styles';

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
        styles.powerBadge,
        side === 'left' ? styles.powerBadgeLeft : styles.powerBadgeRight,
        inSlot ? styles.powerBadgeRemove : styles.powerBadgeAdd,
        !canInteract && styles.powerBadgeDim,
        pressed && canInteract && styles.powerBadgePressed,
      ]}
      hitSlop={8}
    >
      <Text style={styles.powerBadgeText}>{inSlot ? '−' : '+'}</Text>
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
    <View pointerEvents={isOwned ? 'auto' : 'none'} style={[styles.powerCardWrapper, !isOwned && styles.powerCardDimmed]}>
      <View style={[styles.powerCard, { width: cardSize, height: cardSize * 0.75 }]}>
        <Image source={imageSource} style={styles.powerCardImage} resizeMode="contain" />
        <SlotBadge inSlot={isInSlot1} slotFree={slot1Free} side="left" onPress={onPressLeft} />
        <SlotBadge inSlot={isInSlot2} slotFree={slot2Free} side="right" onPress={onPressRight} />
      </View>
      <Text style={styles.powerCardLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}
