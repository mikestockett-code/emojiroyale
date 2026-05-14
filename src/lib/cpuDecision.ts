import type { BoardCell } from '../types';

export type CpuDecisionPersonality = {
  aggressionBias: number;  // 0 = pure defense, 1 = pure offense
  epicHunting: number;     // 0–1, how hard CPU chases its own epic wins
  mistakeRate: number;     // 0–1, chance of a suboptimal move (personality flaw)
};

export type CpuDecision = {
  type: 'place' | 'roll';
  boardIndex?: number;
  rollTargetIndex?: number;
};

type DecisionParams = {
  board: BoardCell[];
  difficulty: number;         // float 1.0–5.0
  cpuHasRollsLeft: boolean;
  personality?: Partial<CpuDecisionPersonality>;
};

const NEUTRAL: CpuDecisionPersonality = { aggressionBias: 0.5, epicHunting: 0.3, mistakeRate: 0 };
const GRID = 5;
const DIRS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a: number, b: number, t: number)    { return a + (b - a) * clamp(t, 0, 1); }
function toIdx(r: number, c: number)               { return r * GRID + c; }

// ─── Board analysis ───────────────────────────────────────────────────────────

function getFourLines(): number[][] {
  const lines: number[][] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      for (const [dr, dc] of DIRS) {
        const line: number[] = [];
        for (let i = 0; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) break;
          line.push(toIdx(nr, nc));
        }
        if (line.length === 4) lines.push(line);
      }
    }
  }
  return lines;
}

function scoreStandardLines(board: BoardCell[], aggBias: number): Record<number, number> {
  const scores: Record<number, number> = {};
  const blockW  = lerp(14, 8, aggBias);   // defensive CPUs block harder
  const attackW = lerp(5, 10, aggBias);   // aggressive CPUs extend harder

  for (const line of getFourLines()) {
    const p1    = line.filter(i => board[i]?.player === 'player1').length;
    const p2    = line.filter(i => board[i]?.player === 'player2').length;
    const empty = line.filter(i => board[i] === null);
    if (!empty.length || (p1 > 0 && p2 > 0)) continue;
    if (p1 > 0) { const w = p1 * p1 * blockW;  for (const i of empty) scores[i] = (scores[i] ?? 0) + w; }
    if (p2 > 0) { const w = p2 * p2 * attackW; for (const i of empty) scores[i] = (scores[i] ?? 0) + w; }
  }
  return scores;
}

function scoreEpicThreats(board: BoardCell[], aggBias: number, epicHunting: number): Record<number, number> {
  const scores: Record<number, number> = {};
  const freq: Record<string, { p1: number; p2: number }> = {};

  for (const cell of board) {
    if (!cell) continue;
    const key = cell.stickerId;
    if (!freq[key]) freq[key] = { p1: 0, p2: 0 };
    if (cell.player === 'player1') freq[key].p1++;
    else freq[key].p2++;
  }

  const emptyIndices = board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);

  for (const { p1, p2 } of Object.values(freq)) {
    // Block player building toward epic (2+ same sticker)
    if (p1 >= 2) {
      const w = lerp(10, 6, aggBias) * p1;
      for (const i of emptyIndices) scores[i] = (scores[i] ?? 0) + w;
    }
    // Chase CPU's own epic
    if (p2 >= 2) {
      const w = lerp(4, 10, aggBias) * epicHunting * p2;
      for (const i of emptyIndices) scores[i] = (scores[i] ?? 0) + w;
    }
  }
  return scores;
}

function pickBestEmpty(scores: Record<number, number>, board: BoardCell[]): number | null {
  let best = -Infinity, idx: number | null = null;
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) continue;
    if ((scores[i] ?? 0) > best) { best = scores[i] ?? 0; idx = i; }
  }
  return idx;
}

function pickRandomEmpty(board: BoardCell[]): number | null {
  const spots = board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
  return spots.length ? spots[Math.floor(Math.random() * spots.length)] : null;
}

function pickBestRollTarget(board: BoardCell[], scores: Record<number, number>): number | null {
  let best = -1, idx: number | null = null;
  for (let i = 0; i < board.length; i++) {
    if (board[i]?.player !== 'player1') continue;
    if ((scores[i] ?? 0) > best) { best = scores[i] ?? 0; idx = i; }
  }
  return idx;
}

// ─── Public decision API ──────────────────────────────────────────────────────

export function getCpuDecision({ board, difficulty, cpuHasRollsLeft, personality }: DecisionParams): CpuDecision {
  const p = { ...NEUTRAL, ...personality };
  const t = clamp((difficulty - 1) / 4, 0, 1);  // 1.0→0, 5.0→1

  // Mistakes reduce smart chance more at low difficulty, fade out at high
  const mistakePenalty = p.mistakeRate * lerp(0.45, 0.05, t);
  const smartChance    = clamp(lerp(0.35, 0.99, t) - mistakePenalty, 0.05, 0.99);

  // Pure random below 1.5
  if (difficulty < 1.5) return { type: 'place', boardIndex: pickRandomEmpty(board) ?? undefined };

  const stdScores = scoreStandardLines(board, p.aggressionBias);
  const hasCriticalThreat = Object.values(stdScores).some(s => s >= 112);

  // Epic awareness scales in from difficulty 3.0 to 4.5
  const epicWeight = clamp((difficulty - 3.0) / 1.5, 0, 1);
  const combined = { ...stdScores };
  if (epicWeight > 0) {
    const epicScores = scoreEpicThreats(board, p.aggressionBias, p.epicHunting);
    for (const [k, v] of Object.entries(epicScores)) {
      const i = Number(k);
      combined[i] = (combined[i] ?? 0) + v * epicWeight;
    }
  }

  // Roll decision
  let rollTargetIndex: number | undefined;
  const rollChance = lerp(0, 0.65, t);
  if (cpuHasRollsLeft && !hasCriticalThreat && Math.random() < rollChance) {
    const target = pickBestRollTarget(board, combined);
    if (target !== null) rollTargetIndex = target;
  }

  // Placement decision
  const useSmartPlay = Math.random() < smartChance;
  const boardIndex = useSmartPlay
    ? (pickBestEmpty(combined, board) ?? pickRandomEmpty(board) ?? undefined)
    : (pickRandomEmpty(board) ?? undefined);

  return { type: rollTargetIndex !== undefined ? 'roll' : 'place', boardIndex, rollTargetIndex };
}

// ─── Solo difficulty helper — float 1.0–5.0 ──────────────────────────────────

export function getSoloCpuDifficulty(mode: string, roundNumber: number): number {
  let effective = roundNumber;
  if (mode === 'epicLite') effective = roundNumber + 2;
  if (mode === 'epic')     effective = roundNumber + 3;

  if (effective <= 1) return 1.0;
  if (effective === 2) return 1.5;
  if (effective === 3) return 2.2;
  if (effective === 4) return 3.0;
  if (effective === 5) return 3.8;
  return Math.min(4.5, 3.8 + (effective - 5) * 0.3);
}
