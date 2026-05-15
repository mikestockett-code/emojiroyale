import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import type {
  BattlePowerId,
  BattlePowerSlotId,
  BattlePowerType,
  BoardCell,
  Player,
  SoloModeId,
  StickerId,
} from '../types';
import type { AudioSourceKey } from '../lib/audio';
import { BOARD_SIZE } from '../constants/gameConstants';
import type { GameBoardEffectEvent, GameBoardEffectId } from '../lib/gameBoardEffects';
import { createSharedPlayerRacks } from '../lib/sharedRackLogic';
import { resolveBoardRoll, resolveTargetedBoardPower } from '../lib/boardResolution';
import { createRerolledRack, resolveRackPlacement } from '../lib/boardRackResolution';
import { useRollFlow } from './useRollFlow';

type LockedRackSlot = { index: number; stickerId: StickerId } | null;

type BoardPowerSlotState = {
  powerId: BattlePowerId;
  type: BattlePowerType;
  usesLeft: number;
};

type PowerSlotsById = Partial<Record<BattlePowerSlotId, BoardPowerSlotState | null>>;

export type TurnEndMeta = {
  moveType: 'place' | 'roll' | 'power';
  effectId?: GameBoardEffectId;
};

type UseBoardStateControllerParams = {
  currentPlayer: Player;
  onTurnEnd: (nextBoard: BoardCell[], meta: TurnEndMeta) => void;
  rollsDisabled: boolean;
  interactionDisabled?: boolean;
  soloMode?: SoloModeId;
  roundNumber?: number;
  initialBoard?: BoardCell[];
  initialPlayerRacks?: Record<Player, StickerId[]>;
  powerSlots?: PowerSlotsById;
  onConsumePower?: (slotId: BattlePowerSlotId) => void;
  onPowerRefill?: () => { label: string; bonusCount: number; banked: boolean } | null;
  onRollConsumed?: () => void;
  onRackLocked?: () => void;
  playSound?: (key: AudioSourceKey) => void;
};

function playEp1Sound(
  effectId: GameBoardEffectId | string | undefined,
  playSound: ((key: AudioSourceKey) => void) | undefined,
  fallback?: AudioSourceKey,
) {
  if (effectId === 'tornado') { playSound?.('tornado'); return; }
  if (effectId === 'clearRow' || effectId === 'clearColumn') { playSound?.('clearRow'); return; }
  if (effectId === 'fourSquare') { playSound?.('fourSquare'); return; }
  if (effectId === 'removeTile') { playSound?.('eraser'); return; }
  if (fallback) playSound?.(fallback);
}

