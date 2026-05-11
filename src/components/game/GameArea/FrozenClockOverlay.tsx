import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { topPanelStyles } from './TopGameArea.styles';

type Props = {
  left: number;
  top: number;
  size: number;
};

export function FrozenClockOverlay({ left, top, size }: Props) {
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
        topPanelStyles.iceRoot,
        {
          left: left - size * 0.13,
          top: top - size * 0.13,
          width: size * 1.26,
          height: size * 1.26,
          borderRadius: size * 0.63,
        },
      ]}
    >
      <View style={[topPanelStyles.iceGlow, { borderRadius: size * 0.63 }]} />
      <Reanimated.View
        style={[
          topPanelStyles.iceShimmer,
          { width: size * 0.22, height: size * 1.36 },
          shimmerStyle,
        ]}
      />
      <View style={[topPanelStyles.frostCap, { height: size * 0.22 }]} />
      <View style={[topPanelStyles.icicle, { left: size * 0.17, top: size * 0.07, borderLeftWidth: size * 0.055, borderRightWidth: size * 0.055, borderTopWidth: size * 0.32 }]} />
      <View style={[topPanelStyles.icicle, { left: size * 0.43, top: size * 0.03, borderLeftWidth: size * 0.045, borderRightWidth: size * 0.045, borderTopWidth: size * 0.24 }]} />
      <View style={[topPanelStyles.icicle, { left: size * 0.72, top: size * 0.08, borderLeftWidth: size * 0.06, borderRightWidth: size * 0.06, borderTopWidth: size * 0.36 }]} />
      <View style={[topPanelStyles.crack, { width: size * 0.72, top: size * 0.2, left: size * 0.28, transform: [{ rotate: '32deg' }] }]} />
      <View style={[topPanelStyles.crack, topPanelStyles.crackThin, { width: size * 0.46, top: size * 0.48, left: size * 0.14, transform: [{ rotate: '-24deg' }] }]} />
      <View style={[topPanelStyles.crack, topPanelStyles.crackThin, { width: size * 0.34, top: size * 0.64, left: size * 0.58, transform: [{ rotate: '66deg' }] }]} />
      <View style={[topPanelStyles.frostShard, { left: size * 0.11, top: size * 0.64, width: size * 0.2, transform: [{ rotate: '47deg' }] }]} />
      <View style={[topPanelStyles.frostShard, { left: size * 0.65, top: size * 0.29, width: size * 0.25, transform: [{ rotate: '-38deg' }] }]} />
      <Reanimated.View
        style={[
          topPanelStyles.drip,
          { left: size * 0.3, top: size * 0.78, width: size * 0.045, height: size * 0.16, borderRadius: size * 0.03 },
          dripStyle,
        ]}
      />
      <Reanimated.View
        style={[
          topPanelStyles.drip,
          topPanelStyles.dripSmall,
          { left: size * 0.68, top: size * 0.75, width: size * 0.035, height: size * 0.12, borderRadius: size * 0.025 },
          slowDripStyle,
        ]}
      />
      <Text style={topPanelStyles.freezeText}>FROZEN</Text>
    </View>
  );
}

