import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import type { RollFlowViewModel } from '../hooks/rollFlowTypes';
import type { BattlePowerSlotId, BoardCell, Player, StickerId, WinnerInfo } from '../types';
import type { MultiplayerRoomController } from './useMultiplayerRoom';
import type { SerializedGameState, SerializedPowerSlots } from './multiplayerTypes';
import { getWinnerDisplayTitle, getWinnerResultType } from '../lib/roundResult';

export type OnlineGameOptions = {
  hostName: string;
  guestName: string;
};

export type PendingGuestMove =
  | { kind: 'selectRackIndex'; rackIndex: number }
  | { kind: 'pressSquare'; boardIndex: number; selectedRackIndex: number | null }
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
  winner: WinnerInfo;
  hostName: string;
  guestName: string;
  lastMoveIndex: number | null;
  lastMoveType: 'place' | 'roll' | 'power' | null;
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
  winner,
  hostName,
  guestName,
  lastMoveIndex,
  lastMoveType,
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
    selectedPowerSlotId,
    lastMoveType,
    winnerPlayer: winner?.player ?? null,
    winnerTitle: winnerTitleFor(winner, hostName, guestName),
    winnerType: winnerTypeFor(winner),
    winningLineIndices: winner?.indices ?? [],
    lastMoveIndex,
    roundNumber: 1,
    updatedAt: Date.now(),
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
