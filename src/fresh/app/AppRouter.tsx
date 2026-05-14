// AppRouter.tsx
// New main router for the rewrite.
//
// Job:
// - Hold current top-level route state.
// - Send traffic to screens.
// - Pass navigation callbacks only.
//
// This file should NOT:
// - Own gameplay logic.
// - Build boards or racks.
// - Hold turn systems.
// - Know rule details for each mode.

import React, { useCallback } from 'react';
import { APP_ROUTES } from './routes';
import MainMenuScreen from '../screens/MainMenuScreen';
import HowToPlayMain from '../screens/how-to/HowToPlayMain';
import HowToSolo from '../screens/how-to/HowToSolo';
import HowToBattle from '../screens/how-to/HowToBattle';
import HowToPassAndPlay from '../screens/how-to/HowToPassAndPlay';
import SoloSubmenuScreen from '../screens/SoloSubmenuScreen';
import PassPlaySubmenuScreen from '../screens/PassPlaySubmenuScreen';
import BattleJourneyScreen from '../screens/BattleJourneyScreen';
import BattleSubmenuScreen from '../screens/BattleSubmenuScreen';
import SoloGameScreen from '../screens/SoloGameScreen';
import PassPlayGameScreen from '../screens/PassPlayGameScreen';
import BattleGameScreen from '../screens/BattleGameScreen';
import MultiplayerLobbyScreen from '../screens/multiplayer/MultiplayerLobbyScreen';
import OnlineGameScreen from '../screens/multiplayer/OnlineGameScreen';
import AlbumScreen from '../screens/AlbumScreen';
import ProfileScreenShell from '../screens/ProfileScreenShell';
import type { FreshProfile, FreshProfileColor } from '../profile/types';
import { useAudioContext } from '../audio/AudioContext';
import { useMultiplayerRoom } from '../../multiplayer/useMultiplayerRoom';
import type { StickerId } from '../../types';
import type { AlbumPuzzleId } from '../album/album.types';
import { useModeRouteState } from './useModeRouteState';

type Props = {
  profiles: FreshProfile[];
  activeProfileId: string | null;
  secondaryProfileId: string | null;
  onCreateProfile: (name: string, avatar: string, color: FreshProfileColor) => { ok: true; profileId: string } | { ok: false; error: string };
  onSetActiveProfile: (profileId: string) => void;
  onSetSecondaryProfile: (profileId: string | null) => void;
  onDeleteProfile: (profileId: string) => void;
  onGrantAlbumSticker: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;
  onGrantAlbumPuzzlePiece: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void;
  onUpdateSoloHighScore: (profileId: string | null | undefined, score: number) => void;
  onSetFavoriteSticker: (profileId: string | null | undefined, stickerId: string | null) => void;
  profilesReady: boolean;
};

