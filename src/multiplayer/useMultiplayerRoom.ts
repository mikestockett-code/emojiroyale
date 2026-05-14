import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { ensureSignedIn } from '../firebase/anonymousAuth';
import type {
  GuestMove,
  MultiplayerPhase,
  MultiplayerRole,
  MultiplayerWagerMode,
  RoomData,
  SerializedGameState,
  SerializedPowerSlots,
} from './multiplayerTypes';
import * as roomService from './roomService';

export function useMultiplayerRoom() {
  const [role, setRole] = useState<MultiplayerRole | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const presenceCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    ensureSignedIn().then(setUid).catch((error) => {
      console.warn('Anonymous Firebase sign-in failed', error);
    });
  }, []);

  useEffect(() => {
    if (!roomCode) {
      setRoomData(null);
      return undefined;
    }
    return roomService.subscribeToRoom(roomCode, setRoomData);
  }, [roomCode]);

  const registerPresence = useCallback(async (code: string, nextRole: MultiplayerRole) => {
    presenceCleanupRef.current?.();
    await roomService.writePresence(code, nextRole, true);
    presenceCleanupRef.current = await roomService.attachPresenceDisconnect(code, nextRole);
  }, []);

  useEffect(() => {
    if (!roomCode || !role) return undefined;

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        registerPresence(roomCode, role).catch(() => {});
      }
    });

    return () => subscription.remove();
  }, [registerPresence, role, roomCode]);

  useEffect(() => () => {
    presenceCleanupRef.current?.();
  }, []);

  const createRoom = useCallback(async (
    hostName: string,
    wagerMode: MultiplayerWagerMode = 'none',
    isGoldenPhoenixEntry = false,
  ) => {
    const hostUid = uid ?? await ensureSignedIn();
    setUid(hostUid);

    let code = roomService.generateRoomCode();
    let created = false;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      code = roomService.generateRoomCode();
      try {
        await roomService.createRoom(code, hostName, hostUid, wagerMode, isGoldenPhoenixEntry);
        created = true;
        break;
      } catch (error) {
        if (attempt >= 4) throw error;
      }
    }
    if (!created) throw new Error('Could not create a unique multiplayer room code');

    setRole('host');
    setRoomCode(code);
    await registerPresence(code, 'host');
    return code;
  }, [registerPresence, uid]);

  const joinRoom = useCallback(async (code: string, guestName: string) => {
    const guestUid = uid ?? await ensureSignedIn();
    setUid(guestUid);

    const normalizedCode = roomService.normalizeRoomCode(code);
    const result = await roomService.joinRoom(normalizedCode, guestName, guestUid);
    if (result === 'ok') {
      setRole('guest');
      setRoomCode(normalizedCode);
      await registerPresence(normalizedCode, 'guest');
    }
    return result;
  }, [registerPresence, uid]);

  const setMyPowers = useCallback((slots: SerializedPowerSlots) => {
    if (!roomCode || !role) return Promise.resolve();
    return role === 'host'
      ? roomService.setHostPowers(roomCode, slots)
      : roomService.setGuestPowers(roomCode, slots);
  }, [role, roomCode]);

  const writeGameState = useCallback((state: SerializedGameState) => {
    if (!roomCode || role !== 'host') return Promise.resolve();
    return roomService.writeGameState(roomCode, state);
  }, [role, roomCode]);

  const writeGuestMove = useCallback((move: GuestMove) => {
    if (!roomCode || role !== 'guest') return Promise.resolve();
    return roomService.writeGuestMove(roomCode, move);
  }, [role, roomCode]);

  const clearGuestMove = useCallback(async (processedMoveId?: string | null) => {
    if (!roomCode || role !== 'host') return;
    if (processedMoveId !== undefined) {
      await roomService.writeProcessedGuestMoveId(roomCode, processedMoveId);
    }
    await roomService.clearGuestMove(roomCode);
  }, [role, roomCode]);

  const writeGoldenPhoenixWinner = useCallback((name: string) => {
    if (!roomCode || role !== 'host') return Promise.resolve();
    return roomService.writeGoldenPhoenixWinner(roomCode, name);
  }, [role, roomCode]);

  const advancePhase = useCallback((phase: MultiplayerPhase) => {
    if (!roomCode || role !== 'host') return Promise.resolve();
    return roomService.setPhase(roomCode, phase);
  }, [role, roomCode]);

  const setPresence = useCallback((connected: boolean) => {
    if (!roomCode || !role) return Promise.resolve();
    return roomService.writePresence(roomCode, role, connected);
  }, [role, roomCode]);

  const leaveRoom = useCallback(async () => {
    const code = roomCode;
    const currentRole = role;
    presenceCleanupRef.current?.();
    presenceCleanupRef.current = null;
    setRole(null);
    setRoomCode(null);
    setRoomData(null);
    if (code && currentRole) {
      await roomService.leaveRoom(code, currentRole);
    }
  }, [role, roomCode]);

  return {
    role,
    roomCode,
    roomData,
    uid,
    createRoom,
    joinRoom,
    setMyPowers,
    writeGameState,
    writeGuestMove,
    clearGuestMove,
    writeGoldenPhoenixWinner,
    advancePhase,
    setPresence,
    leaveRoom,
  };
}

export type MultiplayerRoomController = ReturnType<typeof useMultiplayerRoom>;
