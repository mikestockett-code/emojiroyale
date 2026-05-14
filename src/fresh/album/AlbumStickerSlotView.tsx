import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import styles from './albumStyles';
import type { AlbumStickerSlot } from './album.types';

type Props = {
  slot: AlbumStickerSlot;
};

const RARITY_COLORS: Record<string, string> = {
  common: '#999',
  rare: '#f5a623',
  extremelyRare: '#b06afc',
};

export function AlbumStickerSlotView({ slot }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (slot.collected && slot.scarcityId !== 'common') {
      const duration = slot.scarcityId === 'extremelyRare' ? 650 : 1100;
      const peak = slot.scarcityId === 'extremelyRare' ? 1.14 : 1.06;
      scale.value = withRepeat(
        withSequence(
          withTiming(peak, { duration }),
          withTiming(1, { duration }),
        ),
        -1,
      );
    } else {
      cancelAnimation(scale);
      scale.value = 1;
    }
    return () => cancelAnimation(scale);
  }, [slot.collected, slot.scarcityId, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotColor = RARITY_COLORS[slot.scarcityId] ?? '#999';

  return (
    <View style={styles.albumEmojiSlot}>
      <Animated.Text
        style={[
          styles.albumEmoji,
          animStyle,
          !slot.collected && { opacity: 0.13 },
        ]}
      >
        {slot.emoji}
      </Animated.Text>
      <View style={[styles.rarityDot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.stickerName,
          !slot.collected && styles.stickerNameHidden,
        ]}
        numberOfLines={1}
      >
        {slot.collected ? slot.name : '???'}
      </Text>
    </View>
  );
}
