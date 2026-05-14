import type { BattlePowerSlotId, BattlePowerSlotLoadout, BoardCell, Player, StickerId } from '../types';

export type MultiplayerRole = 'host' | 'guest';
export type MultiplayerPhase = 'lobby' | 'playing' | 'done';
export type MultiplayerWagerMode = 'none' | 'legendary';

export type SerializedPowerSlots = BattlePowerSlotLoadout;

export type SerializedRollsRemaining = {
  player1: number;
  player2: number;
};

export type SerializedGameState = {
  board: BoardCell[];
  playerRacks: Record<Player, StickerId[]>;
  currentPlayer: Player;
  rollsRemaining: SerializedRollsRemaining;
  powerSlots: {
    host: SerializedPowerSlots;
    guest: SerializedPowerSlots;
  };
  selectedPowerSlotId: BattlePowerSlotId | null;
  lastMoveType: 'place' | 'roll' | 'power' | null;
  winnerPlayer: Player | null;
  winnerTitle: string | null;
  winnerType: 'common' | 'epic' | 'legendary' | null;
  winningLineIndices: number[];
  lastMoveIndex: number | null;
  roundNumber: number;
  updatedAt: number;
};

export type GuestMove =
  | {
      id: string;
      uid: string;
      kind: 'selectRackIndex';
      rackIndex: number;
      createdAt: number;
    }
  | {
      id: string;
      uid: string;
      kind: 'pressSquare';
      boardIndex: number;
      selectedRackIndex: number | null;
      createdAt: number;
    }
  | {
      id: string;
      uid: string;
      kind: 'pressPowerSlot';
      slotId: BattlePowerSlotId;
      createdAt: number;
    }
  | {
      id: string;
      uid: string;
      kind: 'rollTile';
      boardIndex: number;
      faceIndex: number;
      createdAt: number;
    };

export type MultiplayerPresenceState = {
  connected: boolean;
  lastSeen: number;
};

export type MultiplayerPresence = {
  host?: MultiplayerPresenceState;
  guest?: MultiplayerPresenceState;
};

export type RoomData = {
  phase: MultiplayerPhase;
  hostUid: string;
  guestUid: string | null;
  hostName: string;
  guestName: string | null;
  hostPowers: SerializedPowerSlots | null;
  guestPowers: SerializedPowerSlots | null;
  wagerMode: MultiplayerWagerMode;
  isGoldenPhoenixEntry: boolean;
  gameState: SerializedGameState | null;
  guestMove: GuestMove | null;
  processedGuestMoveId: string | null;
  goldenPhoenixWinner: string | null;
  presence?: MultiplayerPresence;
  createdAt: number;
};

export type JoinRoomResult = 'ok' | 'not-found' | 'full' | 'expired';
