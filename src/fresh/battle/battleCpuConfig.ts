import type { BattleJourneyStageNumber } from './battleRewardRules';

export type BattleCpuId = 'todd';

export type BattleCpuConfig = {
  id: BattleCpuId;
  name: string;
  difficultyByStage: Record<BattleJourneyStageNumber, number>;
};

export const BATTLE_CPU_CONFIGS: Record<BattleCpuId, BattleCpuConfig> = {
  todd: {
    id: 'todd',
    name: 'Todd',
    difficultyByStage: {
      1: 1,
      2: 3,
      3: 4,
    },
  },
};

export const TODD_NERVOUS_LINES = [
  'Wait. That froze the clock?',
  'Nope. Totally calm. So calm.',
  'Why did my hand do that?',
  'I meant to click that. Probably.',
  'Okay Todd, think normal thoughts.',
  'That power is rude.',
  'I had a plan. It left.',
  'Nobody saw that, right?',
  'Easy move. Easy move. Oh no.',
  'The board is moving funny.',
];

export function getBattleCpuConfig(cpuId: BattleCpuId = 'todd') {
  return BATTLE_CPU_CONFIGS[cpuId] ?? BATTLE_CPU_CONFIGS.todd;
}

export function getBattleCpuDifficulty(cpuId: BattleCpuId = 'todd', stageNumber: BattleJourneyStageNumber = 1) {
  return getBattleCpuConfig(cpuId).difficultyByStage[stageNumber] ?? 1;
}

export function getRandomToddNervousLine() {
  return TODD_NERVOUS_LINES[Math.floor(Math.random() * TODD_NERVOUS_LINES.length)] ?? TODD_NERVOUS_LINES[0];
}
