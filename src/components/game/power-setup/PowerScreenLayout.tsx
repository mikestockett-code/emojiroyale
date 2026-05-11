import React from 'react';
import { Image, ImageBackground, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SharedBottomNav } from '../../../fresh/shared/SharedBottomNav';
import { GildedButton } from '../../../fresh/shared/GameResultOverlay/GildedButton';
import { EP1Section } from '../../power-selection/EP1Section';
import { EP1_IMAGES } from '../../power-selection/ep1Config';
import { submenuStyles as styles } from '../../../fresh/shared/submenuStyles';
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
    <ImageBackground source={BG} resizeMode="cover" style={styles.screenRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.setupScroll, { marginTop: -height * 0.02, paddingBottom: 72 + bottomInset }]}
      >
        <View style={styles.powerSetupHeader}>
          {headerLogo}
          <Text style={styles.powerSetupSubtitle}>{playerLabel}</Text>
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
