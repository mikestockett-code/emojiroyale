import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';
import type { ResultTier } from './constants';
import { TIER } from './constants';

function ConfettiParticle({ color, startLeft, delay }: { color: string; startLeft: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 500] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.08, 0.85, 1], outputRange: [0, 0.9, 0.9, 0] });
  const rotate     = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] });

  return (
    <Animated.View style={{
      position: 'absolute', left: `${startLeft}%`, top: -10,
      width: 6, height: 4, backgroundColor: color, borderRadius: 1,
      opacity, transform: [{ translateY }, { rotate }],
    }} />
  );
}

export function Confetti({ tier }: { tier: ResultTier }) {
  const cfg = TIER[tier];
  const particles = useMemo(() => {
    const palette = [cfg.ring, '#ffd86b', '#fff4a3', '#ffae2b'];
    return Array.from({ length: 18 }, (_, i) => ({
      color: palette[i % palette.length],
      startLeft: 5 + Math.floor((i / 18) * 90),
      delay: (i * 190) % 1500,
    }));
  }, [tier]);

  return (
    <View pointerEvents="none" style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden', zIndex: 5,
    }}>
      {particles.map((p, i) => <ConfettiParticle key={i} {...p} />)}
    </View>
  );
}
