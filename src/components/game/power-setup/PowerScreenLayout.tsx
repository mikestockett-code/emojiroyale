import React from 'react';
import { Image, ImageBackground, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SharedBottomNav } from '../../../fresh/shared/SharedBottomNav';
import { GildedButton } from '../../../fresh/shared/GameResultOverlay/GildedButton';
import { useAudioContext } from '../../../fresh/audio/AudioContext';
import { EP1Section } from '../../power-selection/EP1Section';
import { EPISection } from '../../power-selection/EPISection';
import { EP1_IMAGES } from '../../power-selection/ep1Config';
import { EPI_IMAGES } from '../../power-selection/epiConfig';
import { styles } from './PowerScreenLayout.styles';
import { BG, SLOT1, SLOT2 } from './constants';
import type { BattlePowerId, Profile, StickerId } from '../../../types';

const POWER_IMAGES = { ...EP1_IMAGES, ...EPI_IMAGES };
const START_BUTTON_IMG = require('../../../../assets/buttons/start.png');
const START_IMAGE_LABELS = new Set(['START GAME', 'START BATTLE', 'START MATCH →', 'START MATCH']);

type Props = {
  headerLogo: React.ReactNode;
  playerLabel: string;
  slot1Id: BattlePowerId | null;
  slot2Id: BattlePowerId | null;
  onAssignSlot: (slotId: 'slot1' | 'slot2', id: BattlePowerId | null) => void;
  allowEpi?: boolean;
  albumCounts?: Record<StickerId, number>;
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
  onAssignSlot,
  allowEpi = false,
  albumCounts,
  actionLabel,
  onAction,
  p1Profile,
  p2Profile,
  onBack,
  bottomInset,
}: Props) {
  const { height } = useWindowDimensions();
  const { playSound } = useAudioContext();
  const useStartImageButton = START_IMAGE_LABELS.has(actionLabel);
  const startButtonMarginTop = height * (actionLabel === 'START BATTLE' ? 0.07 : 0.12);

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
              source={slot1Id ? POWER_IMAGES[slot1Id] : SLOT1}
              style={styles.slotImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.slotWrapper}>
            <Image
              source={slot2Id ? POWER_IMAGES[slot2Id] : SLOT2}
              style={styles.slotImg}
              resizeMode="contain"
            />
          </View>
        </View>

        <EP1Section
          slot1={slot1Id}
          slot2={slot2Id}
          onAssignSlot={onAssignSlot}
        />

        {allowEpi ? (
          <EPISection
            slot1={slot1Id}
            slot2={slot2Id}
            albumCounts={albumCounts}
            onAssignSlot={onAssignSlot}
          />
        ) : null}

        {useStartImageButton ? (
          <Pressable
            onPress={() => {
              playSound('button');
              onAction();
            }}
            style={({ pressed }) => [
              styles.startImageButton,
              { marginTop: startButtonMarginTop },
              pressed && styles.startImageButtonPressed,
            ]}
          >
            <Image source={START_BUTTON_IMG} style={styles.startImage} resizeMode="contain" />
          </Pressable>
        ) : (
          <GildedButton
            label={actionLabel}
            icon="▶"
            primary
            onPress={onAction}
            style={{ marginHorizontal: 16, marginTop: startButtonMarginTop, transform: [{ scale: 1.30 }] }}
          />
        )}
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