export function useBoardStateController({
  currentPlayer,
  onTurnEnd,
  rollsDisabled,
  interactionDisabled = false,
  soloMode = 'battle',
  roundNumber = 1,
  initialBoard,
  initialPlayerRacks,
  powerSlots,
  onConsumePower,
  onPowerRefill,
  onRollConsumed,
  onRackLocked,
  playSound,
}: UseBoardStateControllerParams) {
  const rackScalesRef = useRef(Array.from({ length: 8 }, () => new Animated.Value(1)));
  const [board, setBoard] = useState<BoardCell[]>(
    () => initialBoard ?? (Array.from({ length: BOARD_SIZE }, () => null) as BoardCell[]),
  );
  const [playerRacks, setPlayerRacks] = useState<Record<Player, StickerId[]>>(
    () => initialPlayerRacks ?? createSharedPlayerRacks(undefined, { soloMode, roundNumber }),
  );
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState<number | null>(null);
  const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);
  const [selectedPowerSlotId, setSelectedPowerSlotId] = useState<BattlePowerSlotId | null>(null);
  const [lockedRackSlots, setLockedRackSlots] = useState<Record<Player, LockedRackSlot>>({
    player1: null,
    player2: null,
  });
  const [ep1Visible, setEp1Visible] = useState(false);
  const [ep1EffectLabel, setEp1EffectLabel] = useState('Random Power');
  const [ep1AnimationEvent, setEp1AnimationEvent] = useState<GameBoardEffectEvent | null>(null);
  const lastEp1EffectIdRef = useRef<GameBoardEffectId | null>(null);

  const currentRack = playerRacks[currentPlayer];
  const lockedRackSlot = lockedRackSlots[currentPlayer];

  const animateRackSelection = useCallback((index: number) => {
    const scale = rackScalesRef.current[index];
    if (!scale) return;
    scale.stopAnimation();
    scale.setValue(1);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.12,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const consumePower = useCallback((slotId: BattlePowerSlotId) => {
    onConsumePower?.(slotId);
    setSelectedPowerSlotId(null);
  }, [onConsumePower]);

  const handleResolveRoll = useCallback((index: number, faceIndex: number) => {
    const selectedCell = board[index];
    if (!selectedCell || !selectedCell.faces || rollsDisabled) return;

    const resolution = resolveBoardRoll({
      board,
      index,
      faceIndex,
      previousEffectId: lastEp1EffectIdRef.current,
      currentPlayer,
    });
    if (!resolution) return;

    let rollEffectId: GameBoardEffectId | undefined;
    if (resolution.kind === 'effect') {
      lastEp1EffectIdRef.current = resolution.effectId;
      rollEffectId = resolution.effectId;
      setEp1EffectLabel(`You rolled, it landed on Random, which launched ${resolution.effectLabel}`);
      setEp1AnimationEvent(resolution.effectEvent);
      setEp1Visible(true);
      playEp1Sound(resolution.effectId, playSound);
    } else if (resolution.kind === 'refill') {
      const refillResult = onPowerRefill?.();
      const refillLabel = refillResult
        ? refillResult.banked
          ? `banked +${refillResult.bonusCount} on ${refillResult.label}`
          : `filled up your ${refillResult.label}`
        : 'No power selected';
      setEp1EffectLabel(`Dice landed on refill and ${refillLabel}`);
      setEp1AnimationEvent(null);
      setEp1Visible(true);
      playSound?.('jackpot');
      lastEp1EffectIdRef.current = null;
    } else {
      lastEp1EffectIdRef.current = null;
    }

    playSound?.('place');
    setBoard(resolution.nextBoard);
    setLastMoveIndex(resolution.lastMoveIndex);
    setSelectedEmojiIndex(null);
    setSelectedPowerSlotId(null);
    onRollConsumed?.();
    onTurnEnd(resolution.nextBoard, { moveType: 'roll', effectId: rollEffectId });
  }, [board, currentPlayer, onPowerRefill, onRollConsumed, onTurnEnd, playSound, rollsDisabled]);

  const rollFlow = useRollFlow({
    board,
    onCommitRoll: handleResolveRoll,
    onEnterRollMode: () => setSelectedEmojiIndex(null),
    disabled: rollsDisabled,
  });

  const placeFromRackIndex = useCallback((boardIndex: number, rackIndex: number) => {
    if (interactionDisabled || rollFlow.isActive) return false;
    const placement = resolveRackPlacement({
      board,
      currentPlayer,
      currentRack,
      boardIndex,
      rackIndex,
      lockedRackSlot: lockedRackSlots[currentPlayer],
      soloMode,
      roundNumber,
    });
    if (!placement) return false;

    playSound?.('place');
    setBoard(placement.nextBoard);
    setLastMoveIndex(boardIndex);
    setSelectedEmojiIndex(null);
    setSelectedPowerSlotId(null);
    setPlayerRacks((currentRacks) => {
      return { ...currentRacks, [currentPlayer]: placement.nextRack };
    });
    setLockedRackSlots((currentLocks) => {
      if (!placement.shouldClearLockedSlot) {
        return currentLocks;
      }
      return { ...currentLocks, [currentPlayer]: null };
    });
    setEp1Visible(false);
    setEp1AnimationEvent(null);
    onTurnEnd(placement.nextBoard, { moveType: 'place' });
    return true;
  }, [
    board,
    currentPlayer,
    currentRack,
    interactionDisabled,
    lockedRackSlots,
    onTurnEnd,
    playSound,
    rollFlow.isActive,
    roundNumber,
    soloMode,
  ]);

  const handleSquarePress = useCallback((index: number) => {
    if (rollFlow.isActive) {
      rollFlow.handleBoardTilePress(index);
      return;
    }

    if (interactionDisabled) return;

    if (selectedPowerSlotId !== null) {
      const slot = powerSlots?.[selectedPowerSlotId];
      if (!slot || slot.usesLeft <= 0 || slot.powerId === 'power-torture-rack') return;

      const effectResult = resolveTargetedBoardPower(board, index, slot.powerId);
      if (!effectResult) return;

      setEp1EffectLabel(effectResult.effectEvent.label);
      setEp1AnimationEvent(effectResult.effectEvent);
      setEp1Visible(false);
      playEp1Sound(effectResult.effectEvent.id, playSound, 'upgrade');
      setBoard(effectResult.nextBoard);
      setLastMoveIndex(effectResult.lastMoveIndex);
      setSelectedEmojiIndex(null);
      consumePower(selectedPowerSlotId);
      onTurnEnd(effectResult.nextBoard, { moveType: 'power', effectId: effectResult.effectId });
      return;
    }

    if (board[index] !== null || selectedEmojiIndex === null) return;

    placeFromRackIndex(index, selectedEmojiIndex);
  }, [
    board,
    consumePower,
    interactionDisabled,
    placeFromRackIndex,
    onTurnEnd,
    playSound,
    powerSlots,
    rollFlow,
    selectedEmojiIndex,
    selectedPowerSlotId,
  ]);

  const showEp1Launch = useCallback((event: GameBoardEffectEvent | string = 'Random Power', showStatus = false, statusLabel?: string) => {
    if (typeof event === 'string') {
      setEp1EffectLabel(event);
      setEp1Visible(showStatus);
      return;
    }
    setEp1EffectLabel(statusLabel ?? event.label);
    setEp1AnimationEvent(event);
    setEp1Visible(showStatus);
    playEp1Sound(event.id, playSound);
  }, [playSound]);

  const handleSelectRackIndex = useCallback((index: number) => {
    if (interactionDisabled || rollFlow.isActive) return;

    if (selectedPowerSlotId !== null) {
      const slot = powerSlots?.[selectedPowerSlotId];
      if (slot?.powerId === 'power-torture-rack' && slot.usesLeft > 0) {
        const stickerId = currentRack[index];
        if (!stickerId) return;
        setLockedRackSlots((currentLocks) => ({
          ...currentLocks,
          [currentPlayer]: { index, stickerId },
        }));
        onRackLocked?.();
        consumePower(selectedPowerSlotId);
        return;
      }
    }

    setSelectedEmojiIndex(index);
    animateRackSelection(index);
  }, [
    animateRackSelection,
    consumePower,
    currentPlayer,
    currentRack,
    interactionDisabled,
    onRackLocked,
    powerSlots,
    rollFlow.isActive,
    selectedPowerSlotId,
  ]);

  const resetBoardState = useCallback((
    nextBoard: BoardCell[] = Array.from({ length: BOARD_SIZE }, () => null) as BoardCell[],
    nextPlayerRacks: Record<Player, StickerId[]> = createSharedPlayerRacks(undefined, { soloMode, roundNumber }),
  ) => {
    setBoard(nextBoard);
    setPlayerRacks(nextPlayerRacks);
    setSelectedEmojiIndex(null);
    setLastMoveIndex(null);
    setSelectedPowerSlotId(null);
    setLockedRackSlots({ player1: null, player2: null });
    setEp1Visible(false);
    setEp1AnimationEvent(null);
    rackScalesRef.current.forEach((scale) => scale.setValue(1));
    rollFlow.resetRollState();
  }, [rollFlow, roundNumber, soloMode]);

  const rerollCurrentRack = useCallback(() => {
    setPlayerRacks((currentRacks) => {
      const nextRack = createRerolledRack({
        lockedRackSlot: lockedRackSlots[currentPlayer],
        soloMode,
        roundNumber,
      });
      return { ...currentRacks, [currentPlayer]: nextRack };
    });
  }, [currentPlayer, lockedRackSlots, roundNumber, soloMode]);

  return {
    board,
    currentRack,
    playerRacks,
    selectedEmojiIndex,
    lastMoveIndex,
    rackScales: rackScalesRef.current,
    rollFlow,
    selectedPowerSlotId,
    lockedRackIndex: lockedRackSlot?.index ?? null,
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1: () => setEp1Visible(false),
    showEp1Launch,
    handleSquarePress,
    handleSelectRackIndex,
    placeFromRackIndex,
    handleResolveRoll,
    animateRackSelection,
    setBoard,
    setPlayerRacks,
    setLastMoveIndex,
    setSelectedPowerSlotId,
    resetBoardState,
    rerollCurrentRack,
  };
}
