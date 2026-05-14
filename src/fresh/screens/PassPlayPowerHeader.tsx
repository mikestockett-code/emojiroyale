import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../fresh/shared/luxuryTheme';

export function PassPlayPowerHeader() {
  return (
    <View style={s.powerHeader}>
      <View>
        <Text style={[theme.eyebrow, { position: 'absolute', color: '#000', top: 1, left: 1 }]}>PASS & PLAY</Text>
        <Text style={[theme.eyebrow, { position: 'absolute', color: '#000', top: 1, left: -1 }]}>PASS & PLAY</Text>
        <Text style={[theme.eyebrow, { position: 'absolute', color: '#000', top: -1, left: 1 }]}>PASS & PLAY</Text>
        <Text style={theme.eyebrow}>PASS & PLAY</Text>
      </View>
      <View>
        <Text style={[theme.displayTitle, { position: 'absolute', color: '#000', top: 2, left: 2 }]}>Emoji Power+</Text>
        <Text style={[theme.displayTitle, { position: 'absolute', color: '#000', top: 2, left: -2 }]}>Emoji Power+</Text>
        <Text style={[theme.displayTitle, { position: 'absolute', color: '#000', top: -2, left: 2 }]}>Emoji Power+</Text>
        <Text style={theme.displayTitle}>Emoji Power+</Text>
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
});
