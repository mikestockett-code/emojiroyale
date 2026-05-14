import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioContext } from '../../fresh/audio/AudioContext';
import { theme } from '../../fresh/shared/luxuryTheme';

const WIZARD_IMAGE = require('../../../assets/CustomEmojis/the_wiz.png');

const PRIZES = [
  'THE WIZARD OF OZ',
  '+2 COMMON',
  '+2 EPIC',
  '+2 LEGENDARY',
  '+2 EP1',
  '+2 EPI',
];

function PrizeSpark({ label, index }: { label: string; index: number }) {
  const fall = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(index * 170),
        Animated.parallel([
          Animated.timing(fall, { toValue: 1, duration: 2600, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(drift, { toValue: 1, duration: 1300, useNativeDriver: true }),
            Animated.timing(drift, { toValue: 0, duration: 1300, useNativeDriver: true }),
          ]),
        ]),
        Animated.timing(fall, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [drift, fall, index]);

  const translateY = fall.interpolate({ inputRange: [0, 1], outputRange: [-120, 760] });
  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [-34, 34] });
  const rotate = fall.interpolate({ inputRange: [0, 1], outputRange: ['-14deg', '18deg'] });
  const opacity = fall.interpolate({ inputRange: [0, 0.08, 0.88, 1], outputRange: [0, 1, 1, 0] });

  return (
    <Animated.View
      style={[
        styles.prizeSpark,
        {
          left: `${8 + ((index * 15) % 82)}%`,
          opacity,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    >
      <Text style={styles.prizeText}>{label}</Text>
    </Animated.View>
  );
}

export function WizardOfOzJackpotOverlay({ visible }: { visible: boolean }) {
  const { playSound, duckMusic, unduckMusic } = useAudioContext();
  const entrance = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const prizeSparks = useMemo(
    () => Array.from({ length: 18 }, (_, index) => PRIZES[index % PRIZES.length]),
    [],
  );

  useEffect(() => {
    if (!visible) return;
    entrance.setValue(0);
    spin.setValue(0);
    pulse.setValue(0);
    duckMusic();
    playSound('jackpot');

    const entranceAnimation = Animated.spring(entrance, { toValue: 1, friction: 5, tension: 95, useNativeDriver: true });
    const spinAnimation = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2600, useNativeDriver: true }));
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 560, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 560, useNativeDriver: true }),
      ]),
    );

    entranceAnimation.start();
    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
      unduckMusic();
    };
  }, [duckMusic, entrance, playSound, pulse, spin, unduckMusic, visible]);

  if (!visible) return null;

  const imageScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.28, 1] });
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.22] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.72] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View pointerEvents="none" style={styles.backdrop}>
      {prizeSparks.map((label, index) => (
        <PrizeSpark key={`${label}-${index}`} label={label} index={index} />
      ))}

      <Animated.View style={[styles.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }, { rotate }] }]} />
      <Animated.View style={[styles.ring, styles.ringTwo, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />

      <Animated.View style={[styles.heroWrap, { transform: [{ scale: imageScale }] }]}>
        <LinearGradient colors={['#86efac', theme.gold, '#22c55e']} style={styles.heroRing}>
          <LinearGradient colors={['#061a0b', theme.deepBrown, '#092112']} style={styles.heroInner}>
            <Text style={styles.kicker}>IMPOSSIBLE JACKPOT</Text>
            <Image source={WIZARD_IMAGE} resizeMode="contain" style={styles.wizardImage} />
            <Text style={styles.title}>THE WIZARD OF OZ</Text>
            <Text style={styles.subtitle}>Tornado miracle win</Text>
            <Text style={styles.bundle}>2 COMMON  •  2 EPIC  •  2 LEGENDARY  •  2 EP1  •  2 EPI</Text>
          </LinearGradient>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.76)',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 9,
    borderColor: '#86efac',
    shadowColor: '#22c55e',
    shadowOpacity: 0.95,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 0 },
  },
  ringTwo: {
    width: 520,
    height: 520,
    borderRadius: 260,
    borderColor: theme.gold,
    borderStyle: 'dashed',
  },
  heroWrap: {
    width: '88%',
    maxWidth: 390,
  },
  heroRing: {
    borderRadius: 26,
    padding: 4,
    shadowColor: '#86efac',
    shadowOpacity: 0.95,
    shadowRadius: 38,
    shadowOffset: { width: 0, height: 0 },
    elevation: 24,
  },
  heroInner: {
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    gap: 8,
  },
  kicker: {
    color: '#86efac',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  wizardImage: {
    width: 190,
    height: 190,
  },
  title: {
    color: theme.gold,
    fontSize: 31,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#f0fdf4',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bundle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 17,
  },
  prizeSpark: {
    position: 'absolute',
    top: 0,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(6,26,11,0.92)',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  prizeText: {
    color: theme.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