export default function AppRouter({
  profiles,
  activeProfileId,
  secondaryProfileId,
  onCreateProfile,
  onSetActiveProfile,
  onSetSecondaryProfile,
  onDeleteProfile,
  onGrantAlbumSticker,
  onGrantAlbumPuzzlePiece,
  onUpdateSoloHighScore,
  onSetFavoriteSticker,
  profilesReady,
}: Props) {
  const { toggleMute } = useAudioContext();
  const mpRoom = useMultiplayerRoom();
  const {
    currentRoute,
    setCurrentRoute,
    profileReturnRoute,
    passPlayEntryMode,
    soloSetup,
    setSoloSetup,
    battleSetup,
    passPlaySetup,
    openProfileScreen,
    openPassPlaySubmenu,
    startSoloGame,
    startPassPlayGame,
    proceedToBattleSetup,
    startBattleGame,
    goToNextBattleStage,
    returnToBattleJourney,
  } = useModeRouteState();
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0] ?? null;
  const secondaryProfile = profiles.find((profile) => profile.id === secondaryProfileId) ?? null;

  const openOnlineGame = useCallback(() => {
    setCurrentRoute(APP_ROUTES.onlineGame);
  }, [setCurrentRoute]);

  if (!profilesReady) {
    return null;
  }

  if (currentRoute === APP_ROUTES.menu) {
    return (
      <MainMenuScreen
        onGoToSoloSubmenu={() => setCurrentRoute(APP_ROUTES.soloSubmenu)}
        onGoToPassPlaySubmenu={() => openPassPlaySubmenu('normal')}
        onGoToMultiplayer={() => setCurrentRoute(APP_ROUTES.multiplayerLobby)}
        onGoToBattleSubmenu={() => setCurrentRoute(APP_ROUTES.battleJourney)}
        onGoToAlbum={() => setCurrentRoute(APP_ROUTES.album)}
        onGoToHowToPlay={() => setCurrentRoute(APP_ROUTES.howTo)}
        onGoToCTA={() => openPassPlaySubmenu('goldenPhoenix')}
        onToggleMute={toggleMute}
        onOpenProfiles={() => openProfileScreen(APP_ROUTES.menu)}
        activeProfile={activeProfile}
      />
    );
  }

  if (currentRoute === APP_ROUTES.howTo) {
    return <HowToPlayMain onBack={() => setCurrentRoute(APP_ROUTES.menu)} />;
  }
  if (currentRoute === APP_ROUTES.howToSolo) {
    return <HowToSolo onBack={() => setCurrentRoute(APP_ROUTES.soloGame)} />;
  }
  if (currentRoute === APP_ROUTES.howToBattle) {
    return <HowToBattle onBack={() => setCurrentRoute(APP_ROUTES.battleGame)} />;
  }
  if (currentRoute === APP_ROUTES.howToPassPlay) {
    return <HowToPassAndPlay onBack={() => setCurrentRoute(APP_ROUTES.passPlayGame)} />;
  }

  if (currentRoute === APP_ROUTES.profile) {
    return (
      <ProfileScreenShell
        onBackToMenu={() => setCurrentRoute(profileReturnRoute)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        secondaryProfileId={secondaryProfileId}
        onCreateProfile={onCreateProfile}
        onSetActiveProfile={onSetActiveProfile}
        onSetSecondaryProfile={onSetSecondaryProfile}
        onDeleteProfile={onDeleteProfile}
      />
    );
  }

  if (currentRoute === APP_ROUTES.soloSubmenu) {
    return (
      <SoloSubmenuScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        onStartSoloGame={startSoloGame}
        onOpenProfiles={() => openProfileScreen(APP_ROUTES.soloSubmenu)}
        activeProfileAvatar={activeProfile?.avatar ?? '🙂'}
        activeProfile={activeProfile}
      />
    );
  }

  if (currentRoute === APP_ROUTES.passPlaySubmenu) {
    return (
      <PassPlaySubmenuScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        onStartPassPlayGame={startPassPlayGame}
        onOpenProfiles={() => openProfileScreen(APP_ROUTES.passPlaySubmenu)}
        activeProfile={activeProfile}
        secondaryProfile={secondaryProfile}
        entryMode={passPlayEntryMode}
      />
    );
  }

  if (currentRoute === APP_ROUTES.multiplayerLobby) {
    return (
      <MultiplayerLobbyScreen
        mpRoom={mpRoom}
        activeProfile={activeProfile}
        onBackToMenu={() => {
          mpRoom.leaveRoom().finally(() => setCurrentRoute(APP_ROUTES.menu));
        }}
        onStartOnlineGame={openOnlineGame}
      />
    );
  }

  if (currentRoute === APP_ROUTES.onlineGame) {
    return (
      <OnlineGameScreen
        mpRoom={mpRoom}
        activeProfile={activeProfile}
        onBackToMenu={() => {
          mpRoom.leaveRoom().finally(() => setCurrentRoute(APP_ROUTES.menu));
        }}
      />
    );
  }

  if (currentRoute === APP_ROUTES.battleJourney) {
    return (
      <BattleJourneyScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        onProceedToSetup={proceedToBattleSetup}
        activeProfile={activeProfile}
      />
    );
  }

  if (currentRoute === APP_ROUTES.battleSubmenu) {
    return (
      <BattleSubmenuScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        onStartBattleGame={startBattleGame}
        activeProfile={activeProfile}
      />
    );
  }

  if (currentRoute === APP_ROUTES.soloGame) {
    return (
      <SoloGameScreen
        key={soloSetup.modeId}
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        soloSetup={soloSetup}
        activeProfile={activeProfile}
        onSwitchSoloSetup={setSoloSetup}
        onGrantAlbumSticker={onGrantAlbumSticker}
        onGrantAlbumPuzzlePiece={onGrantAlbumPuzzlePiece}
        onUpdateSoloHighScore={onUpdateSoloHighScore}
        onSetFavoriteSticker={onSetFavoriteSticker}
        globalHighScore={Math.max(0, ...profiles.map(p => p.soloHighScore ?? 0))}
        onGoToHowTo={() => setCurrentRoute(APP_ROUTES.howToSolo)}
      />
    );
  }

  if (currentRoute === APP_ROUTES.passPlayGame) {
    return (
      <PassPlayGameScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        passPlaySetup={passPlaySetup}
        activeProfile={activeProfile}
        secondaryProfile={secondaryProfile}
        onGrantAlbumSticker={onGrantAlbumSticker}
        onGrantAlbumPuzzlePiece={onGrantAlbumPuzzlePiece}
        onGoToHowTo={() => setCurrentRoute(APP_ROUTES.howToPassPlay)}
      />
    );
  }

  if (currentRoute === APP_ROUTES.battleGame) {
    return (
      <BattleGameScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        onReloadBattle={returnToBattleJourney}
        onNextBattleStage={goToNextBattleStage}
        battleSetup={battleSetup}
        activeProfile={activeProfile}
        onGrantAlbumSticker={onGrantAlbumSticker}
        onGrantAlbumPuzzlePiece={onGrantAlbumPuzzlePiece}
        onGoToHowTo={() => setCurrentRoute(APP_ROUTES.howToBattle)}
      />
    );
  }

  if (currentRoute === APP_ROUTES.album) {
    return <AlbumScreen onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)} activeProfile={activeProfile} />;
  }

  return (
    <MainMenuScreen
      onGoToSoloSubmenu={() => setCurrentRoute(APP_ROUTES.soloSubmenu)}
      onGoToPassPlaySubmenu={() => openPassPlaySubmenu('normal')}
      onGoToMultiplayer={() => setCurrentRoute(APP_ROUTES.multiplayerLobby)}
      onGoToBattleSubmenu={() => setCurrentRoute(APP_ROUTES.battleJourney)}
      onGoToAlbum={() => setCurrentRoute(APP_ROUTES.album)}
      onGoToHowToPlay={() => setCurrentRoute(APP_ROUTES.howTo)}
      onGoToCTA={() => openPassPlaySubmenu('goldenPhoenix')}
      onToggleMute={toggleMute}
      onOpenProfiles={() => openProfileScreen(APP_ROUTES.menu)}
      activeProfile={activeProfile}
    />
  );
}
