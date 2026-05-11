import React from 'react';
import { Text, View } from 'react-native';
import { chalkColor } from './chalkColors';
import type { TopPanelLayout } from './topPanelLayout';

type Props = {
  width: number;
  height: number;
  layout: TopPanelLayout;
  profileName?: string;
};

export function ProfileNameDisplay({ width, height, layout, profileName }: Props) {
  if (!profileName) return null;

  return (
    <View style={{
      position: 'absolute',
      top: layout.timerCenterY - layout.badgeHeight / 2 - height * 0.165,
      left: (width - layout.panelWidth) / 2,
      width: layout.panelWidth,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
    }}>
      {profileName.toUpperCase().split('').map((char, i) => {
        const c = char === ' ' ? 'transparent' : chalkColor(i);
        return (
          <Text key={i} style={{ color: c, fontWeight: '900', fontSize: profileName.length > 7 ? 56 : 60, opacity: 0.93, textShadowColor: c, textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 }}>{char}</Text>
        );
      })}
    </View>
  );
}
