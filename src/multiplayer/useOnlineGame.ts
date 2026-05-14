import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useSharedRollCounts } from '../hooks/useSharedRollCounts';
import { useModeBoardController } from '../hooks/useModeBoardController';
import { useRollFlow } from '../hooks/useRollFlow';
import { createSharedPlayerRacks } from '../lib/sharedRackLogic';
import { getWinner } from '../lib/winDetection';
import type { BattlePowerSlotId, BoardCell, Player, WinnerInfo } from '../types';
import { useAudioContext } from '../fresh/audio/AudioContext';
import { getWinSound } from '../lib/audio';
import type { TurnEndMeta } from '../hooks/useGameBoard';
import type { MultiplayerRoomController } from './useMultiplayerRoom';
import type { GuestMove } from './multiplayerTypes';
import {
  createMoveId,
  otherPlayer,
  type OnlineGameOptions,
  type PendingGuestMove,
  serializeOnlineHostState,
  useDisabledRollFlow,
  winnerTitleFor,
  winnerTypeFor,
} from './onlineGameHelpers';
import { useGuestMoveRelay } from './useGuestMoveRelay';
import { buildOnlineGameViewModel } from './onlineGameViewModel';

export function useOnlineGame(mpRoom: MultiplayerRoomController, options: OnlineGameOptions) {
  const { playSound } = useAudioContext();
  const role = mpRoom.role;
  const roomData = mpRoom.roomData;
  const {
    uid,
    writeGameState,
    writeGuestMove,
    clearGuestMove,
  } = mpRoom;
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [winner, setWinner] = useState<WinnerInfo>(null);
  const [guestSelectedEmojiIndex, setGuestSelectedEmojiIndex] = useState<number | null>(null);
  const [guestSelectedPowerSlotId, setGuestSelectedPowerSlotId] = useState<BattlePowerSlotId | null>(null);
  const [lastMoveType, setLastMoveType] = useState<TurnEndMeta['moveType'] | null>(null);
  const lastGuestAudioKeyRef = useRef<string | null>(null);
  const lastWinnerAudioKeyRef = useRef<string | null>(null);
  const guestRackScalesRef = useRef(Array.from({ length: 8 }, () => new Animated.Value(1)));

  const { rollCounts, consumeRoll, resetRolls } = useSharedRollCounts();
  const mirroredState = roomData?.gameState ?? null;
  const guestCanRoll = role === 'guest'
    && mirroredState?.currentPlayer === 'player2'
    && !mirroredState.winnerTitle
    && (mirroredState.rollsRemaining.player2 ?? 0) > 0;
  const guestRollFlow = useRollFlow({
    board: mirroredState?.board ?? [],
    disabled: !guestCanRoll,
    onEnterRollMode: () => setGuestSelectedEmojiIndex(null),
    onCommitRoll: (boardIndex, faceIndex) => {
      if (!uid || !guestCanRoll) return;
      writeGuestMove({
        kind: 'rollTile',
        boardIndex,
        faceIndex,
        id: createMoveId(uid),
        uid,
        createdAt: Date.now(),
      }).catch((error) => {
        console.warn('Failed to write guest roll', error);
      });
    },
  });
  const disabledRollFlow = useDisabledRollFlow();

  const powerLoadouts = useMemo(() => ({
    player1: roomData?.hostPowers ?? { slot1: null, slot2: null },
    player2: roomData?.guestPowers ?? { slot1: null, slot2: null },
  }), [roomData?.guestPowers, roomData?.hostPowers]);

  const handleHostTurnEnd = useCallback((nextBoard: BoardCell[], meta: TurnEndMeta) => {
    setLastMoveType(meta.moveType);
    const nextWinner = getWinner(nextBoard);
    if (nextWinner) {
      setWinner(nextWinner);
      return;
    }
    setCurrentPlayer((player) => otherPlayer(player));
  }, []);

  const {
    board,
    playerRacks,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    rollFlow,
    selectedPowerSlotId,
    ep1AnimationEvent,
    handleSquarePress,
    handleSelectRackIndex,
    placeFromRackIndex,
    handleResolveRoll,
    setSelectedPowerSlotId,
    resetBoardState,
    handlePowerSlotPress: handleHostPowerPress,
    buildPowerSlotsArrayForPlayer,
    resetPowers,
  } = useModeBoardController({
    currentPlayer,
    onTurnEnd: handleHostTurnEnd,
    powerLoadouts,
    rollsDisabled: Boolean(winner) || rollCounts[currentPlayer] <= 0,
    interactionDisabled: role !== 'host' || Boolean(winner),
    initialPlayerRacks: createSharedPlayerRacks(),
    onRollConsumed: () => consumeRoll(currentPlayer),
    playSound,
  });

  const serializeHostState = useCallback(() => serializeOnlineHostState({
    board,
    playerRacks,
    currentPlayer,
    rollCounts,
    hostPowers: roomData?.hostPowers,
    guestPowers: roomData?.guestPowers,
    selectedPowerSlotId,
    winner,
    hostName: options.hostName,
    guestName: options.guestName,
    lastMoveIndex,
    lastMoveType,
  }), [
    board,
    currentPlayer,
    lastMoveIndex,
    lastMoveType,
    options.guestName,
    options.hostName,
    playerRacks,
    rollCounts,
    roomData?.guestPowers,
    roomData?.hostPowers,
    selectedPowerSlotId,
    winner,
  ]);

  useEffect(() => {
    if (role !== 'host' || roomData?.phase !== 'playing') return;
    writeGameState(serializeHostState()).catch((error) => {
      console.warn('Failed to write online game state', error);
    });
  }, [role, roomData?.phase, serializeHostState, writeGameState]);

  useGuestMoveRelay({
    role,
    roomData,
    currentPlayer,
    winner,
    selectedPowerSlotId,
    onSelectRackIndex: handleSelectRackIndex,
    onPressPowerSlot: handleHostPowerPress,
    onPressSquare: handleSquarePress,
    onPlaceFromRackIndex: placeFromRackIndex,
    onResolveRoll: handleResolveRoll,
    clearGuestMove,
  });

  const viewModel = buildOnlineGameViewModel({
    role,
    mirroredState,
    hostBoard: board,
    hostPlayerRacks: playerRacks,
    hostCurrentPlayer: currentPlayer,
    hostWinner: winner,
    hostWinnerNames: {
      hostName: options.hostName,
      guestName: options.guestName,
    },
    hostWinningLineIndices: winner?.indices ?? [],
    hostLastMoveIndex: lastMoveIndex,
    hostRollCounts: rollCounts,
    hostSelectedEmojiIndex: selectedEmojiIndex,
    guestSelectedEmojiIndex,
    hostSelectedPowerSlotId: selectedPowerSlotId,
    guestSelectedPowerSlotId,
    buildPowerSlotsArrayForPlayer,
    hostRackScales: rackScales,
    guestRackScales: guestRackScalesRef.current,
    hostRollFlow: rollFlow,
    guestRollFlow: role === 'guest' ? guestRollFlow : disabledRollFlow,
  });

  useEffect(() => {
    const mirroredState = roomData?.gameState;
    if (role !== 'guest' || !mirroredState || mirroredState.lastMoveIndex === null || mirroredState.winnerTitle) return;
    const audioKey = `${mirroredState.updatedAt}:${mirroredState.lastMoveIndex}:${mirroredState.lastMoveType ?? 'move'}`;
    if (audioKey === lastGuestAudioKeyRef.current) return;
    lastGuestAudioKeyRef.current = audioKey;

    if (mirroredState.lastMoveType === 'power') return;
    playSound('place');
  }, [playSound, role, roomData?.gameState]);

  useEffect(() => {
    const mirroredWinnerTitle = role === 'guest' ? roomData?.gameState?.winnerTitle : null;
    const mirroredWinnerType = role === 'guest' ? roomData?.gameState?.winnerType : null;
    const mirroredWinnerPlayer = role === 'guest' ? roomData?.gameState?.winnerPlayer : null;
    const winnerTitle = role === 'host' ? winnerTitleFor(winner, options.hostName, options.guestName) : mirroredWinnerTitle;
    const winnerType = role === 'host' ? winnerTypeFor(winner) : mirroredWinnerType;
    const winnerPlayer = role === 'host' ? winner?.player ?? null : mirroredWinnerPlayer;
    if (!winnerTitle || !winnerType || !winnerPlayer) return;

    const audioKey = `${role}:${winnerTitle}:${winnerType}:${winnerPlayer}`;
    if (audioKey === lastWinnerAudioKeyRef.current) return;
    lastWinnerAudioKeyRef.current = audioKey;
    playSound(getWinSound(winnerType, winnerPlayer === viewModel.myPlayer));
  }, [
    options.guestName,
    options.hostName,
    playSound,
    role,
    roomData?.gameState?.winnerPlayer,
    roomData?.gameState?.winnerTitle,
    roomData?.gameState?.winnerType,
    viewModel.myPlayer,
    winner,
  ]);

  const sendGuestMove = useCallback((move: PendingGuestMove) => {
    if (role !== 'guest' || !uid || !viewModel.isMyTurn || viewModel.winnerTitle) return;
    writeGuestMove({
      ...move,
      id: createMoveId(uid),
      uid,
      createdAt: Date.now(),
    } as GuestMove).catch((error) => {
      console.warn('Failed to write guest move', error);
    });
  }, [role, uid, viewModel.isMyTurn, viewModel.winnerTitle, writeGuestMove]);

  const handleOnlineSelectRackIndex = useCallback((index: number) => {
    if (!viewModel.isMyTurn || viewModel.winnerTitle) return;
    if (role === 'host') {
      handleSelectRackIndex(index);
      return;
    }
    setGuestSelectedEmojiIndex(index);
    guestRackScalesRef.current[index]?.setValue(1.08);
    setTimeout(() => guestRackScalesRef.current[index]?.setValue(1), 120);
  }, [handleSelectRackIndex, role, viewModel.isMyTurn, viewModel.winnerTitle]);

  const handleOnlineSquarePress = useCallback((index: number) => {
    if (!viewModel.isMyTurn || viewModel.winnerTitle) return;
    if (role === 'host') {
      handleSquarePress(index);
      return;
    }
    sendGuestMove({ kind: 'pressSquare', boardIndex: index, selectedRackIndex: guestSelectedEmojiIndex });
    setGuestSelectedEmojiIndex(null);
  }, [guestSelectedEmojiIndex, handleSquarePress, role, sendGuestMove, viewModel.isMyTurn, viewModel.winnerTitle]);

  const handleOnlinePowerPress = useCallback((slotId: BattlePowerSlotId) => {
    if (!viewModel.isMyTurn || viewModel.winnerTitle) return;
    if (role === 'host') {
      handleHostPowerPress(slotId);
      return;
    }
    setGuestSelectedPowerSlotId((current) => (current === slotId ? null : slotId));
    sendGuestMove({ kind: 'pressPowerSlot', slotId });
  }, [handleHostPowerPress, role, sendGuestMove, viewModel.isMyTurn, viewModel.winnerTitle]);

  const handleRematch = useCallback(() => {
    if (role !== 'host') return;
    setCurrentPlayer('player1');
    setWinner(null);
    setLastMoveType(null);
    lastGuestAudioKeyRef.current = null;
    lastWinnerAudioKeyRef.current = null;
    resetRolls();
    resetPowers();
    resetBoardState(undefined, createSharedPlayerRacks());
  }, [resetBoardState, resetPowers, resetRolls, role]);

  return {
    board: viewModel.board,
    currentPlayer: viewModel.currentPlayer,
    currentRack: viewModel.currentRack,
    selectedEmojiIndex: viewModel.selectedEmojiIndex,
    rackScales: viewModel.rackScales,
    lastMoveIndex: viewModel.lastMoveIndex,
    winningLineIndices: viewModel.winningLineIndices,
    winnerTitle: viewModel.winnerTitle,
    rollCounts: viewModel.rollCounts,
    rollFlow: viewModel.rollFlow,
    rollDisabled: !viewModel.isMyTurn || Boolean(viewModel.winnerTitle) || (viewModel.rollCounts[viewModel.myPlayer] ?? 0) <= 0,
    ep1AnimationEvent: role === 'host' ? ep1AnimationEvent : null,
    powerSlotsArray: viewModel.powerSlotsArray,
    myPlayer: viewModel.myPlayer,
    isMyTurn: viewModel.isMyTurn,
    isHost: role === 'host',
    isGuest: role === 'guest',
    canRematch: role === 'host',
    opponentDisconnected: false,
    handleSquarePress: handleOnlineSquarePress,
    handleSelectRackIndex: handleOnlineSelectRackIndex,
    handlePowerSlotPress: handleOnlinePowerPress,
    handleRematch,
  };
}
