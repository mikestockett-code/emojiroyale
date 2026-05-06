import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function PassPlayPowerHeader() {
  return (
    <View style={s.powerHeader}>
      <View>
        <Text style={[s.eyebrow, { position: 'absolute', color: '#000', top: 1, left: 1 }]}>PASS & PLAY</Text>
        <Text style={[s.eyebrow, { position: 'absolute', color: '#000', top: 1, left: -1 }]}>PASS & PLAY</Text>
        <Text style={[s.eyebrow, { position: 'absolute', color: '#000', top: -1, left: 1 }]}>PASS & PLAY</Text>
        <Text style={s.eyebrow}>PASS & PLAY</Text>
      </View>
      <View>
        <Text style={[s.powerTitle, { position: 'absolute', color: '#000', top: 2, left: 2 }]}>Emoji Power+</Text>
        <Text style={[s.powerTitle, { position: 'absolute', color: '#000', top: 2, left: -2 }]}>Emoji Power+</Text>
        <Text style={[s.powerTitle, { position: 'absolute', color: '#000', top: -2, left: 2 }]}>Emoji Power+</Text>
        <Text style={s.powerTitle}>Emoji Power+</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  powerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 105,
    paddingBottom: 8,
  },
  eyebrow: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  powerTitle: {
    color: '#ffd700',
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});
