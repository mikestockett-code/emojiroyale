import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { BOARD_SIZE } from '../constants/gameConstants';
import { BATTLE_TEST_POWERS } from '../data/battlePowers';
import { useRollFlow } from '../hooks/useRollFlow';
import { getWinSound, type AudioSourceKey } from '../lib/audio';
import { resolveBoardRoll, resolveTargetedBoardPower } from '../lib/boardResolution';
import { resolveRackPlacement } from '../lib/boardRackResolution';
import { applyFourSquarePower, applyTornadoPower } from '../lib/battlePowerEffects';
import { createGameBoardEffectEvent, type GameBoardEffectEvent, type GameBoardEffectId } from '../lib/gameBoardEffects';
import { getWinner } from '../lib/winDetection';
import { useAudioContext } from '../fresh/audio/AudioContext';
import type { BattlePowerId, BattlePowerSlotId, BoardCell, Player, StickerId } from '../types';
import type { GuestMove, SerializedGameState, SerializedPowerUses } from './multiplayerTypes';
import type { MultiplayerRoomController } from './useMultiplayerRoom';
import {
  createInitialOnlineGameState,
  createMoveId,
  normalizeOnlineGameState,
  otherPlayer,
  type OnlineGameOptions,
  type PendingGuestMove,
  serializeOnlineHostState,
  useDisabledRollFlow,
  winnerTypeFor,
} from './onlineGameHelpers';

const EMPTY_BOARD = Array.from({ length: BOARD_SIZE }, () => null) as BoardCell[];
const SLOT_IDS: BattlePowerSlotId[] = ['slot1', 'slot2'];

function playerForRole(role: MultiplayerRoomController['role']): Player {
  return role === 'guest' ? 'player2' : 'player1';
}

function ownerForPlayer(player: Player): keyof SerializedPowerUses {
  return player === 'player1' ? 'host' : 'guest';
}

function soundForEffect(effectId: GameBoardEffectId | undefined): AudioSourceKey {
  if (effectId === 'tornado') return 'tornado';
  if (effectId === 'clearRow' || effectId === 'clearColumn') return 'clearRow';
  if (effectId === 'fourSquare') return 'fourSquare';
  if (effectId === 'removeTile') return 'eraser';
  return 'place';
}

function buildOnlinePowerSlots(
  state: SerializedGameState,
  player: Player,
  selectedPowerSlotId: BattlePowerSlotId | null,
) {
  const owner = ownerForPlayer(player);
  const loadout = owner === 'host' ? state.powerSlots.host : state.powerSlots.guest;
  const uses = state.powerUses[owner];

  return SLOT_IDS
    .map((slotId) => {
      const powerId = loadout[slotId];
      if (!powerId) return null;
      const power = BATTLE_TEST_POWERS.find((entry) => entry.id === powerId);
      if (!power) return null;
      const usesLeft = uses[slotId] ?? 0;
      return {
        slotId,
        icon: power.icon,
        powerId,
        isSelected: selectedPowerSlotId === slotId,
        usesLeft,
        bonusCount: 0,
        isDisabled: usesLeft <= 0,
      };
    })
    .filter(Boolean) as {
      slotId: string;
      icon: string;
      powerId: BattlePowerId;
      isSelected: boolean;
      usesLeft: number;
      bonusCount: number;
      isDisabled: boolean;
    }[];
}

function consumeSerializedPowerUse(
  state: SerializedGameState,
  player: Player,
  slotId: BattlePowerSlotId,
): SerializedPowerUses {
  const owner = ownerForPlayer(player);
  return {
    ...state.powerUses,
    [owner]: {
      ...state.powerUses[owner],
      [slotId]: Math.max(0, (state.powerUses[owner][slotId] ?? 0) - 1),
    },
  };
}

function getOnlinePowerId(state: SerializedGameState, player: Player, slotId: BattlePowerSlotId | null) {
  if (!slotId) return null;
  const owner = ownerForPlayer(player);
  return (owner === 'host' ? state.powerSlots.host : state.powerSlots.guest)[slotId];
}

function isInstantBoardPower(powerId: BattlePowerId | null) {
  return powerId === 'power-four-square' || powerId === 'power-tornado';
}

