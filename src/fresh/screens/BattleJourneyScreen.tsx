import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GildedButton } from '../shared/GameResultOverlay/GildedButton';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import { SharedSubmenuShell } from '../shared/SharedSubmenuShell';
import { useBattleJourneyState } from '../battle/useBattleJourneyState';
import type { FreshProfile } from '../profile/types';
import { submenuStyles as styles } from '../shared/submenuStyles';
import type { BattleJourneyStageNumber } from '../battle/battleRewardRules';

const BG = require('../../../assets/backgrounds/sharedbackgroundpurplegrad.png');
const INTRO_PAGE = require('../../../assets/albumgeneralstuff/albumbooks/battle_mode_full_pages_not_puzzle/battle_mode_full_pages/intro_full_page.png');

type Props = {
  onBackToMenu: () => void;
  onProceedToSetup: (stageNumber: BattleJourneyStageNumber) => void;
  activeProfile?: FreshProfile | null;
};

export default function BattleJourneyScreen({ onBackToMenu, onProceedToSetup, activeProfile }: Props) {
  const insets = useSafeAreaInsets();
  const {
    isReady,
    showIntro,
    save,
    hasSave,
    dismissIntro,
    startStageOne,
    restartStageOne,
  } = useBattleJourneyState();

  const stageLabel = save ? `Todd - Stage ${save.stageNumber}` : 'Todd - Stage 1';

  const beginJourney = async () => {
    await startStageOne();
    onProceedToSetup(1);
  };

  const continueJourney = () => {
    if (!hasSave) return;
    onProceedToSetup(save?.stageNumber ?? 1);
  };

  const handleRestartStageOne = async () => {
    await restartStageOne();
  };

  if (!isReady) return null;

  return (
    <SharedSubmenuShell
      backgroundSource={BG}
      bottomNav={(
        <SharedBottomNav
          profileName={activeProfile?.name ?? 'Profile'}
          profileAvatar={activeProfile?.avatar ?? '🙂'}
          profileColor={activeProfile?.color ?? 'sunset'}
          profileRoleLabel="Journey"
          profileBadgeText={save ? `S${save.stageNumber}` : 'New'}
          scoreLabel="Rolls"
          scoreValue={3}
          onBackPress={onBackToMenu}
          onHowToPress={() => {}}
          bottomInset={insets.bottom}
        />
      )}
    >
      <View style={[styles.journeyContent, { paddingTop: insets.top + 36 }]}>
        <Text style={styles.setupEyebrow}>BATTLE JOURNEY</Text>
        <Text style={styles.journeyTitle}>Todd Awaits</Text>
        <Text style={styles.journeyStageText}>{stageLabel}</Text>

        <View style={styles.journeyCpuFrame}>
          <Image source={require('../../../assets/BattleModeCpuEgos/todd.png')} style={styles.journeyCpuImage} resizeMode="contain" />
        </View>

        <View style={styles.journeyButtonStack}>
          <GildedButton
            label="START JOURNEY"
            icon="▶"
            primary
            onPress={beginJourney}
          />

          <GildedButton
            label="CONTINUE JOURNEY"
            icon="↻"
            onPress={continueJourney}
            style={!hasSave ? styles.journeyDisabledButton : undefined}
          />

          <GildedButton
            label="RESTART STAGE 1"
            icon="⟲"
            onPress={handleRestartStageOne}
          />
        </View>
      </View>

      {showIntro ? (
        <View style={styles.journeyIntroOverlay}>
          <Image source={INTRO_PAGE} style={styles.journeyIntroPage} resizeMode="contain" />
          <Pressable
            onPress={dismissIntro}
            style={({ pressed }) => [styles.journeyIntroButton, pressed && styles.pressed]}
          >
            <Text style={styles.journeyIntroButtonText}>ENTER BATTLE JOURNEY</Text>
          </Pressable>
        </View>
      ) : null}
    </SharedSubmenuShell>
  );
}
