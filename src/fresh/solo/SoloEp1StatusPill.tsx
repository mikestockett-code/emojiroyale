import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  effectLabel: string;
  onClear: () => void;
};

export function SoloEp1StatusPill({ visible, effectLabel, onClear }: Props) {
  if (!visible) return null;

  return (
    <Pressable onPress={onClear} style={styles.root}>
      <Text style={styles.eyebrow}>RANDOM POWER</Text>
      <Text style={styles.label}>{effectLabel}</Text>
      <Text style={styles.hint}>tap to clear</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 8,
    top: '34%',
    zIndex: 99,
    backgroundColor: 'rgba(24,9,10,0.92)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  eyebrow: {
    color: '#fef3c7',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0,
    textAlign: 'center',
  },
  label: {
    color: '#fca5a5',
    fontWeight: '900',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  hint: {
    color: '#fca5a5',
    fontSize: 9,
    marginTop: 2,
  },
});

