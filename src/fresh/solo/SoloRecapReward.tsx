import React from 'react';
import { Image, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import type { StickerId } from '../../types';
import { soloRecapStyles as styles } from './soloRecapStyles';

type Props = {
  rewardStickerId?: StickerId | null;
  rewardStickerCount?: number;
  rewardStickerLabel?: string;
  rewardImageSource?: ImageSourcePropType;
};

export function SoloRecapReward({
  rewardStickerId,
  rewardStickerCount = 0,
  rewardStickerLabel = '',
  rewardImageSource,
}: Props) {
  if (!(rewardStickerId || rewardImageSource) || !rewardStickerLabel) return null;

  return (
    <View style={styles.rewardRow}>
      <Text style={styles.rewardLabel}>WON THIS ROUND</Text>
      {rewardImageSource ? <Image source={rewardImageSource} style={styles.rewardImage} resizeMode="contain" /> : null}
      <Text style={styles.rewardName}>
        {rewardStickerLabel}{rewardStickerCount > 1 ? ` x${rewardStickerCount}` : ''}
      </Text>
    </View>
  );
}
