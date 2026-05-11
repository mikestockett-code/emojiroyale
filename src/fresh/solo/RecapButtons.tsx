import React from 'react';
import { View } from 'react-native';
import { GildedButton } from '../shared/GameResultOverlay/GildedButton';

type Props = {
  onPlayAgain: () => void;
  onShare: () => void;
  onMenu: () => void;
};

export function RecapButtons({ onPlayAgain, onShare, onMenu }: Props) {
  return (
    <View style={{ width: '100%', gap: 10 }}>
      <GildedButton 
        label="PLAY AGAIN" 
        icon="▶" 
        primary 
        onPress={onPlayAgain} 
        style={{ width: '100%' }} 
      />

      <GildedButton
        label="SHARE"
        icon="↗"
        onPress={onShare}
        style={{ width: '100%' }}
      />

      <GildedButton
        label="MENU"
        onPress={onMenu}
        style={{ width: '100%' }}
      />
    </View>
  );
}
