import React from 'react';
import { View } from 'react-native';
import { GildedButton } from '../shared/GameResultOverlay/GildedButton';
import { luxuryResultStyles as styles } from '../shared/luxuryResultStyles';

type Props = {
  onPlayAgain: () => void;
  onShare: () => void;
  onMenu: () => void;
};

export function RecapButtons({ onPlayAgain, onShare, onMenu }: Props) {
  return (
    <View style={styles.buttonStack}>
      <GildedButton 
        label="PLAY AGAIN" 
        icon="▶" 
        primary 
        onPress={onPlayAgain} 
        style={styles.fullWidth} 
      />

      <GildedButton
        label="SHARE"
        icon="↗"
        onPress={onShare}
        style={styles.fullWidth}
      />

      <GildedButton
        label="MENU"
        onPress={onMenu}
        style={styles.fullWidth}
      />
    </View>
  );
}
