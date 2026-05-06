import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SOLO_TOP } from './constants';

type Props = {
  width: number;
  height: number;
  topLeftImage: any;
  topRightImage: any;
  centerImage?: any;
  namePlateText?: string;
  timerText?: string;
  isTimerFrozen?: boolean;
  topRightImageScale?: number;
  topRightImageOffsetX?: number;
  topRightImageOffsetY?: number;
};

export function SoloTopPanel({ width, height, topLeftImage, topRightImage, centerImage, namePlateText, timerText, isTimerFrozen = false, topRightImageScale = 1, topRightImageOffsetX = 0, topRightImageOffsetY = 0 }: Props) {
  const panelTop     = height * 0.015;
  const soloTopH     = width * 1.21 * (1024 / 1536) * 0.99;
  const timerCenterY = panelTop + soloTopH * 0.635;
  const timerSize    = 72;
  const wagerW       = 80 * 0.99;
  const wagerH       = wagerW * 1.9214;
  const wagerCenterX = width * 0.775;

  return (
    <>
      <Image
        source={SOLO_TOP}
        resizeMode="stretch"
        style={{
          position: 'absolute',
          top: panelTop,
          left: -(width * 0.105),
          width: width * 1.21,
          height: soloTopH,
        }}
      />
      {centerImage ? (
        <Image
          source={centerImage}
          resizeMode="contain"
          style={{
            position: 'absolute',
            left: width / 2 - (timerSize * 1.9214) / 2 + width * 0.005,
            top: timerCenterY - (timerSize * 1.9214) / 2 + height * 0.005,
            width: timerSize * 1.9214,
            height: timerSize * 1.9214,
            zIndex: 10,
          }}
        />
      ) : timerText !== undefined ? (
        <>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              position: 'absolute',
              left: width / 2 - timerSize / 2 + width * 0.01,
              top: timerCenterY - timerSize / 2,
              width: timerSize,
              height: timerSize,
              fontSize: timerSize * 0.85,
              fontWeight: '900',
              color: '#fff',
              textAlign: 'center',
              textAlignVertical: 'center',
              lineHeight: timerSize,
              zIndex: 10,
            }}
          >
            {timerText}
          </Text>
          {isTimerFrozen ? (
            <FrozenClockOverlay
              left={width / 2 - timerSize / 2 + width * 0.01}
              top={timerCenterY - timerSize / 2}
              size={timerSize}
            />
          ) : null}
        </>
      ) : null}
      {topRightImage ? (
        <Image
          source={topRightImage}
          resizeMode="contain"
          style={{
            position: 'absolute',
            left: wagerCenterX - (wagerW * topRightImageScale) / 2 - width * 0.0125 - width * topRightImageOffsetX,
            top: timerCenterY - (wagerH * topRightImageScale) / 2 - height * 0.035 + height * topRightImageOffsetY,
            width: wagerW * topRightImageScale,
            height: wagerH * topRightImageScale,
            zIndex: 10,
          }}
        />
      ) : null}
      {topLeftImage ? (
        <Image
          source={topLeftImage}
          resizeMode="contain"
          style={{
            position: 'absolute',
            left: width * 0.225 - wagerW / 2 - width * 0.0125 + width * 0.04,
            top: timerCenterY - wagerH / 2 - height * 0.035,
            width: wagerW,
            height: wagerH,
            zIndex: 10,
          }}
        />
      ) : null}
      {namePlateText ? (
        <Text style={{
          position: 'absolute',
          top: panelTop + soloTopH * 0.514,
          left: width * 0.156,
          width: width * 0.7,
          textAlign: 'center',
          fontSize: 11.6,
          fontWeight: '900',
          letterSpacing: 1.5,
          color: '#ffd86b',
          textShadowColor: '#000',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
          zIndex: 20,
        }}>
          {namePlateText}
        </Text>
      ) : null}
    </>
  );
}

