import React from 'react';
import { Text, View } from 'react-native';
import { profileScreenStyles as styles } from './ProfileScreen.styles';

export function ProfileHeader() {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerSpacer} />
      <Text style={styles.title}>Profiles</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}
