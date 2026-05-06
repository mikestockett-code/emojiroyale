import React from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import { BattleModeCardDeck } from '../../components/game/BattleModeCardDeck';
import { useBattleModeSelect } from './useBattleModeSelect';
import { ss, BG, START_IMG } from './battleModeSelectStyles';
import type { FreshProfile } from '../profile/types';

type Props = {
  onBackToMenu: () => void;
  onProceedToSetup: () => void;
  activeProfile?: FreshProfile | null;
};

export default function BattleModeSelectScreen({ onBackToMenu, onProceedToSetup, activeProfile }: Props) {
  const { height } = useWindowDimensions();
  const {
    selectedMode,
    setSelectedMode,
    showExplanation,
    neverShow,
    toggleNeverShow,
    handleDismiss,
  } = useBattleModeSelect();

  return (
    <ImageBackground source={BG} style={ss.root} resizeMode="cover">

      <View style={ss.deckArea}>
        <BattleModeCardDeck selectedId={selectedMode} onSelect={setSelectedMode} />
      </View>

      <Pressable
        onPress={onProceedToSetup}
        style={({ pressed }) => [ss.startBtn, { marginBottom: height * 0.015 }, pressed && { opacity: 0.75 }]}
      >
        <Image source={START_IMG} style={ss.startImg} resizeMode="contain" />
      </Pressable>

      <View style={ss.bottomNavWrap}>
        <SharedBottomNav
          profileName={activeProfile?.name ?? ''}
          profileAvatar={activeProfile?.avatar ?? '🙂'}
          profileColor={activeProfile?.color as any}
          onBackPress={onBackToMenu}
          onHowToPress={() => {}}
          scoreValue={0}
        />
      </View>

      <Modal visible={showExplanation} transparent animationType="fade" statusBarTranslucent>
        <View style={ss.overlay}>
          <View style={ss.card}>
            <Text style={ss.cardTitle}>⚔️ BATTLE MODE</Text>

            <Text style={ss.cardBody}>
              {"Battle Mode is a single-player challenge where you face CPU opponents one by one, each with its own style and rewards. You pay Epic stickers to enter, and if you win, you get your wager back plus that opponent's bonus rewards.\n\n"}
              {"As you progress, you unlock harder tiers — Legendary and then Platinum — where the rules get stricter (weaker wins don't count) and the rewards become more unique.\n\n"}
              {"Each step up raises the risk, but also gives access to different and rarer items."}
            </Text>

            <Pressable onPress={toggleNeverShow} style={ss.checkRow}>
              <View style={[ss.checkbox, neverShow && ss.checkboxChecked]}>
                {neverShow ? <Text style={ss.checkmark}>✓</Text> : null}
              </View>
              <Text style={ss.checkLabel}>Never show me again</Text>
            </Pressable>

            <Pressable
              onPress={handleDismiss}
              style={({ pressed }) => [ss.dismissBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={ss.dismissText}>LET'S GO</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </ImageBackground>
  );
}
