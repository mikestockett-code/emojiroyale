import React from 'react';
import { Image, Text, View } from 'react-native';
import { chalkColor } from './chalkColors';
import type { TopPanelLayout } from './topPanelLayout';

const SCORE_LETTERS = ['S', 'C', 'O', 'R', 'E'];

type Props = {
  width: number;
  height: number;
  layout: TopPanelLayout;
  topScoreValue?: number;
  topSubLabel?: string;
  topSubValue?: number;
  topLeftImage?: any;
};

export function ScoreDisplay({ width, height, layout, topScoreValue, topSubLabel, topSubValue, topLeftImage }: Props) {
  const left = width * 0.225 - layout.badgeWidth / 2 - width * 0.0125 + width * 0.04;
  const top = layout.timerCenterY - layout.badgeHeight / 2 - height * 0.035;

  if (topScoreValue !== undefined) {
    return (
      <View style={{ position: 'absolute', left, top, width: layout.badgeWidth, height: layout.badgeHeight, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {SCORE_LETTERS.map((letter, i) => (
            <Text key={letter} style={{ color: chalkColor(i), fontWeight: '900', fontSize: 12, opacity: 0.92, textShadowColor: chalkColor(i), textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 }}>{letter}</Text>
          ))}
        </View>
        <View style={{ width: layout.badgeWidth * 0.82, height: 2.5, borderRadius: 2, marginVertical: 4, backgroundColor: '#ff6a00', shadowColor: '#ff6a00', shadowOpacity: 1, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } }} />
        <View style={{ flexDirection: 'row', gap: 1 }}>
          {topScoreValue.toLocaleString().split('').map((char, i) => (
            <Text key={i} style={{ color: chalkColor(i), fontWeight: '900', fontSize: 20, textShadowColor: chalkColor(i), textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 }}>{char}</Text>
          ))}
        </View>
        {topSubLabel !== undefined && topSubValue !== undefined ? (
          <>
            <View style={{ width: layout.badgeWidth * 0.82, height: 1.5, borderRadius: 1, marginTop: height * 0.03, marginBottom: 3, backgroundColor: 'rgba(255,255,255,0.45)' }} />
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontWeight: '900', fontSize: 8, letterSpacing: 1.5, opacity: 0.85 }}>{topSubLabel}</Text>
            <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
              {topSubValue.toLocaleString().split('').map((char, i) => (
                <Text key={i} style={{ color: chalkColor(i), fontWeight: '900', fontSize: 14, textShadowColor: chalkColor(i), textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 5 }}>{char}</Text>
              ))}
            </View>
          </>
        ) : null}
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
