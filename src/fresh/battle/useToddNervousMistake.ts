import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoardCell, Player, StickerId } from '../../types';
import type { BattleCpuId } from './battleCpuConfig';
import { getRandomToddNervousLine } from './battleCpuConfig';
import type { CpuTurnContext } from '../../hooks/useSoloCpu';
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
  setBoard: (b: BoardCell[]) => void;
  setPlayerRacks: (r: Record<Player, StickerId[]>) => void;
  setLastMoveIndex: (i: number | null) => void;
  showEp1Launch: (event: GameBoardEffectEvent | string) => void;
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
  const [mistakeTurns, setMistakeTurns] = useState(0);
  const [thoughtText, setThoughtText] = useState<string | null>(null);
  const [isTimerStealing, setIsTimerStealing] = useState(false);
  const [cpuTimeWarpUsed, setCpuTimeWarpUsed] = useState(false);
  const [cpuClearRowUsed, setCpuClearRowUsed] = useState(false);
  const [cpuForcePower, setCpuForcePower] = useState<'timeWarp' | 'clearRow' | null>(null);
  const thoughtTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMistakeEp1EffectIdRef = useRef<GameBoardEffectId | null>(null);

  useEffect(() => () => {
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    if (stealTimerRef.current) clearTimeout(stealTimerRef.current);
  }, []);

  const fireTimeWarp = useCallback((addTimerSeconds: (n: number) => void) => {
    addTimerSeconds(-30);
    setThoughtText(getRandomTimeWarpLine());
    setIsTimerStealing(true);
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    if (stealTimerRef.current) clearTimeout(stealTimerRef.current);
    thoughtTimerRef.current = setTimeout(() => { setThoughtText(null); }, 2800);
    stealTimerRef.current = setTimeout(() => { setIsTimerStealing(false); }, 1500);
  }, []);

  const triggerPlayerPowerResponse = useCallback(() => {
    const available: Array<'timeWarp' | 'clearRow'> = [];
    if (!cpuTimeWarpUsed) available.push('timeWarp');
    if (!cpuClearRowUsed) available.push('clearRow');
    if (available.length > 0 && Math.random() < 0.7) {
      setCpuForcePower(available[Math.floor(Math.random() * available.length)]!);
    } else if (cpuId === 'todd') {
      setMistakeTurns(1);
      setThoughtText(getRandomToddNervousLine());
      if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
      thoughtTimerRef.current = setTimeout(() => {
        setThoughtText(null);
        thoughtTimerRef.current = null;
      }, 2800);
    }
  }, [cpuId, cpuTimeWarpUsed, cpuClearRowUsed]);

  const resetTodd = useCallback(() => {
    setMistakeTurns(0);
    setThoughtText(null);
    setIsTimerStealing(false);
    setCpuTimeWarpUsed(false);
    setCpuClearRowUsed(false);
    setCpuForcePower(null);
    lastMistakeEp1EffectIdRef.current = null;
    if (thoughtTimerRef.current) { clearTimeout(thoughtTimerRef.current); thoughtTimerRef.current = null; }
    if (stealTimerRef.current) { clearTimeout(stealTimerRef.current); stealTimerRef.current = null; }
  }, []);

  const executeTurn = useCallback((ctx: CpuTurnContext, deps: ToddTurnDeps): boolean => {
    const { addTimerSeconds, setBoard, setLastMoveIndex, showEp1Launch, playerRacks, rollFlow, roundNumber, setPlayerRacks } = deps;

    if (cpuForcePower === 'timeWarp') {
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
        showEp1Launch(createGameBoardEffectEvent('clearRow', 'Clear Row', clearResult.affectedIndices, ctx.board));
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
        cpuTileIndices.length > 0 ? 'selfEp1' : null,
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
        showEp1Launch(createGameBoardEffectEvent('removeTile', 'Remove Tile', [target], ctx.board));
        ctx.finishTurn(nextBoard);
        return true;
      }
      if (mistake === 'selfEp1') {
        const target = cpuTileIndices[Math.floor(Math.random() * cpuTileIndices.length)];
        if (target === undefined) { ctx.finishTurn(ctx.board, CPU_ROLL_FINISH_DELAY_MS); return true; }
        const ep1Result = applyRandomGameBoardEffect(ctx.board, target, lastMistakeEp1EffectIdRef.current, 'player1');
        lastMistakeEp1EffectIdRef.current = ep1Result.effectId;
        setBoard(ep1Result.nextBoard);
        setLastMoveIndex(ep1Result.lastMoveIndex ?? target);
        showEp1Launch(createGameBoardEffectEvent(ep1Result.effectId, ep1Result.effectLabel, ep1Result.affectedIndices, ctx.board));
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

    if (!cpuTimeWarpUsed && Math.random() < 0.10) {
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
        showEp1Launch(createGameBoardEffectEvent('clearRow', 'Clear Row', clearResult.affectedIndices, ctx.board));
        ctx.finishTurn(clearResult.nextBoard, CPU_PLACE_FINISH_DELAY_MS);
        return true;
      }
    }

    return false;
  }, [cpuForcePower, cpuTimeWarpUsed, cpuClearRowUsed, mistakeTurns]);

  return {
    thoughtText,
    isTimerStealing,
    triggerPlayerPowerResponse,
    resetTodd,
    executeTurn,
  };
}
