import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../shared/luxuryTheme';
import type { BattleCpuId } from './battleCpuConfig';

type Props = {
  visible: boolean;
  cpuId?: BattleCpuId;
};

const CPU_NAMES: Record<string, string> = {
  todd: 'TODD',
  nico: 'NICO',
  marie: 'MARIE',
  cpu4: 'CPU 4',
  cpu5: 'CPU 5',
};

function BurstShard({ index }: { index: number }) {
  const fly = useRef(new Animated.Value(0)).current;
  const angle = (index / 18) * Math.PI * 2;
  const distance = 120 + (index % 4) * 34;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(index * 45),
        Animated.timing(fly, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(fly, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [fly, index]);

  const translateX = fly.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * distance] });
  const translateY = fly.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * distance] });
  const opacity = fly.interpolate({ inputRange: [0, 0.12, 0.8, 1], outputRange: [0, 1, 1, 0] });
  const scale = fly.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.35] });

  return (
    <Animated.View
      style={[
        styles.shard,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
}

export function BattleStageClearSplash({ visible, cpuId = 'todd' }: Props) {
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const shards = useMemo(() => Array.from({ length: 18 }, (_, index) => index), []);

  useEffect(() => {
    if (!visible) {
      entrance.setValue(0);
      pulse.setValue(0);
      spin.setValue(0);
      return;
    }

    const entranceAnimation = Animated.spring(entrance, { toValue: 1, friction: 5, tension: 78, useNativeDriver: true });
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 520, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 520, useNativeDriver: true }),
      ]),
    );
    const spinAnimation = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2200, useNativeDriver: true }));

    entranceAnimation.start();
    pulseAnimation.start();
    spinAnimation.start();

    return () => {
      pulseAnimation.stop();
      spinAnimation.stop();
    };
  }, [entrance, pulse, spin, visible]);

  if (!visible) return null;

  const scale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] });
  const titleScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1.26] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.72] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const cpuName = CPU_NAMES[cpuId] ?? 'CPU';

  return (
    <View pointerEvents="none" style={styles.root}>
      <Animated.View style={[styles.bigRing, { opacity: ringOpacity, transform: [{ scale: ringScale }, { rotate }] }]} />
      <Animated.View style={[styles.bigRing, styles.bigRingTwo, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
      {shards.map((index) => <BurstShard key={index} index={index} />)}

      <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
        <LinearGradient colors={['#fff6b8', theme.gold, '#22c55e', theme.darkGold]} style={styles.cardRing}>
          <LinearGradient colors={['#130704', theme.deepBrown, '#04170b']} style={styles.card}>
            <Text style={styles.kicker}>ALTER EGO CLEARED</Text>
            <Animated.Text style={[styles.title, { transform: [{ scale: titleScale }] }]}>STAGE 3 CLEAR</Animated.Text>
            <Text style={styles.cpuName}>{cpuName} DEFEATED</Text>
            <Text style={styles.subtitle}>A new chapter opens.</Text>
          </LinearGradient>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 230,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.78)',
    overflow: 'hidden',
  },
  bigRing: {
    position: 'absolute',
    width: 390,
    height: 390,
    borderRadius: 195,
    borderWidth: 8,
    borderColor: theme.gold,
    shadowColor: theme.gold,
    shadowOpacity: 1,
    shadowRadius: 38,
    shadowOffset: { width: 0, height: 0 },
  },
  bigRingTwo: {
    width: 560,
    height: 560,
    borderRadius: 280,
    borderStyle: 'dashed',
    borderColor: '#22c55e',
  },
  shard: {
    position: 'absolute',
    width: 16,
    height: 48,
    borderRadius: 8,
    backgroundColor: theme.gold,
    shadowColor: '#fff6b8',
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  cardWrap: {
    width: '90%',
    maxWidth: 420,
  },
  cardRing: {
    borderRadius: 28,
    padding: 5,
    shadowColor: theme.gold,
    shadowOpacity: 1,
    shadowRadius: 42,
    shadowOffset: { width: 0, height: 0 },
    elevation: 26,
  },
  card: {
    borderRadius: 23,
    paddingVertical: 30,
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 8,
  },
  kicker: {
    color: '#bbf7d0',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
  },
  title: {
    color: theme.gold,
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 12,
  },
  cpuName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});
