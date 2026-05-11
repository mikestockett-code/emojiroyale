import React from 'react';
import { Text, View } from 'react-native';
import { topPanelStyles } from './TopGameArea.styles';

type Props = {
  text: string | null;
  left: number;
  top: number;
  width: number;
};

export function TopPanelThoughtBubble({ text, left, top, width }: Props) {
  if (!text) return null;

  return (
    <View pointerEvents="none" style={[topPanelStyles.thoughtBubble, { left, top, width }]}>
      <Text adjustsFontSizeToFit numberOfLines={2} style={topPanelStyles.thoughtText}>
        {text}
      </Text>
    </View>
  );
}

