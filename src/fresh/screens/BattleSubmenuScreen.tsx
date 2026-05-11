import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GildedButton } from '../shared/GameResultOverlay/GildedButton';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import { SharedSubmenuShell } from '../shared/SharedSubmenuShell';
import { EP1Section } from '../../components/power-selection/EP1Section';
import { EPISection } from '../../components/power-selection/EPISection';
import { usePowerSlots } from '../../components/power-selection/usePowerSlots';
import { EP1_IMAGES } from '../../components/power-selection/ep1Config';
import { EPI_IMAGES } from '../../components/power-selection/epiConfig';
import type { BattleSubmenuNavigation } from '../types/navigation';
import { submenuStyles as styles } from '../shared/submenuStyles';
import { useAudioContext } from '../audio/AudioContext';

import BG    from '../../../assets/backgrounds/sharedbackgroundpurplegrad.png';
import SLOT1 from '../../../assets/PowersSlots/slot1.png';
import SLOT2 from '../../../assets/PowersSlots/slot2.png';
const ALL_IMG = { ...EP1_IMAGES, ...EPI_IMAGES };

export default function BattleSubmenuScreen({ onBackToMenu, onStartBattleGame, activeProfile }: BattleSubmenuNavigation) {
  const insets = useSafeAreaInsets();
  const { playSound } = useAudioContext();
  const { slot1, slot2, loadout, select, remove } = usePowerSlots();

  return (
    <SharedSubmenuShell
      backgroundSource={BG}
      bottomNav={(
        <SharedBottomNav
          onBackPress={onBackToMenu}
          profileName={activeProfile?.name ?? ''}
          profileAvatar={activeProfile?.avatar ?? '🙂'}
          profileColor={activeProfile?.color as any}
          onHowToPress={() => {}}
          bottomInset={insets.bottom}
        />
      )}
    >
      <ScrollView
        contentContainerStyle={[styles.setupScroll, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 72 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.setupHeader}>
          <Text style={styles.setupEyebrow}>BATTLE MODE</Text>
          <Text style={styles.setupTitle}>Power Setup</Text>
          {activeProfile ? <Text style={styles.setupProfileName}>{activeProfile.avatar}  {activeProfile.name}</Text> : null}
        </View>

        <View style={styles.slotRow}>
          <View style={styles.slotWrapper}>
            <Image source={slot1 ? ALL_IMG[slot1] : SLOT1} style={styles.slotImg} resizeMode="contain" />
          </View>
          <View style={styles.slotWrapper}>
            <Image source={slot2 ? ALL_IMG[slot2] : SLOT2} style={styles.slotImg} resizeMode="contain" />
          </View>
        </View>

        <EP1Section slot1={slot1} slot2={slot2} albumCounts={undefined} onSelect={select} onRemove={remove} />
        <EPISection slot1={slot1} slot2={slot2} albumCounts={undefined} onSelect={select} onRemove={remove} />

        <GildedButton
          label="START BATTLE"
          icon="▶"
          primary
          onPress={() => {
            playSound('rumble');
            onStartBattleGame({ playerProfileId: activeProfile?.id ?? null, powerSlotIds: loadout });
          }}
          style={{ marginHorizontal: 24, marginTop: 20 }}
        />
      </ScrollView>
    </SharedSubmenuShell>
  );
}
