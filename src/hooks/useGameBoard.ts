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
import { useSoloRollFlow } from './useSoloRollFlow';
import { applyDieFace, buildDieCell, getRandomFreeSticker } from '../lib/diceLogic';
import { createSharedPlayerRacks, createSharedRack } from '../lib/sharedRackLogic';
import { applyRandomGameBoardEffect, createGameBoardEffectEvent } from '../lib/gameBoardEffects';
import type { GameBoardEffectEvent, GameBoardEffectId } from '../lib/gameBoardEffects';

// Shared board engine for Solo, Pass-and-play, and Battle.
// Keep raw board/rack placement, dice-roll resolution, EP1 display state, and battle power board edits here.
// Mode hooks should own scoring, rewards, turns, overlays, and CPU/story rules instead of duplicating this logic.
const BOARD_SIZE = 25;
const BOARD_COLS = 5;

type LockedRackSlot = { index: number; stickerId: StickerId } | null;

type PowerSlotState = {
  powerId: BattlePowerId;
  type: BattlePowerType;
  usesLeft: number;
};

type PowerSlotsById = Partial<Record<BattlePowerSlotId, PowerSlotState | null>>;
type TurnEndMeta = { moveType: 'place' | 'roll' | 'power' };

type UseGameBoardParams = {
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
  onRollConsumed?: () => void;
  onRackLocked?: () => void;
  playSound?: (key: AudioSourceKey) => void;
};

