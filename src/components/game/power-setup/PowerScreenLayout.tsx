import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SharedBottomNav } from '../../../fresh/shared/SharedBottomNav';
import { GildedButton } from '../SoloResultOverlay/GildedButton';
import { EP1Section } from '../../power-selection/EP1Section';
import { CARD_SIZE } from '../../power-selection/powerCardStyles';
import { EP1_IMAGES } from '../../power-selection/ep1Config';
import { BG, SLOT1, SLOT2 } from './constants';
import type { BattlePowerId, Profile } from '../../../types';

type Props = {
  headerLogo: React.ReactNode;
  playerLabel: string;
  slot1Id: BattlePowerId | null;
  slot2Id: BattlePowerId | null;
  onCardSelect: (id: BattlePowerId) => void;
  onCardRemove: (id: BattlePowerId) => void;
  actionLabel: string;
  onAction: () => void;
  p1Profile: Profile | null;
  p2Profile: Profile | null;
  onBack: () => void;
  bottomInset: number;
};

export function PowerScreenLayout({
  headerLogo,
  playerLabel,
  slot1Id,
  slot2Id,
  onCardSelect,
  onCardRemove,
  actionLabel,
  onAction,
  p1Profile,
  p2Profile,
  onBack,
  bottomInset,
}: Props) {
  const { height } = useWindowDimensions();

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { marginTop: -height * 0.02, paddingBottom: 72 + bottomInset }]}
      >
        <View style={styles.header}>
          {headerLogo}
          <Text style={styles.subtitle}>{playerLabel}</Text>
        </View>

        <View style={styles.slotRow}>
          <View style={styles.slotWrapper}>
            <Image
              source={slot1Id ? EP1_IMAGES[slot1Id] : SLOT1}
              style={styles.slotImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.slotWrapper}>
            <Image
              source={slot2Id ? EP1_IMAGES[slot2Id] : SLOT2}
              style={styles.slotImg}
              resizeMode="contain"
            />
          </View>
        </View>

        <EP1Section
          slot1={slot1Id}
          slot2={slot2Id}
          onSelect={onCardSelect}
          onRemove={onCardRemove}
        />

        <GildedButton
          label={actionLabel}
          icon="▶"
          primary
          onPress={onAction}
          style={{ marginHorizontal: 16, marginTop: height * 0.12, transform: [{ scale: 1.30 }] }}
        />
      </ScrollView>

      <View style={styles.navBar}>
        <SharedBottomNav
          profileName={p1Profile?.name ?? 'P1'}
          profileAvatar={p1Profile?.avatar ?? '🙂'}
          profileColor={(p1Profile?.color ?? 'sunset') as any}
          profileRoleLabel="P1"
          secondProfileName={p2Profile?.name ?? 'P2'}
          secondProfileAvatar={p2Profile?.avatar ?? '🙂'}
          secondProfileColor={(p2Profile?.color ?? 'ocean') as any}
          secondProfileRoleLabel="P2"
          onBackPress={onBack}
          onHowToPress={() => {}}
          bottomInset={bottomInset}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { alignItems: 'center', paddingHorizontal: 4 },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  header: { alignItems: 'center', paddingTop: 8 },
  subtitle: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 4,
    marginBottom: 12,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 10,
    marginBottom: 8,
  },
  slotWrapper: {
    width: CARD_SIZE,
    aspectRatio: 1,
    borderRadius: 12,
    shadowColor: '#7B2FBE',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  slotImg: {
    width: '100%',
    height: '100%',
  },
});