function FrozenClockOverlay({ left, top, size }: { left: number; top: number; size: number }) {
  const shimmer = useSharedValue(0);
  const drip = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      false,
    );
    drip.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.in(Easing.quad) }),
      -1,
      false,
    );
  }, [drip, shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.22 + shimmer.value * 0.42,
    transform: [
      { translateX: -size * 0.74 + shimmer.value * size * 1.48 },
      { rotate: '-18deg' },
    ],
  }), [size]);

  const dripStyle = useAnimatedStyle(() => {
    const fall = drip.value;
    return {
      opacity: fall < 0.12 ? fall / 0.12 : fall > 0.84 ? Math.max(0, 1 - (fall - 0.84) / 0.16) : 1,
      transform: [
        { translateY: fall * size * 0.62 },
        { scaleY: 0.55 + fall * 0.9 },
      ],
    };
  }, [size]);

  const slowDripStyle = useAnimatedStyle(() => {
    const fall = (drip.value + 0.42) % 1;
    return {
      opacity: fall < 0.16 ? fall / 0.16 : fall > 0.8 ? Math.max(0, 1 - (fall - 0.8) / 0.2) : 0.82,
      transform: [
        { translateY: fall * size * 0.48 },
        { scaleY: 0.45 + fall * 0.7 },
      ],
    };
  }, [size]);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.iceRoot,
        {
          left: left - size * 0.13,
          top: top - size * 0.13,
          width: size * 1.26,
          height: size * 1.26,
          borderRadius: size * 0.63,
        },
      ]}
    >
      <View style={[styles.iceGlow, { borderRadius: size * 0.63 }]} />
      <Reanimated.View
        style={[
          styles.iceShimmer,
          {
            width: size * 0.22,
            height: size * 1.36,
          },
          shimmerStyle,
        ]}
      />
      <View style={[styles.frostCap, { height: size * 0.22 }]} />
      <View style={[styles.icicle, { left: size * 0.17, top: size * 0.07, borderLeftWidth: size * 0.055, borderRightWidth: size * 0.055, borderTopWidth: size * 0.32 }]} />
      <View style={[styles.icicle, { left: size * 0.43, top: size * 0.03, borderLeftWidth: size * 0.045, borderRightWidth: size * 0.045, borderTopWidth: size * 0.24 }]} />
      <View style={[styles.icicle, { left: size * 0.72, top: size * 0.08, borderLeftWidth: size * 0.06, borderRightWidth: size * 0.06, borderTopWidth: size * 0.36 }]} />
      <View style={[styles.crack, { width: size * 0.72, top: size * 0.2, left: size * 0.28, transform: [{ rotate: '32deg' }] }]} />
      <View style={[styles.crack, styles.crackThin, { width: size * 0.46, top: size * 0.48, left: size * 0.14, transform: [{ rotate: '-24deg' }] }]} />
      <View style={[styles.crack, styles.crackThin, { width: size * 0.34, top: size * 0.64, left: size * 0.58, transform: [{ rotate: '66deg' }] }]} />
      <View style={[styles.frostShard, { left: size * 0.11, top: size * 0.64, width: size * 0.2, transform: [{ rotate: '47deg' }] }]} />
      <View style={[styles.frostShard, { left: size * 0.65, top: size * 0.29, width: size * 0.25, transform: [{ rotate: '-38deg' }] }]} />
      <Reanimated.View
        style={[
          styles.drip,
          {
            left: size * 0.3,
            top: size * 0.78,
            width: size * 0.045,
            height: size * 0.16,
            borderRadius: size * 0.03,
          },
          dripStyle,
        ]}
      />
      <Reanimated.View
        style={[
          styles.drip,
          styles.dripSmall,
          {
            left: size * 0.68,
            top: size * 0.75,
            width: size * 0.035,
            height: size * 0.12,
            borderRadius: size * 0.025,
          },
          slowDripStyle,
        ]}
      />
      <Text style={styles.freezeText}>FROZEN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iceRoot: {
    position: 'absolute',
    zIndex: 26,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(191,245,255,0.86)',
    backgroundColor: 'rgba(125,211,252,0.22)',
    shadowColor: '#67e8f9',
    shadowOpacity: 0.95,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  iceGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(186,230,253,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  iceShimmer: {
    position: 'absolute',
    top: '-14%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 999,
  },
  frostCap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(224,251,255,0.38)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.52)',
  },
  icicle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(224,251,255,0.82)',
    borderStyle: 'solid',
  },
  crack: {
    position: 'absolute',
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  crackThin: {
    height: 2,
    backgroundColor: 'rgba(224,251,255,0.9)',
  },
  frostShard: {
    position: 'absolute',
    height: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  drip: {
    position: 'absolute',
    backgroundColor: 'rgba(186,230,253,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  dripSmall: {
    backgroundColor: 'rgba(224,251,255,0.82)',
  },
  freezeText: {
    marginTop: 44,
    color: '#e0fbff',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: '#0369a1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