export function useGameBoard({
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
  onRollConsumed,
  onRackLocked,
  playSound,
}: UseGameBoardParams) {
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

    const landedFace = selectedCell.faces[faceIndex];
    let nextBoard = [...board];
    let nextLastMoveIndex: number | null = index;
    if (landedFace === 'die-ep1') {
      const ep1Result = applyRandomGameBoardEffect(board, index, lastEp1EffectIdRef.current);
      nextBoard = ep1Result.nextBoard;
      nextLastMoveIndex = ep1Result.lastMoveIndex;
      lastEp1EffectIdRef.current = ep1Result.effectId;
      setEp1EffectLabel(ep1Result.effectLabel);
      setEp1AnimationEvent(createGameBoardEffectEvent(ep1Result.effectId, ep1Result.effectLabel, ep1Result.affectedIndices, board));
      setEp1Visible(true);
      if (ep1Result.effectId === 'tornado') playSound?.('tornado');
      else if (ep1Result.effectId === 'clearRow' || ep1Result.effectId === 'clearColumn') playSound?.('clearRow');
      else if (ep1Result.effectId === 'fourSquare') playSound?.('fourSquare');
      else if (ep1Result.effectId === 'removeTile') playSound?.('eraser');
    } else if (landedFace === 'die-free') {
      nextBoard[index] = { player: currentPlayer, stickerId: getRandomFreeSticker() };
      lastEp1EffectIdRef.current = null;
    } else {
      nextBoard[index] = applyDieFace(selectedCell, faceIndex);
      lastEp1EffectIdRef.current = null;
    }

    playSound?.('place');
    setBoard(nextBoard);
    setLastMoveIndex(nextLastMoveIndex);
    setSelectedEmojiIndex(null);
    setSelectedPowerSlotId(null);
    onRollConsumed?.();
    onTurnEnd(nextBoard, { moveType: 'roll' });
  }, [board, currentPlayer, onRollConsumed, onTurnEnd, playSound, rollsDisabled]);

  const rollFlow = useSoloRollFlow({
    board,
    onCommitRoll: handleResolveRoll,
    onEnterRollMode: () => setSelectedEmojiIndex(null),
    disabled: rollsDisabled,
  });

  const handleSquarePress = useCallback((index: number) => {
    if (rollFlow.isActive) {
      rollFlow.handleBoardTilePress(index);
      return;
    }

    if (interactionDisabled) return;

    if (selectedPowerSlotId !== null) {
      const slot = powerSlots?.[selectedPowerSlotId];
      if (!slot || slot.usesLeft <= 0 || slot.powerId === 'power-torture-rack') return;
      if (board[index] === null) return;

      const nextBoard = [...board];
      let effectEvent: GameBoardEffectEvent | null = null;
      if (slot.powerId === 'power-remove-emoji') {
        nextBoard[index] = null;
        effectEvent = createGameBoardEffectEvent('removeTile', 'Remove Tile', [index], board);
      } else if (slot.powerId === 'power-clear-row') {
        const row = Math.floor(index / BOARD_COLS);
        const affectedIndices: number[] = [];
        for (let col = 0; col < BOARD_COLS; col += 1) {
          const affectedIndex = row * BOARD_COLS + col;
          affectedIndices.push(affectedIndex);
          nextBoard[affectedIndex] = null;
        }
        effectEvent = createGameBoardEffectEvent('clearRow', 'Clear Row', affectedIndices, board);
      } else if (slot.powerId === 'power-clear-column') {
        const col = index % BOARD_COLS;
        const affectedIndices: number[] = [];
        for (let row = 0; row < BOARD_COLS; row += 1) {
          const affectedIndex = row * BOARD_COLS + col;
          affectedIndices.push(affectedIndex);
          nextBoard[affectedIndex] = null;
        }
        effectEvent = createGameBoardEffectEvent('clearColumn', 'Clear Column', affectedIndices, board);
      } else {
        return;
      }

      if (effectEvent) {
        setEp1EffectLabel(effectEvent.label);
        setEp1AnimationEvent(effectEvent);
        setEp1Visible(true);
      }
      if (effectEvent?.id === 'clearRow' || effectEvent?.id === 'clearColumn') playSound?.('clearRow');
      else if (effectEvent?.id === 'fourSquare') playSound?.('fourSquare');
      else if (effectEvent?.id === 'removeTile') playSound?.('eraser');
      else playSound?.('upgrade');
      setBoard(nextBoard);
      setLastMoveIndex(index);
      setSelectedEmojiIndex(null);
      consumePower(selectedPowerSlotId);
      onTurnEnd(nextBoard, { moveType: 'power' });
      return;
    }

    if (board[index] !== null || selectedEmojiIndex === null) return;

    const selectedStickerId = currentRack[selectedEmojiIndex];
    if (!selectedStickerId) return;

    const nextBoard = [...board];
    nextBoard[index] = buildDieCell(currentPlayer, selectedStickerId, roundNumber, soloMode);

    playSound?.('place');
    setBoard(nextBoard);
    setLastMoveIndex(index);
    setSelectedEmojiIndex(null);
    setSelectedPowerSlotId(null);
    setPlayerRacks((currentRacks) => {
      const newRack = createSharedRack(undefined, { soloMode, roundNumber });
      const currentLockedSlot = lockedRackSlots[currentPlayer];
      if (currentLockedSlot && currentLockedSlot.index !== selectedEmojiIndex) {
        newRack[currentLockedSlot.index] = currentLockedSlot.stickerId;
      }
      return { ...currentRacks, [currentPlayer]: newRack };
    });
    setLockedRackSlots((currentLocks) => {
      const currentLockedSlot = currentLocks[currentPlayer];
      if (!currentLockedSlot || currentLockedSlot.index !== selectedEmojiIndex) {
        return currentLocks;
      }
      return { ...currentLocks, [currentPlayer]: null };
    });
    setEp1Visible(false);
    setEp1AnimationEvent(null);
    onTurnEnd(nextBoard, { moveType: 'place' });
  }, [
    board,
    consumePower,
    currentPlayer,
    currentRack,
    interactionDisabled,
    lockedRackSlots,
    onTurnEnd,
    playSound,
    powerSlots,
    rollFlow,
    roundNumber,
    selectedEmojiIndex,
    selectedPowerSlotId,
    soloMode,
  ]);

  const showEp1Launch = useCallback((event: GameBoardEffectEvent | string = 'Random Power') => {
    if (typeof event === 'string') {
      setEp1EffectLabel(event);
      setEp1Visible(true);
      return;
    }
    setEp1EffectLabel(event.label);
    setEp1AnimationEvent(event);
    setEp1Visible(true);
    if (event.id === 'tornado') playSound?.('tornado');
    else if (event.id === 'clearRow' || event.id === 'clearColumn') playSound?.('clearRow');
    else if (event.id === 'fourSquare') playSound?.('fourSquare');
    else if (event.id === 'removeTile') playSound?.('eraser');
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
      const nextRack = createSharedRack(undefined, { soloMode, roundNumber });
      const currentLockedSlot = lockedRackSlots[currentPlayer];
      if (currentLockedSlot) {
        nextRack[currentLockedSlot.index] = currentLockedSlot.stickerId;
      }
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
