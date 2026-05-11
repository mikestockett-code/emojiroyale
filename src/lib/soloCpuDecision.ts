import type { BoardCell, SoloModeId } from '../types';

export type SoloCpuDecision = {
  type: 'place' | 'roll';
  boardIndex?: number;       // where CPU places its tile
  rollTargetIndex?: number;  // which board cell to roll before placing (level 2+)
};

type DecisionParams = {
  board: BoardCell[];
  difficultyLevel: number;
  cpuHasRollsLeft: boolean;
};

// ─── Board analysis (no peeking at racks — board only) ───────────────────────

const GRID = 5;
const DIRS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

function toIdx(r: number, c: number) { return r * GRID + c; }

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

// Returns a score per board index.
// Positive score = valuable for CPU to occupy (block threat or extend own line).
function scoreBoard(board: BoardCell[]): Record<number, number> {
  const scores: Record<number, number> = {};
  for (const line of getFourLines()) {
    const p1 = line.filter(i => board[i]?.player === 'player1').length;
    const p2 = line.filter(i => board[i]?.player === 'player2').length;
    const empty = line.filter(i => board[i] === null);
    if (!empty.length || (p1 > 0 && p2 > 0)) continue;

    // Block player threats — higher weight than offense
    if (p1 > 0) {
      const threat = p1 * p1 * 12; // 1→12, 2→48, 3→108
      for (const i of empty) scores[i] = (scores[i] ?? 0) + threat;
    }
    // Extend CPU lines
    if (p2 > 0) {
      const value = p2 * p2 * 7; // 1→7, 2→28, 3→63
      for (const i of empty) scores[i] = (scores[i] ?? 0) + value;
    }
  }
  return scores;
}

function pickBestEmpty(scores: Record<number, number>, board: BoardCell[]): number | null {
  let best = -Infinity, bestIdx: number | null = null;
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) continue;
    const s = scores[i] ?? 0;
    if (s > best) { best = s; bestIdx = i; }
  }
  return bestIdx;
}

function pickRandomEmpty(board: BoardCell[]): number | null {
  const spots = board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
  return spots.length ? spots[Math.floor(Math.random() * spots.length)] : null;
}

// Best player1 cell to roll — the one contributing most to their threat
function pickBestRollTarget(board: BoardCell[], scores: Record<number, number>): number | null {
  let best = -1, bestIdx: number | null = null;
  for (let i = 0; i < board.length; i++) {
    if (board[i]?.player !== 'player1') continue;
    const s = scores[i] ?? 0;
    if (s > best) { best = s; bestIdx = i; }
  }
  return bestIdx;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getSoloCpuDecision({
  board,
  difficultyLevel,
  cpuHasRollsLeft,
}: DecisionParams): SoloCpuDecision {
  // Level 1 — passive: random placement, never rolls
  if (difficultyLevel <= 1) {
    const boardIndex = pickRandomEmpty(board) ?? undefined;
    return { type: 'place', boardIndex };
  }

  const scores = scoreBoard(board);
  const hasCriticalThreat = Object.values(scores).some(s => s >= 108); // player has 3-in-a-line

  // Roll decision (only when no immediate critical block needed)
  let rollTargetIndex: number | undefined;
  if (cpuHasRollsLeft && !hasCriticalThreat) {
    const rollChance = difficultyLevel === 2 ? 0.20 : difficultyLevel === 3 ? 0.38 : 0.5;
    if (Math.random() < rollChance) {
      const target = pickBestRollTarget(board, scores);
      if (target !== null) rollTargetIndex = target;
    }
  }

  // Place decision — level 2: 65% smart, level 3: 90% smart, level 4+: boss effort
  const smartChance = difficultyLevel === 2 ? 0.65 : difficultyLevel === 3 ? 0.90 : 0.97;
  const useSmartPlay = Math.random() < smartChance;
  const boardIndex = useSmartPlay
    ? (pickBestEmpty(scores, board) ?? pickRandomEmpty(board) ?? undefined)
    : (pickRandomEmpty(board) ?? undefined);

  return { type: rollTargetIndex !== undefined ? 'roll' : 'place', boardIndex, rollTargetIndex };
}

// ─── Difficulty from mode + round ────────────────────────────────────────────
// Unified scale: epicLite R1 = practice R3, epic R1 = practice R4

export function getSoloCpuDifficultyLevel(mode: SoloModeId, roundNumber: number): number {
  let effective = roundNumber;
  if (mode === 'epicLite') effective = roundNumber + 2;
  if (mode === 'epic')     effective = roundNumber + 3;

  if (effective <= 2) return 1; // passive — player wins ~80%
  if (effective === 3) return 2; // blocking + occasional rolls
  return 3;                      // full effort: blocking + offense + rolls
}
