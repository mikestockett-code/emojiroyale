import React, { useMemo } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PassPlaySubmenuNavigation } from '../types/navigation';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import { SharedSubmenuShell } from '../shared/SharedSubmenuShell';
import WagerCardDeck from '../../components/game/WagerCardDeck';
import { PassPlayPowerScreen } from '../../components/game/power-setup';
import type { Profile } from '../../types';
import { useGoldenPhoenixHolder } from '../../hooks/useGoldenPhoenixHolder';
import { usePassPlaySubmenu } from '../passplay/usePassPlaySubmenu';
import { getPassPlayWagerBlockReason } from '../passplay/passPlaySubmenuValidation';
import { PassPlayPowerHeader } from './PassPlayPowerHeader';
import { useAudioContext } from '../audio/AudioContext';
import BG from '../../../assets/backgrounds/backgroundgamearea.png';
import START_IMG from '../../../assets/buttons/start.png';
import { submenuStyles as styles } from '../shared/submenuStyles';

export default function PassPlaySubmenuScreen({
  onBackToMenu,
  onStartPassPlayGame,
  onOpenProfiles,
  activeProfile,
  secondaryProfile,
  entryMode = 'normal',
}: PassPlaySubmenuNavigation) {
  const insets = useSafeAreaInsets();
  const { playSound } = useAudioContext();
  const isGoldenPhoenixEntry = entryMode === 'goldenPhoenix';
  const goldenPhoenixHolderName = useGoldenPhoenixHolder();
  const {
    selectedWager, setSelectedWager,
    setupPhase, setSetupPhase,
    p1Loadout, p2Loadout, setP2Loadout,
    goToP2, buildSetup,
  } = usePassPlaySubmenu(
    activeProfile?.id ?? null,
    secondaryProfile?.id ?? null,
    isGoldenPhoenixEntry ? 'legendary' : 'none',
  );

  const p1Profile = (activeProfile ?? null) as Profile | null;
  const p2Profile = (secondaryProfile ?? null) as Profile | null;
  const header = useMemo(() => <PassPlayPowerHeader />, []);
  const startBlockReason = getPassPlayWagerBlockReason(selectedWager, activeProfile ?? null, secondaryProfile ?? null, {
    goldenPhoenixRequired: isGoldenPhoenixEntry,
    goldenPhoenixHolderName,
  });
  const canStart = startBlockReason === null;

  if (setupPhase === 'powerP1') {
    return (
      <PassPlayPowerScreen
        headerLogo={header}
        playerLabel="PLAYER ONE  •  PICK 2"
        actionLabel="PASS TO P2 →"
        p1Profile={p1Profile}
        p2Profile={p2Profile}
        initialSlots={p1Loadout}
        onConfirm={goToP2}
        onBack={() => setSetupPhase('setup')}
      />
    );
  }

  if (setupPhase === 'powerP2') {
    return (
      <PassPlayPowerScreen
        headerLogo={header}
        playerLabel="PLAYER TWO  •  PICK 2"
        actionLabel="START MATCH →"
        p1Profile={p1Profile}
        p2Profile={p2Profile}
        initialSlots={p2Loadout}
        onConfirm={(slots) => {
          setP2Loadout(slots);
          playSound('rumble');
          onStartPassPlayGame(buildSetup(p1Loadout, slots));
        }}
        onBack={() => setSetupPhase('powerP1')}
      />
    );
  }

  return (
    <SharedSubmenuShell
      backgroundSource={BG}
      bottomNav={(
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
      )}
    >
      <View style={styles.deckCenterArea}>
        <View style={[styles.deckWrap, { marginTop: '33%' }]}>
          <WagerCardDeck
            selectedId={isGoldenPhoenixEntry ? 'legendary' : selectedWager}
            onSelect={isGoldenPhoenixEntry ? () => setSelectedWager('legendary') : setSelectedWager}
            variant={isGoldenPhoenixEntry ? 'goldenPhoenix' : 'default'}
          />
          <View style={styles.dotRow}>
            {(isGoldenPhoenixEntry ? ['legendary'] : ['none', 'epic', 'legendary']).map((id) => (
              <View key={id} style={[styles.dot, selectedWager === id && styles.dotActive]} />
            ))}
          </View>
          {isGoldenPhoenixEntry ? (
            <Text style={styles.goldenPhoenixText}>Golden Phoenix Trophy Challenge</Text>
          ) : null}
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
        <Text style={styles.missingText}>{startBlockReason}</Text>
      ) : null}
    </SharedSubmenuShell>
  );
}