function nextStateAfterMove({
  state,
  nextBoard,
  nextRacks,
  actingPlayer,
  moveType,
  lastMoveIndex,
  hostName,
  guestName,
  decrementRoll = false,
  powerUses,
  lastSoundKey = 'place',
  lastEffectEvent = null,
}: {
  state: SerializedGameState;
  nextBoard: BoardCell[];
  nextRacks?: Record<Player, StickerId[]>;
  actingPlayer: Player;
  moveType: SerializedGameState['lastMoveType'];
  lastMoveIndex: number | null;
  hostName: string;
  guestName: string;
  decrementRoll?: boolean;
  powerUses?: SerializedPowerUses;
  lastSoundKey?: AudioSourceKey | null;
  lastEffectEvent?: GameBoardEffectEvent | null;
}) {
  const winner = getWinner(nextBoard);
  const rollsRemaining = {
    ...state.rollsRemaining,
    [actingPlayer]: decrementRoll
      ? Math.max(0, (state.rollsRemaining[actingPlayer] ?? 0) - 1)
      : state.rollsRemaining[actingPlayer] ?? 0,
  };

  return serializeOnlineHostState({
    board: nextBoard,
    playerRacks: nextRacks ?? state.playerRacks,
    currentPlayer: winner ? actingPlayer : otherPlayer(actingPlayer),
    rollCounts: rollsRemaining,
    hostPowers: state.powerSlots.host,
    guestPowers: state.powerSlots.guest,
    powerUses: powerUses ?? state.powerUses,
    selectedPowerSlotId: null,
    winner,
    hostName,
    guestName,
    lastMoveIndex,
    lastMoveType: moveType,
    lastSoundKey,
    lastEffectEvent,
  });
}

