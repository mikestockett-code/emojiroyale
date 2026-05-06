import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ViewStyle } from 'react-native';
import { useAudioContext } from '../../../fresh/audio/AudioContext';

type Props = {
  label: string;
  icon?: string;
  primary?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  fontSize?: number;
};

export function GildedButton({ label, icon, primary, onPress, style, fontSize = 14 }: Props) {
  const { playSound } = useAudioContext();

  return (
    <Pressable
      onPress={() => {
        playSound('button');
        onPress();
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }, style]}
    >
      <LinearGradient colors={['#ffd86b', '#c98c1a', '#5a3300']} style={styles.ring}>
        <LinearGradient
          colors={primary ? ['#b41818', '#6a0808'] : ['#2a1408', '#18090a']}
          style={styles.fill}
        >
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text style={[styles.label, { fontSize }]}>{label}</Text>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderRadius: 999,
    padding: 3,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  fill: {
    borderRadius: 999,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: { fontSize: 14 },
  label: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#ffd86b',
    textShadowColor: '#3a1a00',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
});
