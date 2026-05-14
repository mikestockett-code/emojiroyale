import type { BattleJourneyStageNumber } from './battleRewardRules';
import type { CpuDecisionPersonality } from '../../lib/cpuDecision';

export type CpuId = 'todd' | 'nico' | 'marie' | 'cpu4' | 'cpu5';

export type BattleCpuId = CpuId;

export type CpuPersonality = CpuDecisionPersonality & {
  id: CpuId;
  name: string;
  avatar: string;
  difficultyByStage: Record<BattleJourneyStageNumber, number>;
  difficultyMax: number;
  epicAdaptDelta: number;   // difficulty bump when player lands an epic win
  lossEaseDelta: number;    // difficulty ease after player loses multiple rounds
  lines: {
    nervous: string[];
    onPlayerSquare?: string[];  // reaction to player stepping on CPU's target squares
    onBlockedEpic?: string[];   // reaction to player blocking CPU epic
    onTimeWarp?: string[];
    roundTaunt?: string[];
  };
};

// ─── Todd ─────────────────────────────────────────────────────────────────────

const TODD: CpuPersonality = {
  id: 'todd',
  name: 'Todd',
  avatar: '🤓',
  difficultyByStage: { 1: 1.8, 2: 3.1, 3: 3.9 },
  difficultyMax: 4.4,
  epicAdaptDelta: 0.2,
  lossEaseDelta: 0.15,
  aggressionBias: 0.45,
  epicHunting: 0.2,
  mistakeRate: 0.18,
  lines: {
    nervous: [
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
    ],
    onTimeWarp: [
      'Watch your clock...',
      'Tick tock... 😈',
      'There goes 30 seconds!',
      'Time is mine now.',
      'Clock looks a little low...',
    ],
    roundTaunt: [
      'Oh okay. Keep going for the easy win.',
      'I see. Taking the easy way out.',
      'New round. Same panic. Mostly yours.',
      'Sure. Try that again.',
      'I adjusted. Probably.',
    ],
  },
};

// ─── Nico ─────────────────────────────────────────────────────────────────────

const NICO: CpuPersonality = {
  id: 'nico',
  name: 'Nico',
  avatar: '😤',
  difficultyByStage: { 1: 3.1, 2: 3.2, 3: 4.4 },
  difficultyMax: 4.8,
  epicAdaptDelta: 0.35,
  lossEaseDelta: 0.1,
  aggressionBias: 0.78,
  epicHunting: 0.72,
  mistakeRate: 0.10,
  lines: {
    nervous: [
      'Still got this.',
      'Focus.',
      "It's fine. It's completely fine.",
      'I see the play.',
      'Wrong move. Correcting.',
    ],
    onPlayerSquare: [
      "That's MY square.",
      'Cute move.',
      'Oh you picked that one on purpose.',
      'Bold. Real bold.',
      'You just made this worse for yourself.',
      'Do you know what you just did?',
      'Keep touching my corners. See what happens.',
    ],
    onBlockedEpic: [
      'You got lucky.',
      "That's not blocking, that's stalling.",
      'Fine. New plan.',
      'Noted.',
      'Smart. Annoyingly smart.',
      "Won't matter.",
    ],
    roundTaunt: [
      'Oh okay. Keep going for the easy win.',
      'I see you taking the easy way out.',
      'Next round. I already adapted.',
      'You needed that one.',
      'Enjoy the lead while it exists.',
    ],
  },
};

// ─── Marie (shell) ────────────────────────────────────────────────────────────

const MARIE: CpuPersonality = {
  id: 'marie',
  name: 'Marie',
  avatar: '🧊',
  difficultyByStage: { 1: 2.0, 2: 3.5, 3: 4.8 },
  difficultyMax: 5.0,
  epicAdaptDelta: 0.25,
  lossEaseDelta: 0.05,
  aggressionBias: 0.2,
  epicHunting: 0.15,
  mistakeRate: 0.04,
  lines: {
    nervous: [],
    roundTaunt: [
      'Proceed.',
      'That was the easy route.',
      'I will account for that.',
    ],
  },
};

// ─── CPU 4 (shell) ────────────────────────────────────────────────────────────

const CPU4: CpuPersonality = {
  id: 'cpu4',
  name: 'CPU 4',
  avatar: '❓',
  difficultyByStage: { 1: 2.5, 2: 3.8, 3: 5.0 },
  difficultyMax: 5.0,
  epicAdaptDelta: 0.3,
  lossEaseDelta: 0.1,
  aggressionBias: 0.5,
  epicHunting: 0.5,
  mistakeRate: 0.06,
  lines: {
    nervous: [],
    roundTaunt: [
      'Next.',
      'That was convenient.',
      'Difficulty remains noted.',
    ],
  },
};

// ─── CPU 5 (shell) ────────────────────────────────────────────────────────────

const CPU5: CpuPersonality = {
  id: 'cpu5',
  name: 'CPU 5',
  avatar: '❓',
  difficultyByStage: { 1: 3.0, 2: 4.2, 3: 5.0 },
  difficultyMax: 5.0,
  epicAdaptDelta: 0.4,
  lossEaseDelta: 0.08,
  aggressionBias: 0.6,
  epicHunting: 0.6,
  mistakeRate: 0.03,
  lines: {
    nervous: [],
    roundTaunt: [
      'Continue.',
      'You chose the safe path.',
      'The next board will remember.',
    ],
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const CPU_PERSONALITIES: Record<CpuId, CpuPersonality> = {
  todd: TODD,
  nico: NICO,
  marie: MARIE,
  cpu4: CPU4,
  cpu5: CPU5,
};

export function getCpuPersonality(cpuId: CpuId = 'todd'): CpuPersonality {
  return CPU_PERSONALITIES[cpuId] ?? CPU_PERSONALITIES.todd;
}

export function getCpuBaseDifficulty(cpuId: CpuId = 'todd', stageNumber: BattleJourneyStageNumber = 1): number {
  return getCpuPersonality(cpuId).difficultyByStage[stageNumber] ?? 1.2;
}

// Compatibility helpers. Keep these while Battle CPU personalities are evolving.
export const BATTLE_CPU_CONFIGS = CPU_PERSONALITIES;

export function getBattleCpuDifficulty(cpuId: CpuId = 'todd', stageNumber: BattleJourneyStageNumber = 1): number {
  return getCpuBaseDifficulty(cpuId, stageNumber);
}

export const TODD_NERVOUS_LINES = TODD.lines.nervous;

export function getRandomToddNervousLine(): string {
  return TODD.lines.nervous[Math.floor(Math.random() * TODD.lines.nervous.length)] ?? '';
}
