import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoardCell, Player, StickerId } from '../../types';
import type { BattleCpuId } from './battleCpuConfig';
import { getCpuPersonality } from './battleCpuConfig';
import type { CpuTurnContext } from '../../hooks/useSoloCpu';
import { useAudioContext } from '../audio/AudioContext';
import { CPU_ROLL_FINISH_DELAY_MS, CPU_PLACE_FINISH_DELAY_MS } from '../../hooks/useSoloCpu';
import type { CpuRollFlow } from '../../hooks/rollFlowTypes';
import { applyRandomGameBoardEffect, createGameBoardEffectEvent } from '../../lib/gameBoardEffects';
import type { GameBoardEffectEvent, GameBoardEffectId } from '../../lib/gameBoardEffects';
import { applyDieFace, buildDieCell } from '../../lib/diceLogic';
import { createSharedRack } from '../../lib/sharedRackLogic';

function getCpuClearRowTarget(board: BoardCell[]): { nextBoard: BoardCell[]; targetIndex: number; affectedIndices: number[] } | null {
  let bestRow = -1, bestCount = 0;
  for (let row = 0; row < 5; row++) {
    let count = 0;
    for (let col = 0; col < 5; col++) {
      if (board[row * 5 + col]?.player === 'player1') count++;
    }
    if (count > bestCount) { bestCount = count; bestRow = row; }
  }
  if (bestRow < 0) return null;
  const nextBoard = [...board];
  const affectedIndices: number[] = [];
  for (let col = 0; col < 5; col++) {
    const idx = bestRow * 5 + col;
    affectedIndices.push(idx);
    nextBoard[idx] = null;
  }
  return { nextBoard, targetIndex: bestRow * 5, affectedIndices };
}

export type ToddTurnDeps = {
  playerRacks: Record<Player, StickerId[]>;
  rollFlow: CpuRollFlow | undefined;
  roundNumber: number;
  timerFrozen: boolean;
  setBoard: (b: BoardCell[]) => void;
  setPlayerRacks: (r: Record<Player, StickerId[]>) => void;
  setLastMoveIndex: (i: number | null) => void;
  showEp1Launch: (event: GameBoardEffectEvent | string, showStatus?: boolean, statusLabel?: string) => void;
  addTimerSeconds: (n: number) => void;
};

const TIME_WARP_LINES = [
  'Watch your clock...',
  'Tick tock... 😈',
  'There goes 30 seconds!',
  'Time is mine now.',
  'Clock looks a little low...',
];

function getRandomTimeWarpLine() {
  return TIME_WARP_LINES[Math.floor(Math.random() * TIME_WARP_LINES.length)]!;
}

