import React from 'react';
import { Image, Text, View } from 'react-native';
import { TopPanelThoughtBubble } from './TopPanelThoughtBubble';
import { chalkTextStyle } from './chalkColors';
import type { TopPanelLayout } from './topPanelLayout';

type Props = {
  width: number;
  height: number;
  layout: TopPanelLayout;
  topRightImage?: any;
  topRightChalkLabel?: string;
  topRightWagerEmoji?: string | null;
  topRightWagerEmojiName?: string | null;
  topRightSubProfile?: { name: string; avatar: string; colorHex: string } | null;
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
  topRightChalkLabel,
  topRightWagerEmoji,
  topRightWagerEmojiName,
  topRightSubProfile,
  topRightImageScale = 1,
  topRightImageOffsetX = 0,
  topRightImageOffsetY = 0,
  topRightThoughtText = null,
  topRightSubLabel,
  topRightSubValue,
}: Props) {
  if (!topRightImage && !topRightChalkLabel && !topRightWagerEmoji) return null;

  const left = layout.rightBadgeCenterX - (layout.badgeWidth * topRightImageScale) / 2 - width * 0.0125 - width * topRightImageOffsetX;
  const top = layout.timerCenterY - (layout.badgeHeight * topRightImageScale) / 2 - height * 0.035 + height * topRightImageOffsetY;

  if (topRightChalkLabel) {
    const hasWager = Boolean(topRightWagerEmoji);
    return (
      <View style={{ position: 'absolute', left, top: top + height * 0.001, width: layout.badgeWidth, height: layout.badgeHeight, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <View style={{ flexDirection: 'row', gap: 3 }}>
          {topRightChalkLabel.split('').map((char, i) => (
            <Text key={i} style={chalkTextStyle(i, topRightChalkLabel === 'NO WAGER' ? 9.7 : 13.5, 6)}>{char}</Text>
          ))}
        </View>
        <View style={{ width: layout.badgeWidth * 0.82, height: 1.5, borderRadius: 1, marginTop: 4, backgroundColor: '#ff6a00' }} />
        {hasWager && (
          <>
            <Text style={{ fontSize: 22, marginTop: 3 }}>{topRightWagerEmoji}</Text>
            {topRightWagerEmojiName ? (
              <View style={{ flexDirection: 'row', gap: 1, marginTop: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                {topRightWagerEmojiName.slice(0, 12).split('').map((char, i) => (
                  <Text key={i} style={chalkTextStyle(i, 7, 3)}>{char}</Text>
                ))}
              </View>
            ) : topRightSubProfile ? (
              <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
                {topRightSubProfile.name.slice(0, 7).split('').map((char, i) => (
                  <Text key={i} style={chalkTextStyle(i, 7, 3)}>{char}</Text>
                ))}
              </View>
            ) : null}
          </>
        )}
      </View>
    );
  }

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
              <Text key={i} style={[chalkTextStyle(i, 9, 3), { opacity: 0.92, textShadowOffset: { width: 1, height: 1 } }]}>{char}</Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
            {topRightSubValue.toLocaleString().split('').map((char, i) => (
              <Text key={i} style={chalkTextStyle(i, 14, 5)}>{char}</Text>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}
