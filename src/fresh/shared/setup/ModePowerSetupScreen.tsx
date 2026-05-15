import React from 'react';
import { Image, ImageBackground, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedBottomNav } from '../SharedBottomNav';
import { GildedButton } from '../GameResultOverlay/GildedButton';
import { BATTLE_TEST_POWERS } from '../../../data/battlePowers';
import type { BattlePowerId, BattlePowerSlotLoadout, Profile, StickerId } from '../../../types';
import type { FreshProfile } from '../../profile/types';
import { useAudioContext } from '../../audio/AudioContext';
import { theme } from '../luxuryTheme';
import { EPI_CARD_SIZE, styles } from './ModePowerSetupScreen.styles';
import { PowerSection } from './PowerSection';
import { usePowerSlots } from './usePowerSlots';

const BG = require('../../../../assets/backgrounds/sharedbackgroundpurplegrad.png');
const SLOT1 = require('../../../../assets/PowersSlots/slot1.png');
const SLOT2 = require('../../../../assets/PowersSlots/slot2.png');
const START_BUTTON_IMG = require('../../../../assets/buttons/start.png');
const START_IMAGE_LABELS = new Set(['START GAME', 'START BATTLE', 'START MATCH →', 'START MATCH']);
const EP1_POWER_ORDER: BattlePowerId[] = [
  'power-torture-rack',
  'power-remove-emoji',
  'power-clear-row',
  'power-clear-column',
  'power-four-square',
  'power-tornado',
];
const EPI_POWER_ORDER: BattlePowerId[] = [
  'power-clock-freeze',
  'power-plus-10-seconds',
  'power-reverse-time',
  'power-rerack',
];
const POWER_BY_ID = Object.fromEntries(BATTLE_TEST_POWERS.map((power) => [power.id, power]));
const POWER_IMAGES = Object.fromEntries(BATTLE_TEST_POWERS.map((power) => [power.id, power.imageSource]));
const EP1_POWERS = EP1_POWER_ORDER.map((powerId) => POWER_BY_ID[powerId]);
const EPI_POWERS = EPI_POWER_ORDER.map((powerId) => POWER_BY_ID[powerId]);

type ModePowerSetupProfile = Profile | FreshProfile | null;

type Props = {
  playerLabel: string;
  actionLabel: string;
  p1Profile: ModePowerSetupProfile;
  p2Profile?: ModePowerSetupProfile;
  initialSlots?: BattlePowerSlotLoadout;
  allowEpi?: boolean;
  albumCounts?: Record<StickerId, number>;
  playConfirmSound?: boolean;
  onConfirm: (slots: BattlePowerSlotLoadout) => void;
  onBack: () => void;
};

function ShadowText({ variant, children }: { variant: 'eyebrow' | 'displayTitle'; children: string }) {
  const textStyle = theme[variant];

  return (
    <View>
      <Text style={[textStyle, { position: 'absolute', color: '#000', top: 2, left: 2 }]}>{children}</Text>
      <Text style={[textStyle, { position: 'absolute', color: '#000', top: 2, left: -2 }]}>{children}</Text>
      <Text style={[textStyle, { position: 'absolute', color: '#000', top: -2, left: 2 }]}>{children}</Text>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}

export function ModePowerSetupScreen({
  playerLabel,
  actionLabel,
  p1Profile,
  p2Profile = null,
  initialSlots,
  allowEpi = false,
  albumCounts,
  playConfirmSound = true,
  onConfirm,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { playSound } = useAudioContext();
  const { slot1, slot2, loadout, assignSlot } = usePowerSlots(initialSlots);
  const useStartImageButton = START_IMAGE_LABELS.has(actionLabel);
  const startButtonMarginTop = height * (actionLabel === 'START BATTLE' ? 0.07 : 0.12);

  const confirm = () => {
    if (playConfirmSound) playSound('rumble');
    onConfirm(loadout);
  };

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.screenRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.setupScroll, { marginTop: -height * 0.02, paddingBottom: 72 + insets.bottom }]}
      >
        <View style={styles.powerHeader}>
          <ShadowText variant="displayTitle">Emoji Power+</ShadowText>
          <Text style={styles.powerSetupSubtitle}>{playerLabel}</Text>
        </View>

        <View style={styles.slotRow}>
          <View style={styles.slotWrapper}>
            <Image source={slot1 ? POWER_IMAGES[slot1] : SLOT1} style={styles.slotImg} resizeMode="contain" />
          </View>
          <View style={styles.slotWrapper}>
            <Image source={slot2 ? POWER_IMAGES[slot2] : SLOT2} style={styles.slotImg} resizeMode="contain" />
          </View>
        </View>

        <PowerSection
          title="EMOJI POWER +"
          subtitle="Once per round"
          rows={[
            { cards: EP1_POWERS.slice(0, 3) },
            { cards: EP1_POWERS.slice(3, 6), marginTop: height * 0.05 },
          ]}
          slot1={slot1}
          slot2={slot2}
          albumCounts={albumCounts}
          onAssignSlot={assignSlot}
        />

        {allowEpi ? (
          <PowerSection
            title="EMOJI POWER"
            subtitle="Use as many as you own each round"
            rows={[{ cards: EPI_POWERS }]}
            slot1={slot1}
            slot2={slot2}
            albumCounts={albumCounts}
            onAssignSlot={assignSlot}
            headerMarginTop={16}
            cardSize={EPI_CARD_SIZE}
          />
        ) : null}

        {useStartImageButton ? (
          <Pressable
            onPress={() => {
              playSound('button');
              confirm();
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
            onPress={confirm}
            style={{ marginHorizontal: 16, marginTop: startButtonMarginTop, transform: [{ scale: 1.3 }] }}
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
          bottomInset={insets.bottom}
        />
      </View>
    </ImageBackground>
  );
}