export function useToddNervousMistake(cpuId: BattleCpuId) {
  const { playSound } = useAudioContext();
  const toddLines = getCpuPersonality('todd').lines.nervous;
  const [mistakeTurns, setMistakeTurns] = useState(0);
  const [thoughtText, setThoughtText] = useState<string | null>(null);
  const [isTimerStealing, setIsTimerStealing] = useState(false);
  const [cpuTimeWarpUsed, setCpuTimeWarpUsed] = useState(false);
  const [cpuClearRowUsed, setCpuClearRowUsed] = useState(false);
  const [cpuForcePower, setCpuForcePower] = useState<'timeWarp' | 'clearRow' | null>(null);
  const thoughtTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMistakeEp1EffectIdRef = useRef<GameBoardEffectId | null>(null);

  useEffect(() => () => {
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    if (stealTimerRef.current) clearTimeout(stealTimerRef.current);
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
  }, []);

  const showThoughtText = useCallback((line: string | null, durationMs = 3200) => {
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    setThoughtText(line);
    if (!line) {
      thoughtTimerRef.current = null;
      return;
    }
    thoughtTimerRef.current = setTimeout(() => {
      setThoughtText(null);
      thoughtTimerRef.current = null;
    }, durationMs);
  }, []);

  const fireTimeWarp = useCallback((addTimerSeconds: (n: number) => void) => {
    // Sound fires first so it grabs the player's attention before the visual
    playSound('warpSpeed');
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    if (stealTimerRef.current) clearTimeout(stealTimerRef.current);
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    // Short pause → red clock beats → player looks at timer
    stealTimerRef.current = setTimeout(() => {
      setIsTimerStealing(true);  // stays red for the rest of the round (resetTodd clears it)
      setThoughtText(getRandomTimeWarpLine());
    }, 180);
    // Clock drops AFTER player sees the red animation start
    dropTimerRef.current = setTimeout(() => {
      addTimerSeconds(-15);
    }, 480);
    // Thought text clears after a few seconds; red clock persists until round reset
    thoughtTimerRef.current = setTimeout(() => { setThoughtText(null); }, 3200);
  }, [playSound]);

  const triggerPlayerPowerResponse = useCallback(() => {
    const available: Array<'timeWarp' | 'clearRow'> = [];
    if (!cpuTimeWarpUsed) available.push('timeWarp');
    if (!cpuClearRowUsed) available.push('clearRow');
    if (available.length > 0 && Math.random() < 0.7) {
      setCpuForcePower(available[Math.floor(Math.random() * available.length)]!);
    } else if (cpuId === 'todd') {
      setMistakeTurns(1);
      showThoughtText(toddLines[Math.floor(Math.random() * toddLines.length)] ?? '', 2800);
    }
  }, [cpuId, cpuTimeWarpUsed, cpuClearRowUsed, showThoughtText, toddLines]);

  const resetToddRound = useCallback(() => {
    setMistakeTurns(0);
    setThoughtText(null);
    setIsTimerStealing(false);
    setCpuForcePower(null);
    lastMistakeEp1EffectIdRef.current = null;
    if (thoughtTimerRef.current) { clearTimeout(thoughtTimerRef.current); thoughtTimerRef.current = null; }
    if (stealTimerRef.current) { clearTimeout(stealTimerRef.current); stealTimerRef.current = null; }
    if (dropTimerRef.current) { clearTimeout(dropTimerRef.current); dropTimerRef.current = null; }
  }, []);

  const resetTodd = useCallback(() => {
    resetToddRound();
    setCpuTimeWarpUsed(false);
    setCpuClearRowUsed(false);
  }, [resetToddRound]);

  const executeTurn = useCallback((ctx: CpuTurnContext, deps: ToddTurnDeps): boolean => {
    const { addTimerSeconds, setBoard, setLastMoveIndex, showEp1Launch, playerRacks, rollFlow, roundNumber, setPlayerRacks, timerFrozen } = deps;

    // Never use powers or rolls on the first CPU move of the round
    const cpuTilesOnBoard = ctx.board.filter(c => c?.player === 'player2').length;
    if (cpuTilesOnBoard === 0) return false;

    if (cpuForcePower === 'timeWarp') {
      if (timerFrozen) {
        setCpuForcePower(null);
        return false;
      }
      setCpuForcePower(null);
      setCpuTimeWarpUsed(true);
      fireTimeWarp(addTimerSeconds);
      ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS);
      return true;
    }
    if (cpuForcePower === 'clearRow') {
      setCpuForcePower(null);
      setCpuClearRowUsed(true);
      const clearResult = getCpuClearRowTarget(ctx.board);
      if (clearResult) {
        setBoard(clearResult.nextBoard);
        setLastMoveIndex(clearResult.targetIndex);
        showEp1Launch(
          createGameBoardEffectEvent('clearRow', 'Clear Row', clearResult.affectedIndices, ctx.board),
          true,
          'Todd used Clear Row',
        );
        ctx.finishTurn(clearResult.nextBoard);
      } else {
        ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS);
      }
      return true;
    }

    if (mistakeTurns > 0) {
      const emptySpots = ctx.board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
      const cpuTileIndices = ctx.board.map((c, i) => c?.player === 'player2' ? i : -1).filter(i => i >= 0);
      const cpuRollTargets = cpuTileIndices.filter(i => Boolean(ctx.board[i]?.faces));
      const cpuRack = playerRacks.player2;
      const rackIdx = cpuRack.findIndex(Boolean);
      const stickerToPlace = rackIdx >= 0 ? cpuRack[rackIdx] : undefined;

      const mistakePool = [
        cpuTileIndices.length > 0 ? 'selfErase' : null,
        cpuTileIndices.length > 0 && !cpuClearRowUsed ? 'selfEp1' : null,
        cpuRollTargets.length > 0 && rollFlow ? 'rollOwnToPlayer' : null,
        emptySpots.length > 0 && stickerToPlace ? 'randomPlace' : null,
        'helpClock',
      ].filter(Boolean) as string[];
      const mistake = mistakePool[Math.floor(Math.random() * mistakePool.length)] ?? 'helpClock';
      setMistakeTurns(c => Math.max(0, c - 1));

      if (mistake === 'selfErase') {
        const target = cpuTileIndices[Math.floor(Math.random() * cpuTileIndices.length)];
        if (target === undefined) { ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS); return true; }
        const nextBoard = [...ctx.board];
        nextBoard[target] = null;
        setBoard(nextBoard);
        setLastMoveIndex(target);
        showEp1Launch(
          createGameBoardEffectEvent('removeTile', 'Remove Tile', [target], ctx.board),
          true,
          'Todd used Remove Tile',
        );
        ctx.finishTurn(nextBoard);
        return true;
      }
      if (mistake === 'selfEp1') {
        const target = cpuTileIndices[Math.floor(Math.random() * cpuTileIndices.length)];
        if (target === undefined) { ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS); return true; }
        setCpuClearRowUsed(true);
        const ep1Result = applyRandomGameBoardEffect(ctx.board, target, lastMistakeEp1EffectIdRef.current, 'player1');
        lastMistakeEp1EffectIdRef.current = ep1Result.effectId;
        setBoard(ep1Result.nextBoard);
        setLastMoveIndex(ep1Result.lastMoveIndex ?? target);
        showEp1Launch(
          createGameBoardEffectEvent(ep1Result.effectId, ep1Result.effectLabel, ep1Result.affectedIndices, ctx.board),
          true,
          `Todd used ${ep1Result.effectLabel}`,
        );
        ctx.finishTurn(ep1Result.nextBoard, CPU_ROLL_FINISH_DELAY_MS);
        return true;
      }
      if (mistake === 'rollOwnToPlayer' && rollFlow) {
        const target = cpuRollTargets[Math.floor(Math.random() * cpuRollTargets.length)];
        if (target === undefined) { ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS); return true; }
        const finalFaceIndex = Math.random() < 0.5 ? 0 : 1;
        rollFlow.startCpuRoll(target, finalFaceIndex, (idx, faceIndex) => {
          const rolledBoard = [...ctx.board];
          const rolledCell = rolledBoard[idx];
          if (rolledCell) rolledBoard[idx] = applyDieFace(rolledCell, faceIndex);
          setBoard(rolledBoard);
          setLastMoveIndex(idx);
          ctx.finishTurn(rolledBoard, CPU_ROLL_FINISH_DELAY_MS);
        });
        return true;
      }
      if (mistake === 'randomPlace' && stickerToPlace) {
        const placeIndex = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        if (placeIndex === undefined) { ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS); return true; }
        const newBoard = [...ctx.board];
        newBoard[placeIndex] = buildDieCell('player2', stickerToPlace, roundNumber, 'battle');
        setBoard(newBoard);
        setPlayerRacks({ ...playerRacks, player2: createSharedRack(undefined, { soloMode: 'battle', roundNumber }) });
        setLastMoveIndex(placeIndex);
        ctx.finishTurn(newBoard);
        return true;
      }
      addTimerSeconds(10);
      ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS);
      return true;
    }

    if (!cpuTimeWarpUsed && !timerFrozen && Math.random() < 0.10) {
      setCpuTimeWarpUsed(true);
      fireTimeWarp(addTimerSeconds);
      ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS);
      return true;
    }
    if (!cpuClearRowUsed && Math.random() < 0.10) {
      const clearResult = getCpuClearRowTarget(ctx.board);
      if (clearResult) {
        setCpuClearRowUsed(true);
        setBoard(clearResult.nextBoard);
        setLastMoveIndex(clearResult.targetIndex);
        showEp1Launch(
          createGameBoardEffectEvent('clearRow', 'Clear Row', clearResult.affectedIndices, ctx.board),
          true,
          'Todd used Clear Row',
        );
        ctx.finishTurn(clearResult.nextBoard, CPU_PLACE_FINISH_DELAY_MS);
        return true;
      }
    }

    return false;
  }, [cpuForcePower, cpuTimeWarpUsed, cpuClearRowUsed, mistakeTurns]);

  return {
    thoughtText,
    isTimerStealing,
    showThoughtText,
    triggerPlayerPowerResponse,
    resetTodd,
    resetToddRound,
    executeTurn,
  };
}
