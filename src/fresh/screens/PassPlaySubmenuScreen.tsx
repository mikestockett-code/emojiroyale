import React, { useMemo } from 'react';
import { Alert, Image, ImageBackground, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PassPlaySubmenuNavigation } from '../types/navigation';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import WagerCardDeck from '../../components/game/WagerCardDeck';
import { PassPlayPowerP1Screen, PassPlayPowerP2Screen } from '../../components/game/power-setup';
import type { Profile } from '../../types';
import { usePassPlaySubmenu } from '../passplay/usePassPlaySubmenu';
import { getPassPlayWagerBlockReason } from '../passplay/passPlaySubmenuValidation';
import { PassPlayPowerHeader } from './PassPlayPowerHeader';
import BG from '../../../assets/backgrounds/backgroundgamearea.png';
import START_IMG from '../../../assets/buttons/start.png';
import { styles } from './passPlaySubmenuStyles';

export default function PassPlaySubmenuScreen({
  onBackToMenu,
  onStartPassPlayGame,
  onOpenProfiles,
  activeProfile,
  secondaryProfile,
}: PassPlaySubmenuNavigation) {
  const insets = useSafeAreaInsets();
  const {
    selectedWager, setSelectedWager,
    setupPhase, setSetupPhase,
    p1Loadout, p2Loadout, setP2Loadout,
    goToP2, buildSetup,
  } = usePassPlaySubmenu(activeProfile?.id ?? null, secondaryProfile?.id ?? null);

  const p1Profile = (activeProfile ?? null) as Profile | null;
  const p2Profile = (secondaryProfile ?? null) as Profile | null;
  const header = useMemo(() => <PassPlayPowerHeader />, []);
  const startBlockReason = getPassPlayWagerBlockReason(selectedWager, activeProfile ?? null, secondaryProfile ?? null);
  const canStart = startBlockReason === null;

  if (setupPhase === 'powerP1') {
    return (
      <PassPlayPowerP1Screen
        headerLogo={header}
        p1Profile={p1Profile}
        p2Profile={p2Profile}
        initialSlots={p1Loadout}
        onConfirm={goToP2}
        onBack={() => setSetupPhase('setup')}
        bottomInset={insets.bottom}
      />
    );
  }

  if (setupPhase === 'powerP2') {
    return (
      <PassPlayPowerP2Screen
        headerLogo={header}
        p1Profile={p1Profile}
        p2Profile={p2Profile}
        initialSlots={p2Loadout}
        onConfirm={(slots) => { setP2Loadout(slots); onStartPassPlayGame(buildSetup(p1Loadout, slots)); }}
        onBack={() => setSetupPhase('powerP1')}
        bottomInset={insets.bottom}
      />
    );
  }

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.root}>
      <View style={styles.centerArea}>
        <View style={[styles.deckWrap, { marginTop: '33%' }]}>
          <WagerCardDeck selectedId={selectedWager} onSelect={setSelectedWager} />
          <View style={styles.dotRow}>
            {['none', 'epic', 'legendary'].map((id) => (
              <View key={id} style={[styles.dot, selectedWager === id && styles.dotActive]} />
            ))}
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => {
          if (startBlockReason) {
            Alert.alert('Cannot Start Yet', startBlockReason);
            return;
          }
          setSetupPhase('powerP1');
        }}
        style={({ pressed }) => [
          styles.startBtn,
          !canStart && { opacity: 0.35 },
          pressed && canStart && { opacity: 0.75 },
        ]}
      >
        <Image
          source={START_IMG}
          style={[styles.startImg, { transform: [{ perspective: 400 }, { rotateX: '25deg' }] }]}
          resizeMode="contain"
        />
      </Pressable>

      {startBlockReason ? (
        <Text style={styles.missingPlayersText}>{startBlockReason}</Text>
      ) : null}

      <View style={styles.bottomNavWrap}>
        <SharedBottomNav
          profileName={activeProfile?.name ?? 'Choose P1'}
          profileAvatar={activeProfile?.avatar ?? '🙂'}
          profileColor={activeProfile?.color ?? 'sunset'}
          profileRoleLabel="P1"
          secondProfileName={secondaryProfile?.name ?? 'Choose P2'}
          secondProfileAvatar={secondaryProfile?.avatar ?? '🙂'}
          secondProfileColor={secondaryProfile?.color ?? 'ocean'}
          secondProfileRoleLabel="P2"
          onBackPress={onBackToMenu}
          onProfilePress={onOpenProfiles}
          onSecondProfilePress={onOpenProfiles}
          onHowToPress={() => {}}
          bottomInset={insets.bottom}
        />
      </View>
    </ImageBackground>
  );
}
