import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { BOARD_SIZE } from '../constants/gameConstants';
import type { RollFlowViewModel } from '../hooks/rollFlowTypes';
import type { BattlePowerSlotId, BoardCell, Player, StickerId, WinnerInfo } from '../types';
import type { AudioSourceKey } from '../lib/audio';
import { createSharedPlayerRacks } from '../lib/sharedRackLogic';
import type { MultiplayerRoomController } from './useMultiplayerRoom';
import type { SerializedGameState, SerializedPowerSlots, SerializedPowerUses } from './multiplayerTypes';
import { getWinnerDisplayTitle, getWinnerResultType } from '../lib/roundResult';
import type { GameBoardEffectEvent } from '../lib/gameBoardEffects';

export type OnlineGameOptions = {
  hostName: string;
  guestName: string;
};

export type PendingGuestMove =
  | { kind: 'selectRackIndex'; rackIndex: number }
  | { kind: 'pressSquare'; boardIndex: number; selectedRackIndex: number | null; selectedPowerSlotId?: BattlePowerSlotId | null }
  | { kind: 'pressPowerSlot'; slotId: BattlePowerSlotId }
  | { kind: 'rollTile'; boardIndex: number; faceIndex: number };

type SerializeHostStateParams = {
  board: BoardCell[];
  playerRacks: Record<Player, StickerId[]>;
  currentPlayer: Player;
  rollCounts: Record<Player, number>;
  hostPowers: SerializedPowerSlots | null | undefined;
  guestPowers: SerializedPowerSlots | null | undefined;
  selectedPowerSlotId: BattlePowerSlotId | null;
  powerUses?: SerializedPowerUses;
  winner: WinnerInfo;
  hostName: string;
  guestName: string;
  lastMoveIndex: number | null;
  lastMoveType: 'place' | 'roll' | 'power' | null;
  lastSoundKey?: AudioSourceKey | null;
  lastEffectEvent?: GameBoardEffectEvent | null;
};