export function useOnlineGame(mpRoom: MultiplayerRoomController, options: OnlineGameOptions) {
  const { playSound } = useAudioContext();
  const role = mpRoom.role;
  const roomData = mpRoom.roomData;
  const { uid, writeGameState, writeGuestMove, clearGuestMove } = mpRoom;
  const lastGuestAudioKeyRef = useRef<string | null>(null);
  const lastWinnerAudioKeyRef = useRef<string | null>(null);
  const lastEp1EffectIdRef = useRef<string | null>(null);
  const processedGuestMoveRef = useRef<string | null>(null);
  const hostRackScalesRef = useRef(Array.from({ length: 8 }, () => new Animated.Value(1)));
  const guestRackScalesRef = useRef(Array.from({ length: 8 }, () => new Animated.Value(1)));
  const [hostSelectedEmojiIndex, setHostSelectedEmojiIndex] = useState<number | null>(null);
  const [guestSelectedEmojiIndex, setGuestSelectedEmojiIndex] = useState<number | null>(null);
  const [hostSelectedPowerSlotId, setHostSelectedPowerSlotId] = useState<BattlePowerSlotId | null>(null);
  const [guestSelectedPowerSlotId, setGuestSelectedPowerSlotId] = useState<BattlePowerSlotId | null>(null);
  const [visibleEffectEvent, setVisibleEffectEvent] = useState<GameBoardEffectEvent | null>(null);
  const [optimisticHostState, setOptimisticHostState] = useState<SerializedGameState | null>(null);
  const visibleEffectNonceRef = useRef<number | null>(null);

  const mirroredState = useMemo(() => normalizeOnlineGameState(roomData?.gameState), [roomData?.gameState]);
  const fallbackState = useMemo(() => createInitialOnlineGameState({
    hostPowers: roomData?.hostPowers,
    guestPowers: roomData?.guestPowers,
    hostName: options.hostName,
    guestName: options.guestName,
  }), [options.guestName, options.hostName, roomData?.guestPowers, roomData?.hostPowers]);
  const state = useMemo(() => {
    if (role !== 'host') return mirroredState ?? fallbackState;
    if (!optimisticHostState) return mirroredState ?? fallbackState;
    if (!mirroredState) return optimisticHostState;
    return optimisticHostState.updatedAt > mirroredState.updatedAt ? optimisticHostState : mirroredState;
  }, [fallbackState, mirroredState, optimisticHostState, role]);

  const myPlayer = playerForRole(role);
  const isMyTurn = state.currentPlayer === myPlayer && !state.winnerTitle;
  const selectedPowerSlotId = role === 'guest' ? guestSelectedPowerSlotId : hostSelectedPowerSlotId;
  const currentPowerSlots = null;

  const commitHostState = useCallback((nextState: SerializedGameState) => {
    if (role !== 'host') return;
    setOptimisticHostState(nextState);
    writeGameState(nextState).catch((error) => {
      console.warn('Failed to write online game state', error);
    });
  }, [role, writeGameState]);

  const applyPlace = useCallback((
    baseState: SerializedGameState,
    actingPlayer: Player,
    boardIndex: number,
    rackIndex: number | null,
  ) => {
    if (rackIndex === null) return null;
    const placement = resolveRackPlacement({
      board: baseState.board,
      currentPlayer: actingPlayer,
      currentRack: baseState.playerRacks[actingPlayer] ?? [],
      boardIndex,
      rackIndex,
      lockedRackSlot: null,
      soloMode: 'battle',
      roundNumber: baseState.roundNumber,
    });
    if (!placement) return null;
    return nextStateAfterMove({
      state: baseState,
      nextBoard: placement.nextBoard,
      nextRacks: { ...baseState.playerRacks, [actingPlayer]: placement.nextRack },
      actingPlayer,
      moveType: 'place',
      lastMoveIndex: boardIndex,
      hostName: options.hostName,
      guestName: options.guestName,
      lastSoundKey: 'place',
    });
  }, [options.guestName, options.hostName]);

  const applyRoll = useCallback((baseState: SerializedGameState, actingPlayer: Player, boardIndex: number, faceIndex: number) => {
    const resolution = resolveBoardRoll({
      board: baseState.board,
      index: boardIndex,
      faceIndex,
      previousEffectId: lastEp1EffectIdRef.current as never,
      currentPlayer: actingPlayer,
    });
    if (!resolution) return null;
    lastEp1EffectIdRef.current = resolution.kind === 'effect' ? resolution.effectId : null;
    const lastEffectEvent = resolution.kind === 'effect' ? resolution.effectEvent : null;
    return nextStateAfterMove({
      state: baseState,
      nextBoard: resolution.nextBoard,
      actingPlayer,
      moveType: 'roll',
      lastMoveIndex: resolution.lastMoveIndex,
      hostName: options.hostName,
      guestName: options.guestName,
      decrementRoll: true,
      lastSoundKey: resolution.kind === 'effect' ? soundForEffect(resolution.effectId) : 'place',
      lastEffectEvent,
    });
  }, [options.guestName, options.hostName]);

  const applyPower = useCallback((baseState: SerializedGameState, actingPlayer: Player, boardIndex: number, slotId: BattlePowerSlotId | null) => {
    if (!slotId) return null;
    const owner = ownerForPlayer(actingPlayer);
    const powerId = (owner === 'host' ? baseState.powerSlots.host : baseState.powerSlots.guest)[slotId];
    const power = BATTLE_TEST_POWERS.find((entry) => entry.id === powerId);
    const usesLeft = baseState.powerUses[owner][slotId] ?? 0;
    if (!powerId || !power || power.type !== 'EP1' || usesLeft <= 0 || powerId === 'power-torture-rack') return null;
    const result = resolveTargetedBoardPower(baseState.board, boardIndex, powerId);
    if (!result) return null;
    return nextStateAfterMove({
      state: baseState,
      nextBoard: result.nextBoard,
      powerUses: consumeSerializedPowerUse(baseState, actingPlayer, slotId),
      actingPlayer,
      moveType: 'power',
      lastMoveIndex: result.lastMoveIndex,
      hostName: options.hostName,
      guestName: options.guestName,
      lastSoundKey: soundForEffect(result.effectId),
      lastEffectEvent: result.effectEvent,
    });
  }, [options.guestName, options.hostName]);

  const applyInstantPower = useCallback((baseState: SerializedGameState, actingPlayer: Player, slotId: BattlePowerSlotId | null) => {
    if (!slotId) return null;
    const owner = ownerForPlayer(actingPlayer);
    const powerId = getOnlinePowerId(baseState, actingPlayer, slotId);
    const usesLeft = baseState.powerUses[owner][slotId] ?? 0;
    if (!isInstantBoardPower(powerId) || usesLeft <= 0) return null;

    const result = powerId === 'power-four-square'
      ? { ...applyFourSquarePower(baseState.board), effectId: 'fourSquare' as const, effectLabel: 'Four Square' }
      : { ...applyTornadoPower(baseState.board), effectId: 'tornado' as const, effectLabel: 'Tornado' };
    if (result.affectedIndices.length === 0) return null;

    return nextStateAfterMove({
      state: baseState,
      nextBoard: result.nextBoard,
      powerUses: consumeSerializedPowerUse(baseState, actingPlayer, slotId),
      actingPlayer,
      moveType: 'power',
      lastMoveIndex: result.lastMoveIndex,
      hostName: options.hostName,
      guestName: options.guestName,
      lastSoundKey: soundForEffect(result.effectId),
      lastEffectEvent: createGameBoardEffectEvent(
        result.effectId,
        result.effectLabel,
        result.affectedIndices,
        baseState.board,
      ),
    });
  }, [options.guestName, options.hostName]);

  const writePendingGuestMove = useCallback((move: PendingGuestMove) => {
    if (role !== 'guest' || !uid || !isMyTurn) return;
    writeGuestMove({
      ...move,
      id: createMoveId(uid),
      uid,
      createdAt: Date.now(),
    } as GuestMove).catch((error) => {
      console.warn('Failed to write guest move', error);
    });
  }, [isMyTurn, role, uid, writeGuestMove]);

  const hostCanRoll = role === 'host'
    && state.currentPlayer === 'player1'
    && !state.winnerTitle
    && (state.rollsRemaining.player1 ?? 0) > 0;
  const guestCanRoll = role === 'guest'
    && state.currentPlayer === 'player2'
    && !state.winnerTitle
    && (state.rollsRemaining.player2 ?? 0) > 0;

  const hostRollFlow = useRollFlow({
    board: state.board,
    disabled: !hostCanRoll,
    onEnterRollMode: () => {
      setHostSelectedEmojiIndex(null);
      setHostSelectedPowerSlotId(null);
    },
    onCommitRoll: (boardIndex, faceIndex) => {
      const nextState = applyRoll(state, 'player1', boardIndex, faceIndex);
      if (nextState) {
        if (nextState.lastSoundKey) playSound(nextState.lastSoundKey);
        commitHostState(nextState);
      }
    },
  });

  const guestRollFlow = useRollFlow({
    board: state.board,
    disabled: !guestCanRoll,
    onEnterRollMode: () => {
      setGuestSelectedEmojiIndex(null);
      setGuestSelectedPowerSlotId(null);
    },
    onCommitRoll: (boardIndex, faceIndex) => {
      writePendingGuestMove({ kind: 'rollTile', boardIndex, faceIndex });
    },
  });
  const disabledRollFlow = useDisabledRollFlow();

  useEffect(() => {
    if (role !== 'host' || roomData?.phase !== 'playing' || mirroredState) return;
    commitHostState(fallbackState);
  }, [commitHostState, fallbackState, mirroredState, role, roomData?.phase]);

  useEffect(() => {
    if (role !== 'host') return;
    const move = roomData?.guestMove;
    if (!move || move.id === processedGuestMoveRef.current || move.id === roomData?.processedGuestMoveId) return;
    if (state.currentPlayer !== 'player2' || state.winnerTitle) return;

    let nextState: SerializedGameState | null = null;
    if (move.kind === 'pressSquare') {
      const guestPowerSlotForMove = move.selectedPowerSlotId ?? guestSelectedPowerSlotId;
      nextState = guestPowerSlotForMove
        ? applyPower(state, 'player2', move.boardIndex, guestPowerSlotForMove)
        : applyPlace(state, 'player2', move.boardIndex, move.selectedRackIndex);
      setGuestSelectedPowerSlotId(null);
    } else if (move.kind === 'rollTile') {
      nextState = applyRoll(state, 'player2', move.boardIndex, move.faceIndex);
    } else if (move.kind === 'pressPowerSlot') {
      nextState = applyInstantPower(state, 'player2', move.slotId);
      if (nextState) {
        setGuestSelectedPowerSlotId(null);
      } else {
        setGuestSelectedPowerSlotId((current) => (current === move.slotId ? null : move.slotId));
      }
      processedGuestMoveRef.current = move.id;
      if (!nextState) {
        clearGuestMove(move.id).catch((error) => console.warn('Failed to clear guest move', error));
        return;
      }
    }

    if (!nextState) return;
    processedGuestMoveRef.current = move.id;
    if (nextState.lastSoundKey) playSound(nextState.lastSoundKey);
    commitHostState(nextState);
    clearGuestMove(move.id).catch((error) => console.warn('Failed to clear guest move', error));
  }, [
    applyPlace,
    applyInstantPower,
    applyPower,
    applyRoll,
    clearGuestMove,
    commitHostState,
    guestSelectedPowerSlotId,
    playSound,
    role,
    roomData?.guestMove,
    roomData?.processedGuestMoveId,
    state,
  ]);

  useEffect(() => {
    if (role !== 'guest' || !mirroredState || mirroredState.lastMoveIndex === null || mirroredState.winnerTitle) return;
    const audioKey = `${mirroredState.updatedAt}:${mirroredState.lastMoveIndex}:${mirroredState.lastMoveType ?? 'move'}`;
    if (audioKey === lastGuestAudioKeyRef.current) return;
    lastGuestAudioKeyRef.current = audioKey;
    if (mirroredState.lastSoundKey) playSound(mirroredState.lastSoundKey);
  }, [mirroredState, playSound, role]);

  useEffect(() => {
    if (!state.winnerTitle || !state.winnerType || !state.winnerPlayer) return;
    const audioKey = `${role}:${state.winnerTitle}:${state.winnerType}:${state.winnerPlayer}`;
    if (audioKey === lastWinnerAudioKeyRef.current) return;
    lastWinnerAudioKeyRef.current = audioKey;
    playSound(getWinSound(state.winnerType, state.winnerPlayer === myPlayer));
  }, [myPlayer, playSound, role, state.winnerPlayer, state.winnerTitle, state.winnerType]);

  useEffect(() => {
    const event = state.lastEffectEvent;
    if (!event || event.nonce === visibleEffectNonceRef.current) return;
    visibleEffectNonceRef.current = event.nonce;
    setVisibleEffectEvent(event);
    const timeout = setTimeout(() => {
      setVisibleEffectEvent((current) => (current?.nonce === event.nonce ? null : current));
    }, event.id === 'tornado' ? 1200 : 900);
    return () => clearTimeout(timeout);
  }, [state.lastEffectEvent]);

  const animateRackSelection = useCallback((player: Player, index: number) => {
    const scales = player === 'player1' ? hostRackScalesRef.current : guestRackScalesRef.current;
    scales[index]?.setValue(1.08);
    setTimeout(() => scales[index]?.setValue(1), 120);
  }, []);

  const handleOnlineSelectRackIndex = useCallback((index: number) => {
    if (!isMyTurn) return;
    if (role === 'host') {
      setHostSelectedEmojiIndex(index);
      animateRackSelection('player1', index);
      return;
    }
    setGuestSelectedEmojiIndex(index);
    animateRackSelection('player2', index);
  }, [animateRackSelection, isMyTurn, role]);

  const handleOnlineSquarePress = useCallback((index: number) => {
    if (!isMyTurn) return;
    if (role === 'host') {
      const nextState = hostSelectedPowerSlotId
        ? applyPower(state, 'player1', index, hostSelectedPowerSlotId)
        : applyPlace(state, 'player1', index, hostSelectedEmojiIndex);
      setHostSelectedEmojiIndex(null);
      setHostSelectedPowerSlotId(null);
      if (nextState) {
        if (nextState.lastSoundKey) playSound(nextState.lastSoundKey);
        commitHostState(nextState);
      }
      return;
    }
    writePendingGuestMove({
      kind: 'pressSquare',
      boardIndex: index,
      selectedRackIndex: guestSelectedEmojiIndex,
      selectedPowerSlotId: guestSelectedPowerSlotId,
    });
    setGuestSelectedEmojiIndex(null);
  }, [
    applyPlace,
    applyPower,
    commitHostState,
    guestSelectedEmojiIndex,
    guestSelectedPowerSlotId,
    hostSelectedEmojiIndex,
    hostSelectedPowerSlotId,
    isMyTurn,
    playSound,
    role,
    state,
    writePendingGuestMove,
  ]);

  const handleOnlinePowerPress = useCallback((slotId: BattlePowerSlotId) => {
    if (!isMyTurn) return;
    hostRollFlow.resetRollState();
    guestRollFlow.resetRollState();
    if (role === 'host') {
      const instantState = applyInstantPower(state, 'player1', slotId);
      if (instantState) {
        setHostSelectedPowerSlotId(null);
        if (instantState.lastSoundKey) playSound(instantState.lastSoundKey);
        commitHostState(instantState);
        return;
      }
      setHostSelectedPowerSlotId((current) => (current === slotId ? null : slotId));
      return;
    }
    const guestPowerId = getOnlinePowerId(state, 'player2', slotId);
    if (!isInstantBoardPower(guestPowerId)) {
      setGuestSelectedPowerSlotId((current) => (current === slotId ? null : slotId));
    } else {
      setGuestSelectedPowerSlotId(null);
    }
    writePendingGuestMove({ kind: 'pressPowerSlot', slotId });
  }, [applyInstantPower, commitHostState, guestRollFlow, hostRollFlow, isMyTurn, playSound, role, state, writePendingGuestMove]);

  const handleRematch = useCallback(() => {
    if (role !== 'host') return;
    setHostSelectedEmojiIndex(null);
    setGuestSelectedEmojiIndex(null);
    setHostSelectedPowerSlotId(null);
    setGuestSelectedPowerSlotId(null);
    lastGuestAudioKeyRef.current = null;
    lastWinnerAudioKeyRef.current = null;
    commitHostState(createInitialOnlineGameState({
      hostPowers: roomData?.hostPowers,
      guestPowers: roomData?.guestPowers,
      hostName: options.hostName,
      guestName: options.guestName,
    }));
  }, [commitHostState, options.guestName, options.hostName, role, roomData?.guestPowers, roomData?.hostPowers]);

  const visibleRack = state.playerRacks[myPlayer] ?? [];
  const visibleRollFlow = role === 'host'
    ? hostRollFlow
    : role === 'guest'
      ? guestRollFlow
      : disabledRollFlow;
  const visibleSelectedEmojiIndex = role === 'guest' ? guestSelectedEmojiIndex : hostSelectedEmojiIndex;
  const powerSlotsArray = buildOnlinePowerSlots(state, myPlayer, selectedPowerSlotId);
  const rollDisabled = !visibleRollFlow.isActive
    && (!isMyTurn || Boolean(state.winnerTitle) || (state.rollsRemaining[myPlayer] ?? 0) <= 0);
  const winnerType = winnerTypeFor(getWinner(state.board));

  return {
    board: state.board ?? EMPTY_BOARD,
    currentPlayer: state.currentPlayer,
    currentRack: visibleRack,
    selectedEmojiIndex: visibleSelectedEmojiIndex,
    rackScales: myPlayer === 'player1' ? hostRackScalesRef.current : guestRackScalesRef.current,
    lastMoveIndex: state.lastMoveIndex,
    winningLineIndices: state.winningLineIndices,
    winnerTitle: state.winnerTitle,
    rollCounts: state.rollsRemaining,
    rollFlow: visibleRollFlow,
    rollDisabled,
    ep1AnimationEvent: visibleEffectEvent,
    powerSlotsArray,
    myPlayer,
    isMyTurn,
    isHost: role === 'host',
    isGuest: role === 'guest',
    canRematch: role === 'host',
    opponentDisconnected: false,
    winnerType,
    currentPowerSlots,
    handleSquarePress: handleOnlineSquarePress,
    handleSelectRackIndex: handleOnlineSelectRackIndex,
    handlePowerSlotPress: handleOnlinePowerPress,
    handleRematch,
  };
}
