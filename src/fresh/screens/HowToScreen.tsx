import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../shared/luxuryTheme';
import { tempButtonStyles } from '../shared/tempButtonStyles';

type Props = {
  onBackToMenu: () => void;
};

export default function HowToScreen({ onBackToMenu }: Props) {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>How To Play</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Goal</Text>
          <Text style={styles.cardBody}>
            Build winning patterns on the board before your opponent does.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Solo</Text>
          <Text style={styles.cardBody}>
            Practice / No Wager means no emoji sticker from your album is being wagered.
          </Text>
          <Text style={styles.cardBody}>
            Epic Lite means 25 common emoji stickers are wagered.
          </Text>
          <Text style={styles.cardBody}>
            Epic means 1 epic sticker from your album is wagered.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shared Rules</Text>
          <Text style={styles.cardBody}>
            The board and rack are shared systems across modes.
          </Text>
          <Text style={styles.cardBody}>
            Some features are still being rebuilt, so this screen is a temporary guide.
          </Text>
        </View>

        <Pressable
          onPress={onBackToMenu}
          style={({ pressed }) => [styles.backBtn, pressed && theme.pressed]}
        >
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#120d1d',
  },
  scroll: {
    paddingTop: 72,
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 18,
  },
  heading: {
    ...theme.title,
    textAlign: 'center',
  },
  card: {
    ...theme.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.gold,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.75)',
  },
  backBtn: {
    ...tempButtonStyles.primaryButton,
    marginTop: 6,
  },
  backBtnText: {
    ...tempButtonStyles.primaryButtonText,
  },
});
