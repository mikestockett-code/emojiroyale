import { useCallback, useEffect, useRef } from 'react';
import type { BattlePowerSlotId, Player, WinnerInfo } from '../types';
import type { GuestMove, RoomData } from './multiplayerTypes';
import type { MultiplayerRoomController } from './useMultiplayerRoom';

type UseGuestMoveRelayOptions = {
  role: MultiplayerRoomController['role'];
  roomData: RoomData | null;
  currentPlayer: Player;
  winner: WinnerInfo;
  selectedPowerSlotId: BattlePowerSlotId | null;
  onSelectRackIndex: (rackIndex: number) => void;
  onPressPowerSlot: (slotId: BattlePowerSlotId) => void;
  onPressSquare: (boardIndex: number) => void;
  onPlaceFromRackIndex: (boardIndex: number, rackIndex: number) => boolean;
  onResolveRoll: (boardIndex: number, faceIndex: number) => void;
  clearGuestMove: MultiplayerRoomController['clearGuestMove'];
};

export function useGuestMoveRelay({
  role,
  roomData,
  currentPlayer,
  winner,
  selectedPowerSlotId,
  onSelectRackIndex,
  onPressPowerSlot,
  onPressSquare,
  onPlaceFromRackIndex,
  onResolveRoll,
  clearGuestMove,
}: UseGuestMoveRelayOptions) {
  const processedMoveRef = useRef<string | null>(null);

  const applyGuestMove = useCallback((move: GuestMove) => {
    if (move.uid !== roomData?.guestUid) return false;
    if (currentPlayer !== 'player2' || winner) return false;

    if (move.kind === 'selectRackIndex') {
      onSelectRackIndex(move.rackIndex);
      return true;
    }

    if (move.kind === 'pressPowerSlot') {
      onPressPowerSlot(move.slotId);
      return true;
    }

    if (move.kind === 'pressSquare') {
      if (selectedPowerSlotId) {
        onPressSquare(move.boardIndex);
        return true;
      }
      if (move.selectedRackIndex === null) return false;
      return onPlaceFromRackIndex(move.boardIndex, move.selectedRackIndex);
    }

    if (move.kind === 'rollTile') {
      onResolveRoll(move.boardIndex, move.faceIndex);
      return true;
    }

    return false;
  }, [
    currentPlayer,
    onPlaceFromRackIndex,
    onPressPowerSlot,
    onPressSquare,
    onSelectRackIndex,
    onResolveRoll,
    roomData?.guestUid,
    selectedPowerSlotId,
    winner,
  ]);

  useEffect(() => {
    if (role !== 'host') return;
    const move = roomData?.guestMove;
    if (!move || move.id === processedMoveRef.current || move.id === roomData?.processedGuestMoveId) return;

    const accepted = applyGuestMove(move);
    if (!accepted) return;

    processedMoveRef.current = move.id;
    clearGuestMove(move.id).catch((error) => {
      console.warn('Failed to clear guest move', error);
    });
  }, [applyGuestMove, clearGuestMove, role, roomData?.guestMove, roomData?.processedGuestMoveId]);
}
