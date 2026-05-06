import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useAudioContext } from '../../../fresh/audio/AudioContext';

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
  const { playSound } = useAudioContext();
  if (!visible || winner) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 100,
      backgroundColor: 'rgba(5,3,15,0.94)',
      paddingTop: insets.top + 28,
      paddingBottom: insets.bottom + 24,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
    }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{
          backgroundColor: '#484B4B',
          borderRadius: 22,
          borderWidth: 4,
          borderColor: highlightColor,
          paddingHorizontal: 24,
          paddingVertical: 28,
        }}>
          <Text style={{ fontSize: 12, fontWeight: '900', letterSpacing: 1.5, textAlign: 'center', color: '#f97316', marginBottom: 10 }}>
            PASS AND PLAY
          </Text>
          <Text style={{ fontSize: 30, fontWeight: '900', textAlign: 'center', color: '#f97316', marginBottom: 10 }}>
            Pass to {nextPlayerName}
          </Text>
          <Text style={{ fontSize: 15, textAlign: 'center', color: highlightColor, lineHeight: 22 }}>
            {currentPlayerName} finished their turn. Hand the device to {nextPlayerName}, then continue.
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => {
          playSound('button');
          onContinue?.();
        }}
        style={({ pressed }) => ({
          backgroundColor: highlightColor,
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: 'center',
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#1a1a1a' }}>
          Continue to {nextPlayerName}
        </Text>
      </Pressable>
    </View>
  );
}
