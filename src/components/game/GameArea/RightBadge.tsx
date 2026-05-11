import React from 'react';
import { Image, Text, View } from 'react-native';
import { TopPanelThoughtBubble } from './TopPanelThoughtBubble';
import { chalkColor } from './chalkColors';
import type { TopPanelLayout } from './topPanelLayout';

type Props = {
  width: number;
  height: number;
  layout: TopPanelLayout;
  topRightImage: any;
  topRightImageScale?: number;
  topRightImageOffsetX?: number;
  topRightImageOffsetY?: number;
  topRightThoughtText?: string | null;
  topRightSubLabel?: string;
  topRightSubValue?: number;
};

export function RightBadge({
  width,
  height,
  layout,
  topRightImage,
  topRightImageScale = 1,
  topRightImageOffsetX = 0,
  topRightImageOffsetY = 0,
  topRightThoughtText = null,
  topRightSubLabel,
  topRightSubValue,
}: Props) {
  if (!topRightImage) return null;

  const left = layout.rightBadgeCenterX - (layout.badgeWidth * topRightImageScale) / 2 - width * 0.0125 - width * topRightImageOffsetX;
  const top = layout.timerCenterY - (layout.badgeHeight * topRightImageScale) / 2 - height * 0.035 + height * topRightImageOffsetY;

  return (
    <>
      <Image
        source={topRightImage}
        resizeMode="contain"
        style={{
          position: 'absolute',
          left,
          top,
          width: layout.badgeWidth * topRightImageScale,
          height: layout.badgeHeight * topRightImageScale,
          zIndex: 10,
        }}
      />

      <TopPanelThoughtBubble
        text={topRightThoughtText}
        left={width * 0.44}
        top={layout.timerCenterY - layout.badgeHeight * 0.82}
        width={width * 0.34}
      />

      {topRightSubLabel !== undefined && topRightSubValue !== undefined ? (
        <View style={{
          position: 'absolute',
          left,
          top: top + layout.badgeHeight * topRightImageScale + 4,
          width: layout.badgeWidth * topRightImageScale,
          alignItems: 'center',
          zIndex: 10,
        }}>
          <View style={{ flexDirection: 'row', gap: 2 }}>
            {topRightSubLabel.split('').map((char, i) => (
              <Text key={i} style={{ color: chalkColor(i), fontWeight: '900', fontSize: 9, opacity: 0.92, textShadowColor: chalkColor(i), textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>{char}</Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
            {topRightSubValue.toLocaleString().split('').map((char, i) => (
              <Text key={i} style={{ color: chalkColor(i), fontWeight: '900', fontSize: 14, textShadowColor: chalkColor(i), textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 5 }}>{char}</Text>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}
