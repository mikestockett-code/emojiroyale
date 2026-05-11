import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';
import type { ResultTier } from './constants';
import { TIER } from './constants';

type Particle = {
  color: string;
  startLeft: number;
  delay: number;
  size: number;
  drift: number;
  fall: number;
  spin: number;
  rounded: boolean;
};

function ConfettiParticle({ color, startLeft, delay, size, drift, fall, spin, rounded }: Particle) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 3100 + (delay % 700), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 0.18, 1], outputRange: [-20, 38, fall] });
  const translateX = anim.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, drift * -0.35, drift] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.08, 0.82, 1], outputRange: [0, 1, 0.95, 0] });
  const rotate     = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${spin}deg`] });
  const scale      = anim.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0.5, 1.18, 1, 0.7] });

  return (
    <Animated.View style={{
      position: 'absolute', left: `${startLeft}%`, top: -18,
      width: size, height: rounded ? size : Math.max(4, size * 0.58), backgroundColor: color, borderRadius: rounded ? size / 2 : 2,
      opacity, transform: [{ translateX }, { translateY }, { rotate }, { scale }],
    }} />
  );
}

export function Confetti({ tier }: { tier: ResultTier }) {
  const cfg = TIER[tier];
  const particles = useMemo(() => {
    const palette = [cfg.ring, '#ffd86b', '#fff4a3', '#ffae2b', '#ffffff', '#f8c6ff'];
    return Array.from({ length: 44 }, (_, i) => ({
      color: palette[i % palette.length],
      startLeft: 3 + ((i * 17) % 94),
      delay: (i * 83) % 1500,
      size: 5 + (i % 5),
      drift: ((i % 2 === 0 ? 1 : -1) * (20 + ((i * 11) % 56))),
      fall: 460 + ((i * 19) % 180),
      spin: (i % 2 === 0 ? 1 : -1) * (420 + ((i * 29) % 540)),
      rounded: i % 6 === 0,
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
