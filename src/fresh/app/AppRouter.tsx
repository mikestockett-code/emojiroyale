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

import React, { useState } from 'react';
import { APP_ROUTES } from './routes';
import type { AppRoute } from '../types/navigation';
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
import AlbumScreen from '../screens/AlbumScreen';
import ProfileScreenShell from '../screens/ProfileScreenShell';
import type { FreshPassPlaySetup } from '../passplay/passPlaySetup.types';
import type { FreshBattleSetup } from '../battle/battleSetup.types';
import type { BattleJourneyStageNumber } from '../battle/battleRewardRules';
import type { FreshProfile, FreshProfileColor } from '../profile/types';
import type { FreshSoloSetup } from '../solo/soloSetup.types';
import { createFreshSoloSetup } from '../solo/soloWagerFactory';
import { useAudioContext } from '../audio/AudioContext';
import type { StickerId } from '../../types';
import type { AlbumPuzzleId } from '../album/album.types';

type Props = {
  profiles: FreshProfile[];
  activeProfileId: string | null;
  secondaryProfileId: string | null;
  onCreateProfile: (name: string, avatar: string, color: FreshProfileColor) => { ok: true } | { ok: false; error: string };
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
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(APP_ROUTES.menu);
  const [profileReturnRoute, setProfileReturnRoute] = useState<AppRoute>(APP_ROUTES.menu);
  const [passPlayEntryMode, setPassPlayEntryMode] = useState<'normal' | 'goldenPhoenix'>('normal');
  const [soloSetup, setSoloSetup] = useState<FreshSoloSetup>(() => createFreshSoloSetup('practice'));
  const [battleSetup, setBattleSetup] = useState<FreshBattleSetup>({
    playerProfileId: null,
    cpuId: 'todd',
    stageNumber: 1,
    powerSlotIds: { slot1: null, slot2: null },
  });
  const [battleJourneyStageNumber, setBattleJourneyStageNumber] = useState<BattleJourneyStageNumber>(1);
  const [passPlaySetup, setPassPlaySetup] = useState<FreshPassPlaySetup>({
    selectedWagerId: 'none',
    player1ProfileId: null,
    player2ProfileId: null,
    powerSlotIds: {
      player1: { slot1: null, slot2: null },
      player2: { slot1: null, slot2: null },
    },
  });
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0] ?? null;
  const secondaryProfile = profiles.find((profile) => profile.id === secondaryProfileId) ?? null;

  const openProfileScreen = (fromRoute: AppRoute) => {
    setProfileReturnRoute(fromRoute);
    setCurrentRoute(APP_ROUTES.profile);
  };

  const openPassPlaySubmenu = (entryMode: 'normal' | 'goldenPhoenix' = 'normal') => {
    setPassPlayEntryMode(entryMode);
    setCurrentRoute(APP_ROUTES.passPlaySubmenu);
  };

  if (!profilesReady) {
    return null;
  }

if (currentRoute === APP_ROUTES.menu) {
    return (
      <MainMenuScreen
        onGoToSoloSubmenu={() => setCurrentRoute(APP_ROUTES.soloSubmenu)}
        onGoToPassPlaySubmenu={() => openPassPlaySubmenu('normal')}
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
        onStartSoloGame={(nextSoloSetup) => {
          setSoloSetup(nextSoloSetup);
          setCurrentRoute(APP_ROUTES.soloGame);
        }}
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
        onStartPassPlayGame={(setup) => {
          setPassPlaySetup(setup);
          setCurrentRoute(APP_ROUTES.passPlayGame);
        }}
        onOpenProfiles={() => openProfileScreen(APP_ROUTES.passPlaySubmenu)}
        activeProfile={activeProfile}
        secondaryProfile={secondaryProfile}
        entryMode={passPlayEntryMode}
      />
    );
  }

  if (currentRoute === APP_ROUTES.battleJourney) {
    return (
      <BattleJourneyScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        onProceedToSetup={(stageNumber) => {
          setBattleJourneyStageNumber(stageNumber);
          setCurrentRoute(APP_ROUTES.battleSubmenu);
        }}
        activeProfile={activeProfile}
      />
    );
  }

  if (currentRoute === APP_ROUTES.battleSubmenu) {
    return (
      <BattleSubmenuScreen
        onBackToMenu={() => setCurrentRoute(APP_ROUTES.menu)}
        onStartBattleGame={(setup) => {
          setBattleSetup({ ...setup, cpuId: 'todd', stageNumber: battleJourneyStageNumber });
          setCurrentRoute(APP_ROUTES.battleGame);
        }}
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
        onReloadBattle={() => setCurrentRoute(APP_ROUTES.battleJourney)}
        onNextBattleStage={() => {
          const currentStage = battleSetup.stageNumber ?? 1;
          const nextStage = currentStage >= 3 ? 1 : ((currentStage + 1) as BattleJourneyStageNumber);
          setBattleJourneyStageNumber(nextStage);
          setCurrentRoute(APP_ROUTES.battleSubmenu);
        }}
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
