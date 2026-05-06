import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GildedButton } from '../../components/game/SoloResultOverlay/GildedButton';
import { styles } from '../shared/luxuryCardStyles';

type Props = {
  onPlayAgain: () => void;
  onMenu: () => void;
};

const PURPLE = '#7B2FBE';

export function RecapButtons({ onPlayAgain, onMenu }: Props) {
  return (
    <View style={{ width: '100%' }}>
      <GildedButton 
        label="PLAY AGAIN" 
        icon="▶" 
        primary 
        onPress={onPlayAgain} 
        style={{ width: '100%' }} 
      />

      <Pressable
        onPress={onMenu}
        style={({ pressed }) => [
          styles.btnShell,
          styles.menuBtnShell,
          pressed && { opacity: 0.7 }
        ]}
      >
        <LinearGradient
          colors={['#a855f7', PURPLE, '#4c1d95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.btnText}>MENU</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}