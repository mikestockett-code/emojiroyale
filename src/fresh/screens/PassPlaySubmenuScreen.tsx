import React from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PassPlaySubmenuNavigation } from '../types/navigation';
import { SharedBottomNav } from '../shared/SharedBottomNav';
import { CarouselSubmenuScreen } from '../shared/submenu/CarouselSubmenuScreen';
import WagerCardDeck from '../../components/game/WagerCardDeck';
import { ModePowerSetupScreen } from '../shared/setup/ModePowerSetupScreen';
import { useGoldenPhoenixHolder } from '../../hooks/useGoldenPhoenixHolder';
import { usePassPlaySubmenu } from '../passplay/usePassPlaySubmenu';
import { getPassPlayWagerBlockReason } from '../passplay/passPlaySubmenuValidation';
import BG from '../../../assets/backgrounds/backgroundgamearea.png';

export default function PassPlaySubmenuScreen({
  onBackToMenu,
  onStartPassPlayGame,
  onOpenProfiles,
  activeProfile,
  secondaryProfile,
  entryMode = 'normal',
}: PassPlaySubmenuNavigation) {
  const insets = useSafeAreaInsets();
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
    activeProfile?.albumCounts ?? {},
    secondaryProfile?.albumCounts ?? {},
  );

  const startBlockReason = getPassPlayWagerBlockReason(selectedWager, activeProfile ?? null, secondaryProfile ?? null, {
    goldenPhoenixRequired: isGoldenPhoenixEntry,
    goldenPhoenixHolderName,
  });
  const canStart = startBlockReason === null;

  if (setupPhase === 'powerP1') {
    return (
      <ModePowerSetupScreen
        key="power-p1"
        playerLabel="PLAYER ONE  •  PICK 2"
        actionLabel="PASS TO P2 →"
        p1Profile={activeProfile ?? null}
        p2Profile={secondaryProfile ?? null}
        initialSlots={p1Loadout}
        onConfirm={goToP2}
        onBack={() => setSetupPhase('setup')}
      />
    );
  }

  if (setupPhase === 'powerP2') {
    return (
      <ModePowerSetupScreen
        key="power-p2"
        playerLabel="PLAYER TWO  •  PICK 2"
        actionLabel="START MATCH →"
        p1Profile={activeProfile ?? null}
        p2Profile={secondaryProfile ?? null}
        initialSlots={p2Loadout}
        onConfirm={(slots) => {
          setP2Loadout(slots);
          onStartPassPlayGame(buildSetup(p1Loadout, slots));
        }}
        onBack={() => setSetupPhase('powerP1')}
      />
    );
  }

  return (
    <CarouselSubmenuScreen
      backgroundSource={BG}
      deckWrapStyle={{ marginTop: '33%' }}
      deck={(
        <WagerCardDeck
          selectedId={isGoldenPhoenixEntry ? 'legendary' : selectedWager}
          onSelect={isGoldenPhoenixEntry ? () => setSelectedWager('legendary') : setSelectedWager}
          variant={isGoldenPhoenixEntry ? 'goldenPhoenix' : 'default'}
        />
      )}
      dots={(isGoldenPhoenixEntry ? ['legendary'] : ['none', 'epic', 'legendary'])}
      selectedDotId={selectedWager}
      statusText={isGoldenPhoenixEntry ? 'Golden Phoenix Trophy Challenge' : null}
      startDisabled={!canStart}
      startMessage={startBlockReason}
      messageVariant="pill"
      onStart={() => {
        if (startBlockReason) {
          Alert.alert('Cannot Start Yet', startBlockReason);
          return;
        }
        setSetupPhase('powerP1');
      }}
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
    />
  );
}
