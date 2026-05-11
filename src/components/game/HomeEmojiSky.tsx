import React, { useEffect, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  width: number;
  height: number;
};

type EmojiParticle = {
  emoji: string;
  left: number;
  top: number;
  size: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  rotate: number;
  opacity: number;
};

type ImageParticle = Omit<EmojiParticle, 'emoji'> & {
  source: ImageSourcePropType;
};

const LEGENDARY_PNGS: ImageSourcePropType[] = [
  require('../../../assets/CustomEmojis/phoenixemoji.png'),
  require('../../../assets/CustomEmojis/thehiddenson.png'),
  require('../../../assets/CustomEmojis/polly.png'),
];

const SKY_EMOJIS = [
  '🐦‍🔥', '🔥', '✨', '👑', '🪶', '🧩', '💛', '⭐',
  '🦄', '🌈', '💎', '🎲', '🥳', '🍀', '🚀', '😀',
];

export function HomeEmojiSky({ width, height }: Props) {
  const skyHeight = Math.max(250, height * 0.58);
  const particles = useMemo(() => buildEmojiParticles(width, skyHeight), [width, skyHeight]);
  const imageParticles = useMemo(() => buildImageParticles(width, skyHeight), [width, skyHeight]);
  const sparkles = useMemo(() => buildSparkles(width, skyHeight), [width, skyHeight]);

  return (
    <View pointerEvents="none" style={[styles.root, { width, height: skyHeight }]}>
      <View style={styles.darkVeil} />
      <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
        {sparkles.map((sparkle) => (
          <Circle
            key={sparkle.key}
            cx={sparkle.x}
            cy={sparkle.y}
            r={sparkle.radius}
            color={sparkle.color}
          />
        ))}
      </Canvas>

      {particles.map((particle, index) => (
        <FloatingEmoji key={`${particle.emoji}-${index}`} particle={particle} />
      ))}

      {imageParticles.map((particle, index) => (
        <FloatingLegendaryImage key={`legendary-${index}`} particle={particle} />
      ))}
    </View>
  );
}

function FloatingEmoji({ particle }: { particle: EmojiParticle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, [particle.delay, particle.duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const sway = Math.sin(progress.value * Math.PI * 2);
    const bob = Math.cos(progress.value * Math.PI * 2);
    return {
      opacity: particle.opacity,
      transform: [
        { translateX: sway * particle.driftX },
        { translateY: bob * particle.driftY },
        { rotate: `${sway * particle.rotate}deg` },
        { scale: 0.92 + progress.value * 0.16 },
      ],
    };
  });

  return (
    <Reanimated.View
      style={[
        styles.emojiWrap,
        {
          left: particle.left,
          top: particle.top,
          width: particle.size * 1.8,
          height: particle.size * 1.8,
        },
        animatedStyle,
      ]}
    >
      <Text style={[styles.emoji, { fontSize: particle.size }]}>{particle.emoji}</Text>
    </Reanimated.View>
  );
}

function FloatingLegendaryImage({ particle }: { particle: ImageParticle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, [particle.delay, particle.duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const sway = Math.sin(progress.value * Math.PI * 2);
    const bob = Math.cos(progress.value * Math.PI * 2);
    return {
      opacity: particle.opacity,
      transform: [
        { translateX: sway * particle.driftX },
        { translateY: bob * particle.driftY },
        { rotate: `${sway * particle.rotate}deg` },
        { scale: 0.9 + progress.value * 0.13 },
      ],
    };
  });

  return (
    <Reanimated.View
      style={[
        styles.legendaryWrap,
        {
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
        },
        animatedStyle,
      ]}
    >
      <Image source={particle.source} style={styles.legendaryImage} resizeMode="contain" />
    </Reanimated.View>
  );
}

function buildEmojiParticles(width: number, height: number): EmojiParticle[] {
  const count = width > 390 ? 28 : 22;
  return Array.from({ length: count }, (_, index) => {
    const lane = index / count;
    const left = 10 + ((index * 53) % Math.max(80, width - 42));
    const top = 22 + ((index * 89) % Math.max(150, height - 86));
    const size = 17 + ((index * 7) % 15);
    return {
      emoji: SKY_EMOJIS[index % SKY_EMOJIS.length],
      left,
      top,
      size,
      driftX: 9 + (index % 5) * 5,
      driftY: 10 + (index % 4) * 6,
      duration: 3300 + (index % 8) * 420,
      delay: (index * 173) % 1800,
      rotate: index % 2 === 0 ? 10 + lane * 10 : -12 - lane * 8,
      opacity: 0.22 + (index % 5) * 0.055,
    };
  });
}

function buildImageParticles(width: number, height: number): ImageParticle[] {
  const positions = [
    { leftRatio: 0.14, topRatio: 0.18 },
    { leftRatio: 0.73, topRatio: 0.24 },
    { leftRatio: 0.46, topRatio: 0.09 },
  ];

  return LEGENDARY_PNGS.map((source, index) => ({
    source,
    left: Math.max(12, Math.min(width - 62, width * positions[index].leftRatio)),
    top: Math.max(20, Math.min(height - 72, height * positions[index].topRatio)),
    size: 38 + index * 4,
    driftX: 11 + index * 5,
    driftY: 13 + index * 4,
    duration: 4600 + index * 620,
    delay: 360 + index * 540,
    rotate: index === 1 ? -10 : 12,
    opacity: 0.34,
  }));
}

function buildSparkles(width: number, height: number) {
  return Array.from({ length: 40 }, (_, index) => {
    const x = 8 + ((index * 47) % Math.max(80, width - 16));
    const y = 16 + ((index * 71) % Math.max(120, height - 20));
    return {
      key: `sparkle-${index}`,
      x,
      y,
      radius: 1.1 + (index % 4) * 0.65,
      color: index % 3 === 0 ? 'rgba(255,216,107,0.18)' : 'rgba(255,255,255,0.10)',
    };
  });
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  darkVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.13)',
  },
  emojiWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  legendaryWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,216,107,0.08)',
    shadowColor: '#ffd86b',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  legendaryImage: {
    width: '100%',
    height: '100%',
  },
});
