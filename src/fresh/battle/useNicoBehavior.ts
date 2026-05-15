import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoardCell, Player, StickerId } from '../../types';
import type { CpuTurnContext } from '../../hooks/useSoloCpu';
import { CPU_PLACE_FINISH_DELAY_MS, CPU_ROLL_FINISH_DELAY_MS } from '../../hooks/useSoloCpu';
import { createGameBoardEffectEvent } from '../../lib/gameBoardEffects';
import { applyFourSquarePower, getBestFourSquareCorner } from '../../lib/battlePowerEffects';
import type { GameBoardEffectEvent } from '../../lib/gameBoardEffects';
import { getCpuPersonality } from './battleCpuConfig';
import { useAudioContext } from '../audio/AudioContext';
import type { AudioSourceKey } from '../../lib/audio';
import type { BattleJourneyStageNumber } from './battleRewardRules';

// All 16 indices Nico cares about — the four 2x2 corner squares
const FOUR_SQUARE_CORNERS = [
  [0, 1, 5, 6],
  [3, 4, 8, 9],
  [15, 16, 20, 21],
  [18, 19, 23, 24],
] as const;
const FOUR_SQUARE_INDICES: Set<number> = new Set(FOUR_SQUARE_CORNERS.flat());
const MAX_EP1_PER_STAGE = 2;
const NICO_REACTION_SOUNDS: AudioSourceKey[] = ['nicoPretty', 'nicoThatIsMySpot', 'nicoStopWait'];
const NICO_INTRO_LINES = [
  'Explosions are clean. Demolition is honest.',
  'I like corners. They come apart beautifully.',
  'Four squares. One boom. That is art.',
];
const NICO_STAGE_LINES = [
  'Pretty little structure.',
  'Demolition is timing.',
  'Corners tell me everything.',
  'This board wants to fall down.',
  'I can hear the weak spot.',
];

function getRandomLine(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)] ?? '';
}

function getClearRowTarget(board: BoardCell[]): { nextBoard: BoardCell[]; targetIndex: number; affectedIndices: number[] } | null {
  let bestRow = -1, bestCount = 0;
  for (let row = 0; row < 5; row++) {
    let count = 0;
    for (let col = 0; col < 5; col++) {
      if (board[row * 5 + col]?.player === 'player1') count++;
    }
    if (count > bestCount) { bestCount = count; bestRow = row; }
  }
  if (bestRow < 0 || bestCount === 0) return null;
  const nextBoard = [...board];
  const affectedIndices: number[] = [];
  for (let col = 0; col < 5; col++) {
    const idx = bestRow * 5 + col;
    affectedIndices.push(idx);
    nextBoard[idx] = null;
  }
  return { nextBoard, targetIndex: bestRow * 5, affectedIndices };
}

function getClearColumnTarget(board: BoardCell[]): { nextBoard: BoardCell[]; targetIndex: number; affectedIndices: number[] } | null {
  let bestCol = -1, bestCount = 0;
  for (let col = 0; col < 5; col++) {
    let count = 0;
    for (let row = 0; row < 5; row++) {
      if (board[row * 5 + col]?.player === 'player1') count++;
    }
    if (count > bestCount) { bestCount = count; bestCol = col; }
  }
  if (bestCol < 0 || bestCount === 0) return null;
  const nextBoard = [...board];
  const affectedIndices: number[] = [];
  for (let row = 0; row < 5; row++) {
    const idx = row * 5 + bestCol;
    affectedIndices.push(idx);
    nextBoard[idx] = null;
  }
  return { nextBoard, targetIndex: bestCol, affectedIndices };
}

export type NicoBehaviorDeps = {
  playerRacks: Record<Player, StickerId[]>;
  roundNumber: number;
  stageNumber: BattleJourneyStageNumber;
  setBoard: (b: BoardCell[]) => void;
  setPlayerRacks: (r: Record<Player, StickerId[]>) => void;
  setLastMoveIndex: (i: number | null) => void;
  showEp1Launch: (event: GameBoardEffectEvent | string, showStatus?: boolean, statusLabel?: string) => void;
  onBumpDifficulty: (delta: number) => void;
};

type ForcedPower = 'fourSquare' | 'clearRow' | 'clearColumn';
type SecondNicoPower = 'clearRow' | 'clearColumn';

