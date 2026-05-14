import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StickerId } from '../../types';
import type { AlbumPuzzleId } from '../album/album.types';
import type { FreshSoloRewardPreview } from '../../lib/soloRewardRules';

const BATTLE_INTRO_SEEN_KEY = '@battle_journey_intro_seen_v1';
const BATTLE_JOURNEY_SAVE_KEY = '@battle_journey_save_v1';
const BATTLE_PENDING_STICKERS_KEY = '@battle_journey_pending_stickers_v1';

export type BattleJourneyCpuId = 'todd' | 'nico';

export type BattleJourneySave = {
  cpuId: BattleJourneyCpuId;
  stageNumber: 1 | 2 | 3;
  updatedAt: number;
};

export type BattleJourneyStageResult = {
  nextStageNumber: 1 | 2 | 3;
  nextCpuId: BattleJourneyCpuId;
  didCompleteCpuArc: boolean;
};

const FIRST_STAGE_SAVE: Omit<BattleJourneySave, 'updatedAt'> = {
  cpuId: 'todd',
  stageNumber: 1,
};

const TODD_STAGE_PIECES: Record<1 | 2 | 3, string[]> = {
  1: ['battleTodd-1', 'battleTodd-2', 'battleTodd-3'],
  2: ['battleTodd-4', 'battleTodd-5', 'battleTodd-6'],
  3: ['battleTodd-7', 'battleTodd-8', 'battleTodd-9', 'battleTodd-10'],
};

const NICO_STAGE_PIECES: Record<1 | 2 | 3, string[]> = {
  1: ['battleNico-1', 'battleNico-2', 'battleNico-3'],
  2: ['battleNico-4', 'battleNico-5', 'battleNico-6'],
  3: ['battleNico-7', 'battleNico-8', 'battleNico-9', 'battleNico-10'],
};


export function useBattleJourneyState() {
  const [isReady, setIsReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [save, setSave] = useState<BattleJourneySave | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      AsyncStorage.getItem(BATTLE_INTRO_SEEN_KEY),
      AsyncStorage.getItem(BATTLE_JOURNEY_SAVE_KEY),
    ]).then(([introSeen, savedJourney]) => {
      if (!mounted) return;

      setShowIntro(!introSeen);
      if (savedJourney) {
        try {
          setSave(JSON.parse(savedJourney) as BattleJourneySave);
        } catch {
          setSave(null);
        }
      }
      setIsReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const dismissIntro = useCallback(async () => {
    setShowIntro(false);
    await AsyncStorage.setItem(BATTLE_INTRO_SEEN_KEY, 'true');
  }, []);

  const startStageOne = useCallback(async () => {
    const nextSave: BattleJourneySave = {
      ...FIRST_STAGE_SAVE,
      updatedAt: Date.now(),
    };
    setSave(nextSave);
    await AsyncStorage.setItem(BATTLE_JOURNEY_SAVE_KEY, JSON.stringify(nextSave));
    return nextSave;
  }, []);

  const restartStageOne = useCallback(async () => {
    return startStageOne();
  }, [startStageOne]);

  return {
    isReady,
    showIntro,
    save,
    hasSave: save !== null,
    dismissIntro,
    startStageOne,
    restartStageOne,
  };
}

export async function completeBattleJourneyStage(
  cpuId: BattleJourneyCpuId,
  stageNumber: 1 | 2 | 3,
  pendingStickerRewards: FreshSoloRewardPreview[],
  profileId: string | null | undefined,
  grantAlbumSticker?: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void,
  grantAlbumPuzzlePiece?: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void,
): Promise<BattleJourneyStageResult> {
  if (cpuId === 'todd') {
    for (const pieceId of TODD_STAGE_PIECES[stageNumber]) {
      grantAlbumPuzzlePiece?.(profileId, 'battleTodd', pieceId, 1);
    }
  } else if (cpuId === 'nico') {
    for (const pieceId of NICO_STAGE_PIECES[stageNumber]) {
      grantAlbumPuzzlePiece?.(profileId, 'battleNico', pieceId, 1);
    }
  }

  const storedPendingRewards = await readPendingStickerRewards();
  const nextPendingRewards = [...storedPendingRewards, ...pendingStickerRewards];

  if (stageNumber === 3) {
    // Arc complete — flush all pending sticker rewards
    for (const reward of nextPendingRewards) {
      if (reward.stickerId) {
        grantAlbumSticker?.(profileId, reward.stickerId, reward.count);
      }
    }
    await AsyncStorage.removeItem(BATTLE_PENDING_STICKERS_KEY);
    // Todd arc done → advance to Nico; Nico arc done → loop back to Todd
    const nextCpuId: BattleJourneyCpuId = cpuId === 'todd' ? 'nico' : 'todd';
    await writeJourneySave({ cpuId: nextCpuId, stageNumber: 1, updatedAt: Date.now() });
    return { nextStageNumber: 1, nextCpuId, didCompleteCpuArc: true };
  }

  await AsyncStorage.setItem(BATTLE_PENDING_STICKERS_KEY, JSON.stringify(nextPendingRewards));
  const nextStageNumber = (stageNumber + 1) as 2 | 3;
  await writeJourneySave({ cpuId, stageNumber: nextStageNumber, updatedAt: Date.now() });
  return { nextStageNumber, nextCpuId: cpuId, didCompleteCpuArc: false };
}

export async function clearBattleJourneyPendingStickerRewards() {
  await AsyncStorage.removeItem(BATTLE_PENDING_STICKERS_KEY);
}

async function readPendingStickerRewards(): Promise<FreshSoloRewardPreview[]> {
  const raw = await AsyncStorage.getItem(BATTLE_PENDING_STICKERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as FreshSoloRewardPreview[];
  } catch {
    return [];
  }
}

async function writeJourneySave(save: BattleJourneySave) {
  await AsyncStorage.setItem(BATTLE_JOURNEY_SAVE_KEY, JSON.stringify(save));
}
