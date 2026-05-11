import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { GildedButton } from '../../../fresh/shared/GameResultOverlay/GildedButton';
import { theme } from '../../../fresh/shared/luxuryTheme';

type Props = {
  visible: boolean;
  winner: any;
  highlightColor: string;
  currentPlayerName: string;
  nextPlayerName: string;
  onContinue?: () => void;
  insets: EdgeInsets;
};

export function HandoffOverlay({ visible, winner, highlightColor, currentPlayerName, nextPlayerName, onContinue, insets }: Props) {
  if (!visible || winner) return null;

  return (
    <View style={[styles.backdrop, {
      paddingTop: insets.top + 28,
      paddingBottom: insets.bottom + 24,
    }]}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <LinearGradient
          colors={['#ffd86b', '#c98c1a', '#5a3300']}
          style={[styles.cardRing, { shadowColor: highlightColor }]}
        >
          <LinearGradient colors={['#1a0a06', '#2a1408', '#1a0a06']} style={styles.cardInner}>
            <Text style={styles.kicker}>PASS AND PLAY</Text>
            <Text style={styles.title}>Pass to {nextPlayerName}</Text>
            <Text style={styles.subtitle}>
              {currentPlayerName} finished their turn. Hand the device to {nextPlayerName}, then continue.
            </Text>
          </LinearGradient>
        </LinearGradient>
      </View>
      <GildedButton label={`CONTINUE TO ${nextPlayerName.toUpperCase()}`} primary onPress={() => onContinue?.()} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.98)',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  cardRing: {
    borderRadius: 22,
    padding: 3,
    shadowOpacity: 0.7,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18,
  },
  cardInner: {
    borderRadius: 19,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 10,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.gold,
    ...theme.textShadow,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    color: theme.gold,
    ...theme.textShadow,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 22,
  },
});
