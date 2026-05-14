import {
  DataSnapshot,
  get,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import { db } from '../firebase/firebaseConfig';
import type {
  GuestMove,
  JoinRoomResult,
  MultiplayerPhase,
  MultiplayerRole,
  MultiplayerWagerMode,
  RoomData,
  SerializedGameState,
  SerializedPowerSlots,
} from './multiplayerTypes';

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const DISCONNECTED_ROOM_TTL_MS = 30 * 60 * 1000;

const roomRef = (code: string) => ref(db, `rooms/${normalizeRoomCode(code)}`);

export function normalizeRoomCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z2-9]/g, '');
}

export function generateRoomCode(): string {
  return Array.from({ length: 6 }, () => ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]).join('');
}

export async function createRoom(
  code: string,
  hostName: string,
  hostUid: string,
  wagerMode: MultiplayerWagerMode,
  isGoldenPhoenixEntry: boolean,
): Promise<void> {
  cleanupExpiredRooms().catch(() => {});

  const existingRoom = await get(roomRef(code));
  if (existingRoom.exists()) {
    throw new Error(`Room ${normalizeRoomCode(code)} already exists`);
  }

  const now = Date.now();
  const room: RoomData = {
    phase: 'lobby',
    hostUid,
    guestUid: null,
    hostName,
    guestName: null,
    hostPowers: null,
    guestPowers: null,
    wagerMode,
    isGoldenPhoenixEntry,
    gameState: null,
    guestMove: null,
    processedGuestMoveId: null,
    goldenPhoenixWinner: null,
    presence: {
      host: { connected: true, lastSeen: now },
    },
    createdAt: now,
  };

  await set(roomRef(code), room);
}

export async function joinRoom(code: string, guestName: string, guestUid: string): Promise<JoinRoomResult> {
  const normalizedCode = normalizeRoomCode(code);
  const snapshot = await get(roomRef(normalizedCode));
  if (!snapshot.exists()) return 'not-found';

  const room = snapshot.val() as RoomData;
  if (room.guestUid && room.guestUid !== guestUid) return 'full';

  await update(roomRef(normalizedCode), {
    guestUid,
    guestName,
    guestPowers: null,
    'presence/guest': { connected: true, lastSeen: Date.now() },
  });

  cleanupExpiredRooms().catch(() => {});
  return 'ok';
}

export function setHostPowers(code: string, slots: SerializedPowerSlots): Promise<void> {
  return update(roomRef(code), { hostPowers: slots });
}

export function setGuestPowers(code: string, slots: SerializedPowerSlots): Promise<void> {
  return update(roomRef(code), { guestPowers: slots });
}

export function setPhase(code: string, phase: MultiplayerPhase): Promise<void> {
  return update(roomRef(code), { phase });
}

export function writeGameState(code: string, state: SerializedGameState): Promise<void> {
  return update(roomRef(code), { gameState: state });
}

export function writeGuestMove(code: string, move: GuestMove): Promise<void> {
  return update(roomRef(code), { guestMove: move });
}

export function writeProcessedGuestMoveId(code: string, moveId: string | null): Promise<void> {
  return update(roomRef(code), { processedGuestMoveId: moveId });
}

export function clearGuestMove(code: string): Promise<void> {
  return update(roomRef(code), { guestMove: null });
}

export function writeGoldenPhoenixWinner(code: string, name: string): Promise<void> {
  return update(roomRef(code), { goldenPhoenixWinner: name });
}

export function writePresence(code: string, role: MultiplayerRole, connected: boolean): Promise<void> {
  return update(roomRef(code), {
    [`presence/${role}`]: {
      connected,
      lastSeen: Date.now(),
    },
  });
}

export async function attachPresenceDisconnect(code: string, role: MultiplayerRole): Promise<() => void> {
  const presenceRef = ref(db, `rooms/${normalizeRoomCode(code)}/presence/${role}`);
  const disconnect = onDisconnect(presenceRef);
  await disconnect.set({ connected: false, lastSeen: Date.now() });
  if (role === 'host') {
    await onDisconnect(roomRef(code)).remove();
  }
  return () => {
    disconnect.cancel();
    if (role === 'host') {
      onDisconnect(roomRef(code)).cancel();
    }
  };
}

export async function leaveRoom(code: string, role: MultiplayerRole): Promise<void> {
  if (role === 'host') {
    await remove(roomRef(code));
    return;
  }

  await update(roomRef(code), {
    guestUid: null,
    guestName: null,
    guestPowers: null,
    guestMove: null,
    'presence/guest': { connected: false, lastSeen: Date.now() },
  });
}

export function deleteRoom(code: string): Promise<void> {
  return remove(roomRef(code));
}

export function subscribeToRoom(code: string, cb: (room: RoomData | null) => void): () => void {
  return onValue(roomRef(code), (snapshot: DataSnapshot) => {
    cb(snapshot.exists() ? (snapshot.val() as RoomData) : null);
  });
}

async function cleanupExpiredRooms() {
  const cutoff = Date.now() - ROOM_TTL_MS;
  const disconnectedCutoff = Date.now() - DISCONNECTED_ROOM_TTL_MS;
  const snapshot = await get(ref(db, 'rooms'));
  if (!snapshot.exists()) return;

  const updates: Record<string, null> = {};
  snapshot.forEach((child) => {
    const room = child.val() as RoomData;
    const hostPresence = room.presence?.host;
    const hostIsStale = hostPresence?.connected === false && hostPresence.lastSeen < disconnectedCutoff;
    const isExpired = room.createdAt < cutoff;
    const isExpiredOpenRoom = isExpired && (room.phase === 'done' || room.phase === 'lobby');
    if (hostIsStale || isExpiredOpenRoom) {
      updates[`rooms/${child.key}`] = null;
    }
  });

  if (Object.keys(updates).length > 0) {
    await update(ref(db), updates);
  }
}
