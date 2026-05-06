// navigation.ts
// New navigation types for the rewrite.
//
// Route-only types live here.
// Do not put gameplay state in this file.

import { APP_ROUTES } from '../app/routes';
import type { FreshProfile } from '../profile/types';
import type { FreshPassPlaySetup } from '../passplay/passPlaySetup.types';
import type { FreshSoloSetup } from '../solo/soloSetup.types';
import type { FreshBattleSetup } from '../battle/battleSetup.types';

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export type NavigateTo = (route: AppRoute) => void;

export type BackToMenu = () => void;

export type MainMenuNavigation = {
  onGoToSoloSubmenu: () => void;
  onGoToPassPlaySubmenu: () => void;
  onGoToBattleSubmenu: () => void;
  onGoToAlbum: () => void;
  onGoToHowToPlay: () => void;
  onGoToCTA: () => void;
  onToggleMute: () => void;
  onOpenProfiles: () => void;
  activeProfile?: FreshProfile | null;
};

export type SoloSubmenuNavigation = {
  onBackToMenu: () => void;
  onStartSoloGame: (setup: FreshSoloSetup) => void;
  onOpenProfiles?: () => void;
  activeProfileAvatar?: string | null;
  activeProfile?: FreshProfile | null;
};

export type PassPlaySubmenuNavigation = {
  onBackToMenu: () => void;
  onStartPassPlayGame: (setup: FreshPassPlaySetup) => void;
  onOpenProfiles?: () => void;
  activeProfile?: FreshProfile | null;
  secondaryProfile?: FreshProfile | null;
};

export type BattleSubmenuNavigation = {
  onBackToMenu: () => void;
  onStartBattleGame: (setup: FreshBattleSetup) => void;
  activeProfile?: FreshProfile | null;
};

export type GameScreenNavigation = {
  onBackToMenu: () => void;
};

export type BattleGameNavigation = {
  onBackToMenu: () => void;
  onReloadBattle: () => void;
  battleSetup: FreshBattleSetup;
  activeProfile?: FreshProfile | null;
};

export type AlbumNavigation = {
  onBackToMenu: () => void;
  activeProfile?: FreshProfile | null;
  onOpenProfiles?: () => void;
  onHowToPlay?: () => void;
  onToggleMute?: () => void;
};

export type HowToNavigation = {
  onBackToMenu: () => void;
};

export type ProfileNavigation = {
  onBackToMenu: () => void;
};
