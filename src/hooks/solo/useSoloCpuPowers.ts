import { useCallback, useRef, useState } from 'react';
import type { BattlePowerId, BattlePowerSlotId, BattlePowerSlotLoadout, BoardCell } from '../../types';
import { applyFourSquarePower, applyTornadoPower } from '../../lib/battlePowerEffects';
import {
  applyTargetedGameBoardEffect,
  createGameBoardEffectEvent,
  type GameBoardEffectEvent,
  type GameBoardEffectResult,
} from '../../lib/gameBoardEffects';
import { BATTLE_TEST_POWERS } from '../../data/battlePowers';
import { useGamePowerSlots } from '../useGamePowerSlots';
import { CPU_ROLL_FINISH_DELAY_MS } from '../useSoloCpu';

const CPU_EP1_POOL: BattlePowerId[] = [
  'power-four-square',
  'power-tornado',
  'power-clear-row',
  'power-clear-column',
  'power-remove-emoji',
];

type UseSoloCpuPowersOptions = {
  setBoard: (board: BoardCell[]) => void;
  setLastMoveIndex: (index: number | null) => void;
  showEp1Launch: (event: GameBoardEffectEvent, showStatus?: boolean, statusLabel?: string) => void;
};

function applyCpuEP1Power(powerId: BattlePowerId, board: BoardCell[]): GameBoardEffectResult | null {
  if (powerId === 'power-four-square') {
    const r = applyFourSquarePower(board);
    return r.affectedIndices.length > 0 ? { ...r, effectId: 'fourSquare', effectLabel: 'Four Square' } : null;
  }
  if (powerId === 'power-tornado') {
    const r = applyTornadoPower(board);
    return r.affectedIndices.length > 0 ? { ...r, effectId: 'tornado', effectLabel: 'Tornado' } : null;
  }
  const p1Idx = board.findIndex(c => c?.player === 'player1');
  if (p1Idx < 0) return null;
  return applyTargetedGameBoardEffect(board, p1Idx, powerId);
}

export function useSoloCpuPowers({
  setBoard,
  setLastMoveIndex,
  showEp1Launch,
}: UseSoloCpuPowersOptions) {
  const [cpuSlotIds] = useState<BattlePowerSlotLoadout>(() => {
    const shuffled = [...CPU_EP1_POOL].sort(() => Math.random() - 0.5);
    return { slot1: shuffled[0], slot2: shuffled[1] };
  });
  const cpuPowers = useGamePowerSlots(cpuSlotIds);
  const cpuMoveCountRef = useRef(0);

  const interceptCpuTurn = useCallback((ctx: { board: BoardCell[]; finishTurn: (b: BoardCell[], delay?: number) => void }) => {
    cpuMoveCountRef.current += 1;
    if (cpuMoveCountRef.current <= 1) return false;
    if (ctx.board.filter(c => c !== null).length < 5) return false;
    const slotId = (['slot1', 'slot2'] as BattlePowerSlotId[]).find(
      s => cpuSlotIds[s] && (cpuPowers.powerSlotData[s]?.usesLeft ?? 0) > 0,
    );
    if (!slotId) return false;
    const powerId = cpuSlotIds[slotId];
    if (!powerId) return false;
    const result = applyCpuEP1Power(powerId, ctx.board);
    if (!result) return false;
    cpuPowers.consumePower(slotId);
    setBoard(result.nextBoard);
    setLastMoveIndex(result.lastMoveIndex);
    showEp1Launch(
      createGameBoardEffectEvent(result.effectId, result.effectLabel, result.affectedIndices, ctx.board),
      true,
      `CPU used ${result.effectLabel}`,
    );
    ctx.finishTurn(result.nextBoard, CPU_ROLL_FINISH_DELAY_MS);
    return true;
  }, [cpuPowers, cpuSlotIds, setBoard, setLastMoveIndex, showEp1Launch]);

  const refillCpuPower = useCallback(() => {
    const result = cpuPowers.refillPowerJackpot();
    if (!result) return null;
    const powerId = cpuSlotIds[result.slotId];
    const label = BATTLE_TEST_POWERS.find((power) => power.id === powerId)?.label ?? result.label;
    return { label, bonusCount: result.bonusCount, banked: result.banked };
  }, [cpuPowers, cpuSlotIds]);

  const resetCpuPowers = useCallback(() => {
    cpuPowers.resetPowers();
    cpuMoveCountRef.current = 0;
  }, [cpuPowers]);

  return {
    interceptCpuTurn,
    refillCpuPower,
    resetCpuPowers,
  };
}