export function useNicoBehavior() {
  const { playSound } = useAudioContext();
  const personality = getCpuPersonality('nico');
  const [thoughtText, setThoughtText]     = useState<string | null>(null);
  const [forcePower, setForcePower]       = useState<ForcedPower | null>(null);
  const ep1UsedRef                        = useRef(0);
  const fourSquareUsedRef                 = useRef(false);
  const secondPowerRef                    = useRef<SecondNicoPower>(Math.random() < 0.5 ? 'clearRow' : 'clearColumn');
  const lastCornerIdRef                   = useRef<number | null>(null);
  const reactionReadyAtRef                = useRef(0);
  const cornerHitCountRef                 = useRef(0);
  const introShownRef                     = useRef(false);
  const thoughtTimerRef                   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cpuDelayTimerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    if (cpuDelayTimerRef.current) clearTimeout(cpuDelayTimerRef.current);
  }, []);

  const showLine = useCallback((line: string) => {
    setThoughtText(line);
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    thoughtTimerRef.current = setTimeout(() => setThoughtText(null), 2800);
  }, []);

  const playNicoReactionSound = useCallback(() => {
    playSound(NICO_REACTION_SOUNDS[Math.floor(Math.random() * NICO_REACTION_SOUNDS.length)] ?? 'nicoThatIsMySpot');
  }, [playSound]);

  const getCornerId = useCallback((index: number) => (
    FOUR_SQUARE_CORNERS.findIndex((corner) => (corner as readonly number[]).includes(index))
  ), []);

  const triggerStageIntro = useCallback((stageNumber: BattleJourneyStageNumber) => {
    if (stageNumber !== 1) return;
    showLine(getRandomLine(NICO_INTRO_LINES));
    playNicoReactionSound();
  }, [playNicoReactionSound, showLine]);

  const maybeTriggerStageLine = useCallback((stageNumber: BattleJourneyStageNumber) => {
    const chance = stageNumber === 1 ? 0.08 : stageNumber === 2 ? 0.14 : 0.22;
    if (Math.random() > chance) return;
    showLine(getRandomLine(NICO_STAGE_LINES));
  }, [showLine]);

  const resetNicoRound = useCallback(() => {
    setThoughtText(null);
    setForcePower(null);
    cornerHitCountRef.current = 0;
    reactionReadyAtRef.current = 0;
    if (thoughtTimerRef.current) { clearTimeout(thoughtTimerRef.current); thoughtTimerRef.current = null; }
    if (cpuDelayTimerRef.current) { clearTimeout(cpuDelayTimerRef.current); cpuDelayTimerRef.current = null; }
  }, []);

  const resetNico = useCallback(() => {
    resetNicoRound();
    ep1UsedRef.current = 0;
    fourSquareUsedRef.current = false;
    introShownRef.current = false;
    secondPowerRef.current = Math.random() < 0.5 ? 'clearRow' : 'clearColumn';
    lastCornerIdRef.current = null;
  }, [resetNicoRound]);

  // Called after every player placement — checks if player stepped on Nico's squares
  const triggerPlayerSquareResponse = useCallback((board: BoardCell[], playerMoveIndex: number | null) => {
    if (playerMoveIndex === null) return;
    if (!FOUR_SQUARE_INDICES.has(playerMoveIndex)) return;

    cornerHitCountRef.current += 1;
    const hitCount = cornerHitCountRef.current;

    const cornerId = getCornerId(playerMoveIndex);
    lastCornerIdRef.current = cornerId >= 0 ? cornerId : lastCornerIdRef.current;

    // Give CPU enough time to wait until reaction plays before firing
    reactionReadyAtRef.current = Date.now() + 1800;

    // Sound + text fires after ~1s so player sees their move first
    setTimeout(() => {
      playNicoReactionSound();
      if (hitCount === 1 && !introShownRef.current) {
        introShownRef.current = true;
        showLine("Hey. Those corners are mine. Just a heads up.");
      } else if (hitCount === 2) {
        showLine("😤 Back in my corners again... 💣 Keep going.");
      } else if (hitCount === 3) {
        showLine("💥 Alright. You asked for it. 😡💣");
      } else {
        showLine("😡 You never learn. 💥💥");
      }
    }, 1000);

    if (ep1UsedRef.current >= MAX_EP1_PER_STAGE) return;

    const bestCorner = getBestFourSquareCorner(board, 'player1');
    const p1Count = bestCorner
      ? bestCorner.filter(i => board[i]?.player === 'player1').length
      : 0;

    if (hitCount >= 3) {
      // Fully committed — use 4 Square if anything to clear, fall back to row/col
      if (!fourSquareUsedRef.current && bestCorner && p1Count >= 1) {
        setForcePower('fourSquare');
      } else {
        setForcePower(secondPowerRef.current);
      }
    } else if (hitCount === 2 && !fourSquareUsedRef.current && bestCorner && p1Count >= 2) {
      // Corner is already loaded — fire earlier
      setForcePower('fourSquare');
    }
    // Hit 1: pure taunt, no power queued
  }, [getCornerId, playNicoReactionSound, showLine]);

  // Called when player blocks Nico's epic — flavor only
  const triggerBlockedEpicResponse = useCallback(() => {
    const lines = personality.lines.onBlockedEpic ?? personality.lines.nervous;
    if (lines.length > 0) showLine(getRandomLine(lines));
  }, [personality, showLine]);

  // Intercepts CPU turn when a forced EP1 is queued
  const executeTurn = useCallback((ctx: CpuTurnContext, deps: NicoBehaviorDeps): boolean => {
    if (!forcePower) {
      maybeTriggerStageLine(deps.stageNumber);
      return false;
    }

    const { setBoard, setLastMoveIndex, showEp1Launch, onBumpDifficulty } = deps;

    const runForcedPower = () => {
      ep1UsedRef.current += 1;
      const used = ep1UsedRef.current;
      const powerToUse = forcePower;
      setForcePower(null);

      if (used >= MAX_EP1_PER_STAGE) {
        onBumpDifficulty(personality.epicAdaptDelta);
      }

      if (powerToUse === 'fourSquare') {
        fourSquareUsedRef.current = true;
        const result = applyFourSquarePower(ctx.board, getBestFourSquareCorner(ctx.board, 'player1'));
        if (result.affectedIndices.length > 0) {
          setBoard(result.nextBoard);
          setLastMoveIndex(result.lastMoveIndex);
          showEp1Launch(
            createGameBoardEffectEvent('fourSquare', 'Four Square', result.affectedIndices, ctx.board),
            true,
            'Nico used Four Square',
          );
          ctx.finishTurn(result.nextBoard, CPU_PLACE_FINISH_DELAY_MS);
          return;
        }
        // Fall through to row/column if fourSquare had nothing to clear
      }

      if (powerToUse === 'clearRow' || powerToUse === 'fourSquare') {
        const result = getClearRowTarget(ctx.board);
        if (result) {
          setBoard(result.nextBoard);
          setLastMoveIndex(result.targetIndex);
          showEp1Launch(
            createGameBoardEffectEvent('clearRow', 'Clear Row', result.affectedIndices, ctx.board),
            true,
            'Nico used Clear Row',
          );
          ctx.finishTurn(result.nextBoard, CPU_PLACE_FINISH_DELAY_MS);
          return;
        }
      }

      if (powerToUse === 'clearColumn' || powerToUse === 'fourSquare') {
        const result = getClearColumnTarget(ctx.board);
        if (result) {
          setBoard(result.nextBoard);
          setLastMoveIndex(result.targetIndex);
          showEp1Launch(
            createGameBoardEffectEvent('clearColumn', 'Clear Column', result.affectedIndices, ctx.board),
            true,
            'Nico used Clear Column',
          );
          ctx.finishTurn(result.nextBoard, CPU_PLACE_FINISH_DELAY_MS);
          return;
        }
      }

      // Nothing to clear — skip to normal turn
      showLine("Okay. I get you. Don't worry.");
      ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS);
    };

    const waitMs = Math.max(0, reactionReadyAtRef.current - Date.now());
    if (waitMs > 0) {
      cpuDelayTimerRef.current = setTimeout(runForcedPower, waitMs);
    } else {
      runForcedPower();
    }
    return true;
  }, [forcePower, maybeTriggerStageLine, personality, showLine]);

  return {
    thoughtText,
    triggerStageIntro,
    maybeTriggerStageLine,
    triggerPlayerSquareResponse,
    triggerBlockedEpicResponse,
    resetNico,
    resetNicoRound,
    executeTurn,
  };
}
