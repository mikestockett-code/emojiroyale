import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StickerTile } from '../../../components/game/StickerTile';
import { theme } from '../luxuryTheme';
import type { StickerId } from '../../../types';
import type { ImageSourcePropType } from 'react-native';

const KIND_LABEL: Record<string, string> = {
  common: 'COMMON',
  epic: 'EPIC',
  legendary: 'LEGENDARY',
  power: 'EMOJI POWER',
  powerPlus: 'EMOJI POWER+',
  platinum: 'PLATINUM',
  easterEgg: 'EASTER EGG',
  puzzlePiece: 'PUZZLE PIECE',
};

type Props = {
  stickerId: StickerId | null;
  count: number;
  label: string;
  kind?: string;
  imageSource?: ImageSourcePropType;
  ring: string;
  shadowColor: string;
};

export function RewardTrophy({ stickerId, count, label, kind, imageSource, ring, shadowColor }: Props) {
  const rarityLabel = kind ? (KIND_LABEL[kind] ?? kind.toUpperCase()) : null;
  return (
    <LinearGradient
      colors={[theme.gold, ring, theme.darkGold]}
      style={[styles.outer, { shadowColor }]}
    >
      <LinearGradient colors={['#18090a', theme.warmBrown]} style={styles.inner}>
        <Text style={styles.youWon}>YOU WON</Text>
        <View style={[styles.disc, { borderColor: ring, shadowColor }]}>
          {imageSource ? (
            <Image source={imageSource} style={styles.rewardImage} resizeMode="contain" />
          ) : stickerId ? (
            <StickerTile stickerId={stickerId} backgroundColor="#f4ecd5" size="large" />
          ) : null}
        </View>
        <Text style={styles.name}>
          {label}{count > 1 ? ` ×${count}` : ''}
        </Text>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>{rarityLabel ?? 'NEW STICKER'}</Text>
        </View>
      </LinearGradient>
    </LinearGradient>
  );
}

export function CornerDots() {
  return (
    <>
      <View style={[styles.cornerDot, { top: 10, left: 10 }]} />
      <View style={[styles.cornerDot, { top: 10, right: 10 }]} />
      <View style={[styles.cornerDot, { bottom: 10, left: 10 }]} />
      <View style={[styles.cornerDot, { bottom: 10, right: 10 }]} />
    </>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 12,
    padding: 2,
    shadowOpacity: 0.7,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  rewardImage: {
    width: 70,
    height: 70,
  },
  inner: {
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  youWon: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.gold,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  disc: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#f4ecd5',
    borderWidth: 3,
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: theme.gold,
    textShadowColor: theme.ringShadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
    textAlign: 'center',
  },
  newBadge: {
    backgroundColor: theme.gold,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: theme.gold,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: theme.deepBrown,
  },
  cornerDot: {
    position: 'absolute',
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: '#c98c1a',
    shadowColor: theme.gold,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
