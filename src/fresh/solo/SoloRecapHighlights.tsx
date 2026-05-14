import React from 'react';
import { Text, View } from 'react-native';
import type { AlbumStickerDefinition } from '../album/album.types';
import { luxuryResultStyles as styles } from '../shared/luxuryResultStyles';

type Props = {
  highlights: Array<{ sticker: AlbumStickerDefinition; count: number }>;
};

export function SoloRecapHighlights({ highlights }: Props) {
  if (highlights.length === 0) return null;

  return (
    <View style={styles.highlightsCard}>
      <Text style={styles.highlightsLabel}>TOP EMOJI STICKERS</Text>
      <View style={styles.highlightsRow}>
        {highlights.map(({ sticker, count }) => (
          <View key={sticker.id} style={styles.highlightTile}>
            <View style={[styles.highlightDisc, styles[`disc_${sticker.scarcityId}`]]}>
              <Text style={styles.highlightEmoji}>{sticker.emoji}</Text>
            </View>
            <Text style={styles.highlightName} numberOfLines={2}>{sticker.name}</Text>
            <Text style={styles.highlightCount}>x{count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