export function otherPlayer(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

export function playerForRole(role: MultiplayerRoomController['role']): Player {
  return role === 'guest' ? 'player2' : 'player1';
}

export function createMoveId(uid: string | null | undefined) {
  return `${uid ?? 'guest'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function winnerTitleFor(winner: WinnerInfo, hostName: string, guestName: string) {
  return getWinnerDisplayTitle(winner, { player1: hostName, player2: guestName });
}

export function winnerTypeFor(winner: WinnerInfo) {
  return getWinnerResultType(winner);
}

export function serializeOnlineHostState({
  board,
  playerRacks,
  currentPlayer,
  rollCounts,
  hostPowers,
  guestPowers,
  selectedPowerSlotId,
  powerUses,
  winner,
  hostName,
  guestName,
  lastMoveIndex,
  lastMoveType,
  lastSoundKey = null,
  lastEffectEvent = null,
}: SerializeHostStateParams): SerializedGameState {
  return {
    board,
    playerRacks,
    currentPlayer,
    rollsRemaining: rollCounts,
    powerSlots: {
      host: hostPowers ?? { slot1: null, slot2: null },
      guest: guestPowers ?? { slot1: null, slot2: null },
    },
    powerUses: powerUses ?? createInitialPowerUses(hostPowers, guestPowers),
    selectedPowerSlotId,
    lastMoveType,
    lastSoundKey,
    lastEffectEvent,
    winnerPlayer: winner?.player ?? null,
    winnerTitle: winnerTitleFor(winner, hostName, guestName),
    winnerType: winnerTypeFor(winner),
    winningLineIndices: winner?.indices ?? [],
    lastMoveIndex,
    roundNumber: 1,
    updatedAt: Date.now(),
  };
}

export function createInitialPowerUses(
  hostPowers: SerializedPowerSlots | null | undefined,
  guestPowers: SerializedPowerSlots | null | undefined,
): SerializedPowerUses {
  return {
    host: {
      slot1: hostPowers?.slot1 ? 1 : 0,
      slot2: hostPowers?.slot2 ? 1 : 0,
    },
    guest: {
      slot1: guestPowers?.slot1 ? 1 : 0,
      slot2: guestPowers?.slot2 ? 1 : 0,
    },
  };
}

type CreateInitialOnlineGameStateParams = {
  hostPowers: SerializedPowerSlots | null | undefined;
  guestPowers: SerializedPowerSlots | null | undefined;
  hostName: string;
  guestName: string;
};

export function createInitialOnlineGameState({
  hostPowers,
  guestPowers,
  hostName,
  guestName,
}: CreateInitialOnlineGameStateParams): SerializedGameState {
  return serializeOnlineHostState({
    board: Array.from({ length: BOARD_SIZE }, () => null) as BoardCell[],
    playerRacks: createSharedPlayerRacks(),
    currentPlayer: 'player1',
    rollCounts: { player1: 3, player2: 3 },
    hostPowers,
    guestPowers,
    selectedPowerSlotId: null,
    winner: null,
    hostName,
    guestName,
    lastMoveIndex: null,
    lastMoveType: null,
    lastSoundKey: null,
    lastEffectEvent: null,
  });
}

function normalizeBoard(board: SerializedGameState['board'] | Record<string, BoardCell> | null | undefined): BoardCell[] {
  const nextBoard = Array.from({ length: BOARD_SIZE }, () => null) as BoardCell[];
  if (!board) return nextBoard;

  if (Array.isArray(board)) {
    for (let index = 0; index < BOARD_SIZE; index += 1) {
      nextBoard[index] = board[index] ?? null;
    }
    return nextBoard;
  }

  Object.entries(board).forEach(([key, cell]) => {
    const index = Number(key);
    if (Number.isInteger(index) && index >= 0 && index < BOARD_SIZE) {
      nextBoard[index] = cell ?? null;
    }
  });
  return nextBoard;
}

function normalizeRack(rack: StickerId[] | Record<string, StickerId> | null | undefined): StickerId[] {
  if (!rack) return [];
  if (Array.isArray(rack)) return rack.filter(Boolean);
  return Object.keys(rack)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => rack[key])
    .filter(Boolean);
}

export function normalizeOnlineGameState(state: SerializedGameState | null | undefined): SerializedGameState | null {
  if (!state) return null;

  return {
    ...state,
    board: normalizeBoard(state.board as SerializedGameState['board'] | Record<string, BoardCell>),
    playerRacks: {
      player1: normalizeRack(state.playerRacks?.player1 as StickerId[] | Record<string, StickerId> | null | undefined),
      player2: normalizeRack(state.playerRacks?.player2 as StickerId[] | Record<string, StickerId> | null | undefined),
    },
    currentPlayer: state.currentPlayer ?? 'player1',
    rollsRemaining: {
      player1: state.rollsRemaining?.player1 ?? 3,
      player2: state.rollsRemaining?.player2 ?? 3,
    },
    powerSlots: {
      host: state.powerSlots?.host ?? { slot1: null, slot2: null },
      guest: state.powerSlots?.guest ?? { slot1: null, slot2: null },
    },
    powerUses: state.powerUses ?? createInitialPowerUses(state.powerSlots?.host, state.powerSlots?.guest),
    selectedPowerSlotId: state.selectedPowerSlotId ?? null,
    lastMoveType: state.lastMoveType ?? null,
    lastSoundKey: state.lastSoundKey ?? null,
    lastEffectEvent: state.lastEffectEvent ?? null,
    winnerPlayer: state.winnerPlayer ?? null,
    winnerTitle: state.winnerTitle ?? null,
    winnerType: state.winnerType ?? null,
    winningLineIndices: state.winningLineIndices ?? [],
    lastMoveIndex: state.lastMoveIndex ?? null,
    roundNumber: state.roundNumber ?? 1,
    updatedAt: state.updatedAt ?? Date.now(),
  };
}

export function useDisabledRollFlow(): RollFlowViewModel {
  const previewScale = useRef(new Animated.Value(1)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const previewFlashOpacity = useRef(new Animated.Value(0)).current;
  const previewRotationBase = useRef(new Animated.Value(0)).current;
  const previewRotationDeg = useMemo(
    () => previewRotationBase.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '0deg'] }),
    [previewRotationBase],
  );

  return useMemo(() => ({
    phase: 'inactive',
    isActive: false,
    isBusy: false,
    selectedTileIndex: null,
    previewStickerId: null,
    previewOwner: null,
    previewScale,
    previewOpacity,
    previewFlashOpacity,
    previewRotationDeg,
    enterRollMode: () => {},
    handleBoardTilePress: () => false,
    beginRoll: () => {},
    resetRollState: () => {},
    startCpuRoll: () => {},
  }), [previewFlashOpacity, previewOpacity, previewRotationDeg, previewScale]);
}
