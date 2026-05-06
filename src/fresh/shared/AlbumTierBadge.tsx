import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AlbumEraId } from '../album/album.types';

const TIER_COLOR: Record<AlbumEraId, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e8e6e0',
  diamond: '#7df9ff',
};

type Props = {
  eraId: AlbumEraId;
  uniqueCollected: number;
  totalUniqueStickers: number;
  percentComplete: number;
  compact?: boolean;
};

export function AlbumTierBadge({
  eraId,
  uniqueCollected,
  totalUniqueStickers,
  percentComplete,
  compact = false,
}: Props) {
  const color = TIER_COLOR[eraId];
  const label = eraId.charAt(0).toUpperCase() + eraId.slice(1);

  if (compact) {
    return (
      <View style={[styles.compact, { borderColor: color }]}>
        <Text style={styles.compactCounts}>{uniqueCollected}/{totalUniqueStickers}</Text>
        <Text style={styles.compactPct}>{percentComplete}%</Text>
      </View>
    );
  }

  const fillPct = Math.max(0, Math.min(100, percentComplete));

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <View style={styles.header}>
        <Text style={[styles.tierLabel, { color }]}>{label.toUpperCase()}</Text>
        <Text style={styles.counts}>
          {uniqueCollected} / {totalUniqueStickers} collected
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fillPct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.pctText, { color }]}>{percentComplete}% complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(26,10,6,0.92)',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  counts: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  pctText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'right',
    opacity: 0.8,
  },

  // Compact mode for shelf overlay
  compact: {
    paddingHorizontal: 2,
    paddingVertical: 0,
    alignItems: 'center',
  },
  compactCounts: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  compactPct: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
