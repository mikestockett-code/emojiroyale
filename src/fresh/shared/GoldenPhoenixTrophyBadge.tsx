import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useGoldenPhoenixHolder } from '../../hooks/useGoldenPhoenixHolder';

const TROPHY_IMAGE = require('../../../assets/images/trophy.png');

type Props = {
  size?: 'home' | 'shelf';
  style?: StyleProp<ViewStyle>;
  holderName?: string | null;
};

export function GoldenPhoenixTrophyBadge({ size = 'home', style, holderName }: Props) {
  const storedHolderName = useGoldenPhoenixHolder();
  const displayName = holderName || storedHolderName || 'OPEN';
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.34 + pulse.value * 0.34,
    transform: [{ scale: 0.9 + pulse.value * 0.22 }],
  }));

  const isShelf = size === 'shelf';

  return (
    <View pointerEvents="none" style={[styles.root, isShelf ? styles.shelfRoot : styles.homeRoot, style]}>
      <Reanimated.View style={[styles.glow, isShelf ? styles.shelfGlow : styles.homeGlow, glowStyle]} />
      <Image source={TROPHY_IMAGE} resizeMode="contain" style={isShelf ? styles.shelfTrophy : styles.homeTrophy} />
      <View style={[styles.namePlate, isShelf ? styles.shelfNamePlate : styles.homeNamePlate]}>
        <Text style={[styles.kicker, isShelf && styles.shelfKicker]}>{isShelf ? 'GOLDEN PHOENIX' : 'GOLDEN\nPHOENIX'}</Text>
        <Text style={[styles.holder, isShelf && styles.shelfHolder]} numberOfLines={1}>
          {displayName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  homeRoot: {
    top: '5%' as any,
    right: 0,
    width: 82,
  },
  shelfRoot: {
    width: 120,
  },
  glow: {
    position: 'absolute',
    zIndex: 0,
    backgroundColor: '#ffd86b',
    shadowColor: '#ffd86b',
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  homeGlow: {
    top: 3,
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  shelfGlow: {
    top: 2,
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  homeTrophy: {
    width: 66,
    height: 66,
    zIndex: 1,
  },
  shelfTrophy: {
    width: 60,
    height: 60,
    zIndex: 1,
  },
  namePlate: {
    alignItems: 'center',
    zIndex: 3,
  },
  homeNamePlate: {
    marginTop: -1,
    paddingHorizontal: 2,
    paddingVertical: 4,
    minWidth: 74,
  },
  shelfNamePlate: {
    marginTop: -1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 108,
  },
  kicker: {
    color: '#ffd86b',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.8,
    lineHeight: 7,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 5,
  },
  shelfKicker: {
    fontSize: 6.25,
    letterSpacing: 0.5,
  },
  holder: {
    color: '#fff7db',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0,
    maxWidth: 92,
    textShadowColor: '#000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 6,
  },
  shelfHolder: {
    fontSize: 10,
    maxWidth: 92,
  },
});
