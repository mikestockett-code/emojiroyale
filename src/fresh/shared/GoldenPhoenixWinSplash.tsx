import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const PHOENIX_IMAGE = require('../../../assets/CustomEmojis/phoenixemoji.png');

type Props = { visible: boolean };

export function GoldenPhoenixWinSplash({ visible }: Props) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      scale.setValue(0.4);
      opacity.setValue(0);
      glowOpacity.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
        Animated.delay(1400),
        Animated.timing(glowOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.5, damping: 5, stiffness: 90, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 3.2, damping: 4, stiffness: 40, useNativeDriver: true }),
      ]),
    ]).start();
  }, [visible, scale, opacity, glowOpacity]);

  if (!visible) return null;

  return (
    <View style={styles.root} pointerEvents="none">
      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
      <Animated.Image
        source={PHOENIX_IMAGE}
        style={[styles.phoenix, { transform: [{ scale }], opacity }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#f5c518',
    shadowColor: '#f5c518',
    shadowOpacity: 1,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 0 },
  },
  phoenix: {
    width: 160,
    height: 160,
    zIndex: 2,
  },
});
