import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { FrozenClockOverlay } from './FrozenClockOverlay';
import { topPanelStyles } from './TopGameArea.styles';
import type { TopPanelLayout } from './topPanelLayout';

type Props = {
  width: number;
  height: number;
  layout: TopPanelLayout;
  timerText?: string;
  centerImage?: any;
  centerImageOffsetY?: number;
  isTimerFrozen?: boolean;
  isTimerStealing?: boolean;
};

export function TimerDisplay({
  width,
  height,
  layout,
  timerText,
  centerImage,
  centerImageOffsetY = 0,
  isTimerFrozen = false,
  isTimerStealing = false,
}: Props) {
  const timerBoxWidth = layout.timerSize * 1.677;
  const timerLeft = width / 2 - timerBoxWidth / 2;
  const timerTop = layout.timerCenterY - layout.timerSize / 2;
  const centerImageSize = layout.timerSize * 1.9214;

  const stealFlash = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isTimerStealing) return;
    Animated.sequence([
      Animated.timing(stealFlash, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(stealFlash, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(stealFlash, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(stealFlash, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(stealFlash, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(stealFlash, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [isTimerStealing, stealFlash]);

  if (centerImage) {
    return (
      <Image
        source={centerImage}
        resizeMode="contain"
        style={{
          position: 'absolute',
          left: width / 2 - centerImageSize / 2 + width * 0.005,
          top: layout.timerCenterY - centerImageSize / 2 + height * (0.005 + centerImageOffsetY),
          width: centerImageSize,
          height: centerImageSize,
          zIndex: 10,
        }}
      />
    );
  }

  if (timerText === undefined) return null;

  return (
    <>
      <View style={{ position: 'absolute', left: timerLeft, top: timerTop, width: timerBoxWidth, height: layout.timerSize }}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[topPanelStyles.timerText, {
            width: timerBoxWidth,
            height: layout.timerSize,
            fontSize: layout.timerSize * 0.85,
            lineHeight: layout.timerSize,
          }]}
        >
          {timerText}
        </Text>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0, top: 0,
            width: timerBoxWidth,
            height: layout.timerSize,
            borderRadius: layout.timerSize / 2,
            backgroundColor: '#ff2222',
            opacity: stealFlash,
          }}
        />
      </View>
      {isTimerFrozen ? <FrozenClockOverlay left={timerLeft} top={timerTop} size={timerBoxWidth} /> : null}
    </>
  );
}
