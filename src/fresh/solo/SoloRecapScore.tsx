import React from 'react';
import { Text, View } from 'react-native';
import { soloRecapStyles as styles } from './soloRecapStyles';

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
        {isBetter && <Text style={styles.newBestBadge}>NEW BEST!</Text>}
      </View>
    </View>
  );
}
