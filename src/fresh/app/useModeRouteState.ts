import { useCallback, useState } from 'react';
import type { AppRoute } from '../types/navigation';
import type { FreshPassPlaySetup } from '../passplay/passPlaySetup.types';
import type { FreshBattleSetup } from '../battle/battleSetup.types';
import type { BattleJourneyStageNumber } from '../battle/battleRewardRules';
import type { FreshSoloSetup } from '../solo/soloSetup.types';
import { createFreshSoloSetup } from '../solo/soloWagerFactory';
import { APP_ROUTES } from './routes';

type BattleCpuId = 'todd' | 'nico';
type PassPlayEntryMode = 'normal' | 'goldenPhoenix';

const EMPTY_POWER_LOADOUT = { slot1: null, slot2: null } as const;

const DEFAULT_BATTLE_SETUP: FreshBattleSetup = {
  playerProfileId: null,
  cpuId: 'todd',
  stageNumber: 1,
  startingDifficulty: undefined,
  powerSlotIds: EMPTY_POWER_LOADOUT,
};

const DEFAULT_PASS_PLAY_SETUP: FreshPassPlaySetup = {
  selectedWagerId: 'none',
  p1WagerStickerId: null,
  p2WagerStickerId: null,
  player1ProfileId: null,
  player2ProfileId: null,
  powerSlotIds: {
    player1: EMPTY_POWER_LOADOUT,
    player2: EMPTY_POWER_LOADOUT,
  },
};

export function useModeRouteState() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(APP_ROUTES.menu);
  const [profileReturnRoute, setProfileReturnRoute] = useState<AppRoute>(APP_ROUTES.menu);
  const [passPlayEntryMode, setPassPlayEntryMode] = useState<PassPlayEntryMode>('normal');
  const [soloSetup, setSoloSetup] = useState<FreshSoloSetup>(() => createFreshSoloSetup('practice'));
  const [battleSetup, setBattleSetup] = useState<FreshBattleSetup>(DEFAULT_BATTLE_SETUP);
  const [battleJourneyStageNumber, setBattleJourneyStageNumber] = useState<BattleJourneyStageNumber>(1);
  const [battleJourneyCpuId, setBattleJourneyCpuId] = useState<BattleCpuId>('todd');
  const [battleJourneyStartingDifficulty, setBattleJourneyStartingDifficulty] = useState<number | undefined>(undefined);
  const [passPlaySetup, setPassPlaySetup] = useState<FreshPassPlaySetup>(DEFAULT_PASS_PLAY_SETUP);

  const openProfileScreen = useCallback((fromRoute: AppRoute) => {
    setProfileReturnRoute(fromRoute);
    setCurrentRoute(APP_ROUTES.profile);
  }, []);

  const openPassPlaySubmenu = useCallback((entryMode: PassPlayEntryMode = 'normal') => {
    setPassPlayEntryMode(entryMode);
    setCurrentRoute(APP_ROUTES.passPlaySubmenu);
  }, []);

  const startSoloGame = useCallback((nextSoloSetup: FreshSoloSetup) => {
    setSoloSetup(nextSoloSetup);
    setCurrentRoute(APP_ROUTES.soloGame);
  }, []);

  const startPassPlayGame = useCallback((setup: FreshPassPlaySetup) => {
    setPassPlaySetup(setup);
    setCurrentRoute(APP_ROUTES.passPlayGame);
  }, []);

  const proceedToBattleSetup = useCallback((stageNumber: BattleJourneyStageNumber, cpuId: BattleCpuId) => {
    setBattleJourneyStageNumber(stageNumber);
    setBattleJourneyCpuId(cpuId);
    setBattleJourneyStartingDifficulty(undefined);
    setCurrentRoute(APP_ROUTES.battleSubmenu);
  }, []);

  const startBattleGame = useCallback((setup: FreshBattleSetup) => {
    setBattleSetup({
      ...setup,
      cpuId: battleJourneyCpuId,
      stageNumber: battleJourneyStageNumber,
      startingDifficulty: battleJourneyStartingDifficulty,
    });
    setBattleJourneyStartingDifficulty(undefined);
    setCurrentRoute(APP_ROUTES.battleGame);
  }, [battleJourneyCpuId, battleJourneyStageNumber, battleJourneyStartingDifficulty]);

  const goToNextBattleStage = useCallback((startingDifficulty?: number) => {
    const currentStage = battleSetup.stageNumber ?? 1;
    const currentCpu = battleSetup.cpuId ?? 'todd';
    if (currentStage >= 3) {
      setBattleJourneyCpuId(currentCpu === 'todd' ? 'nico' : 'todd');
      setBattleJourneyStageNumber(1);
    } else {
      setBattleJourneyStageNumber((currentStage + 1) as BattleJourneyStageNumber);
    }
    setBattleJourneyStartingDifficulty(startingDifficulty);
    setCurrentRoute(APP_ROUTES.battleSubmenu);
  }, [battleSetup.cpuId, battleSetup.stageNumber]);

  const returnToBattleJourney = useCallback((startingDifficulty?: number) => {
    setBattleJourneyStartingDifficulty(startingDifficulty);
    setCurrentRoute(APP_ROUTES.battleJourney);
  }, []);

  return {
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
  };
}
