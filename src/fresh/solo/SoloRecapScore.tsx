import React from 'react';
import { Text, View } from 'react-native';
import { luxuryResultStyles as styles } from '../shared/luxuryResultStyles';

type Props = {
  roundScore: number;
  profileBest?: number;
};

export function SoloRecapScore({ roundScore, profileBest }: Props) {
  const isBetter = roundScore > (profileBest ?? 0);

  return (
    <View style={styles.card}>
      <View style={styles.scoreCol}>
        <Text style={styles.scoreLabel}>THIS RUN</Text>
        <Text style={styles.scoreValue}>{roundScore.toLocaleString()}</Text>
      </View>
      <View style={styles.scoreDivider} />
      <View style={styles.scoreCol}>
        <Text style={styles.scoreLabel}>PROFILE BEST</Text>
        <Text style={[styles.scoreValue, isBetter && styles.newBest]}>
          {profileBest != null ? profileBest.toLocaleString() : '-'}
        </Text>
      </View>
    </View>
  );
}
