import React from 'react';
import { Text, View } from 'react-native';
import { profileStyles as styles } from './profileStyles';

export function ProfileHeader() {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerSpacer} />
      <Text style={styles.title}>Profiles</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}
