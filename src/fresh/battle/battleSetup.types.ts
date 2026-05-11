import type { BattlePowerId } from '../../types';
import type { BattleCpuId } from './battleCpuConfig';
import type { BattleJourneyStageNumber } from './battleRewardRules';

export type FreshBattleSetup = {
  playerProfileId: string | null;
  cpuId?: BattleCpuId;
  stageNumber?: BattleJourneyStageNumber;
  powerSlotIds: {
    slot1: BattlePowerId | null;
    slot2: BattlePowerId | null;
  };
};
