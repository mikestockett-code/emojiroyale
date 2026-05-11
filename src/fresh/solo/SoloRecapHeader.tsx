import React from 'react';
import { Text } from 'react-native';
import { soloRecapStyles as styles } from './soloRecapStyles';

export function SoloRecapHeader() {
  return (
    <Text style={[styles.resultTitle, styles.victoryColor]}>
      SOLO RECAP
    </Text>
  );
}
