import React from 'react';
import { Image, Text, View } from 'react-native';
import { chalkTextStyle } from './chalkColors';
import type { TopPanelLayout } from './topPanelLayout';

const SCORE_LETTERS = ['S', 'C', 'O', 'R', 'E'];

type WagerSubProfile = { name: string; avatar: string; colorHex: string };

type Props = {
  width: number;
  height: number;
  layout: TopPanelLayout;
  topScoreValue?: number;
  topSubLabel?: string;
  topSubValue?: number;
  topLeftImage?: any;
  topLeftChalkLabel?: string;
  topLeftWagerEmoji?: string | null;
  topLeftSubProfile?: WagerSubProfile | null;
};

export function ScoreDisplay({ width, height, layout, topScoreValue, topSubLabel, topSubValue, topLeftImage, topLeftChalkLabel, topLeftWagerEmoji, topLeftSubProfile }: Props) {
  const left = width * 0.225 - layout.badgeWidth / 2 - width * 0.0125 + width * 0.04;
  const top = layout.timerCenterY - layout.badgeHeight / 2 - height * 0.035 + height * 0.03;

  if (topScoreValue !== undefined) {
    return (
      <View style={{ position: 'absolute', left, top, width: layout.badgeWidth, height: layout.badgeHeight, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {SCORE_LETTERS.map((letter, i) => (
            <Text key={letter} style={[chalkTextStyle(i, 11, 4), { opacity: 0.92, textShadowOffset: { width: 1, height: 1 } }]}>{letter}</Text>
          ))}
        </View>
        <View style={{ width: layout.badgeWidth * 0.82, height: 2.5, borderRadius: 2, marginVertical: 4, backgroundColor: '#ff6a00', shadowColor: '#ff6a00', shadowOpacity: 1, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } }} />
        <View style={{ flexDirection: 'row', gap: 1 }}>
          {topScoreValue.toLocaleString().split('').map((char, i) => (
            <Text key={i} style={chalkTextStyle(i, 18)}>{char}</Text>
          ))}
        </View>
        {topSubLabel !== undefined && topSubValue !== undefined ? (
          <>
            <View style={{ flexDirection: 'row', gap: 1 }}>
              {topSubLabel.split('').map((char, i) => (
                char === ' '
                  ? <Text key={i} style={{ fontSize: 7, color: 'transparent' }}>{char}</Text>
                  : <Text key={i} style={[chalkTextStyle(i, 7, 3), { opacity: 0.92, textShadowOffset: { width: 1, height: 1 } }]}>{char}</Text>
              ))}
            </View>
            <View style={{ width: layout.badgeWidth * 0.82, height: 1.5, borderRadius: 1, marginTop: 3, marginBottom: 3, backgroundColor: '#c77dff' }} />
            <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
              {topSubValue.toLocaleString().split('').map((char, i) => (
                <Text key={i} style={chalkTextStyle(i, 13, 5)}>{char}</Text>
              ))}
            </View>
          </>
        ) : null}
      </View>
    );
  }

  if (topLeftChalkLabel) {
    const hasWager = Boolean(topLeftWagerEmoji);
    const chalkTop = layout.timerCenterY - layout.badgeHeight / 2 - height * 0.035 + height * 0.001;
    return (
      <View style={{ position: 'absolute', left, top: chalkTop, width: layout.badgeWidth, height: layout.badgeHeight, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <View style={{ flexDirection: 'row', gap: 3 }}>
          {topLeftChalkLabel.split('').map((char, i) => (
            <Text key={i} style={chalkTextStyle(i, topLeftChalkLabel === 'NO WAGER' ? 9.7 : 13.5, 6)}>{char}</Text>
          ))}
        </View>
        <View style={{ width: layout.badgeWidth * 0.82, height: 1.5, borderRadius: 1, marginTop: 4, backgroundColor: '#ff6a00' }} />
        {hasWager && (
          <>
            <Text style={{ fontSize: 22, marginTop: 3 }}>{topLeftWagerEmoji}</Text>
            {topLeftSubProfile ? (
              <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
                {topLeftSubProfile.name.slice(0, 7).split('').map((char, i) => (
                  <Text key={i} style={chalkTextStyle(i, 7, 3)}>{char}</Text>
                ))}
              </View>
            ) : null}
          </>
        )}
      </View>
    );
  }

  if (topLeftImage) {
    return (
      <Image
        source={topLeftImage}
        resizeMode="contain"
        style={{ position: 'absolute', left, top, width: layout.badgeWidth, height: layout.badgeHeight, zIndex: 10 }}
      />
    );
  }

  return null;
}
