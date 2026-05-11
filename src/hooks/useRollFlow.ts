import React from 'react';
import { Animated, Easing } from 'react-native';
import type { BoardCell } from '../types';
import type { RollFlowParams, RollFlowViewModel, RollFlowPhase } from './rollFlowTypes';

export function useRollFlow({
  board,
  onCommitRoll,
  onEnterRollMode,
  onExitRollMode,
  disabled = false,
}: RollFlowParams): RollFlowViewModel {
  const [phase, setPhase] = React.useState<RollFlowPhase>('inactive');
  const [selectedTileIndex, setSelectedTileIndex] = React.useState<number | null>(null);
  const [previewFaceIndex, setPreviewFaceIndex] = React.useState<number | null>(null);
  const [resolvedFaceIndex, setResolvedFaceIndex] = React.useState<number | null>(null);

  const previewScale = React.useRef(new Animated.Value(0.6)).current;
  const previewRotation = React.useRef(new Animated.Value(0)).current;
  const previewOpacity = React.useRef(new Animated.Value(0)).current;
  const previewFlashOpacity = React.useRef(new Animated.Value(0)).current;

  const rollIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCell = selectedTileIndex !== null ? board[selectedTileIndex] : null;
  const isActive = phase !== 'inactive';
  const isBusy = phase === 'rolling' || phase === 'resolving' || phase === 'returning';

  const clearTimers = React.useCallback(() => {
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
    if (resolveTimeoutRef.current) {
      clearTimeout(resolveTimeoutRef.current);
      resolveTimeoutRef.current = null;
    }
    if (returnTimeoutRef.current) {
      clearTimeout(returnTimeoutRef.current);
      returnTimeoutRef.current = null;
    }
  }, []);

  const resetRollState = React.useCallback(() => {
    clearTimers();
    setPhase('inactive');
    setSelectedTileIndex(null);
    setPreviewFaceIndex(null);
    setResolvedFaceIndex(null);
    previewScale.stopAnimation();
    previewRotation.stopAnimation();
    previewOpacity.stopAnimation();
    previewFlashOpacity.stopAnimation();
    previewScale.setValue(1);
    previewRotation.setValue(0);
    previewOpacity.setValue(0);
    previewFlashOpacity.setValue(0);
    onExitRollMode?.();
  }, [clearTimers, onExitRollMode, previewFlashOpacity, previewOpacity, previewRotation, previewScale]);

  React.useEffect(() => clearTimers, [clearTimers]);

  const enterRollMode = React.useCallback(() => {
    if (disabled || isBusy) return;
    if (phase === 'inactive') {
      setPhase('selecting');
      onEnterRollMode?.();
      return;
    }
    if (phase === 'selecting' || phase === 'previewing') {
      resetRollState();
    }
  }, [disabled, isBusy, onEnterRollMode, phase, resetRollState]);

  const handleBoardTilePress = React.useCallback(
    (index: number) => {
      if (disabled || phase !== 'selecting') return false;
      const cell = board[index];
      if (!cell || !cell.faces) return true;

      setSelectedTileIndex(index);
      setPreviewFaceIndex(cell.currentFaceIndex ?? 0);
      setResolvedFaceIndex(null);
      setPhase('previewing');
      previewScale.setValue(1);
      previewOpacity.setValue(0.96);
      previewFlashOpacity.setValue(0);
      previewRotation.setValue(0);
      Animated.parallel([
        Animated.timing(previewScale, {
          toValue: 1.25,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return true;
    },
    [board, disabled, phase, previewFlashOpacity, previewOpacity, previewScale, previewRotation]
  );

  const runRollAnimation = React.useCallback((
    cell: NonNullable<BoardCell>,
    finalFaceIndex: number,
    onDone: () => void,
  ) => {
    previewRotation.setValue(0);
    previewFlashOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(previewRotation, {
        toValue: 1, duration: 980, easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(previewScale, {
          toValue: 1.34, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(previewScale, {
          toValue: 1.16, duration: 800, easing: Easing.inOut(Easing.cubic), useNativeDriver: true,
        }),
      ]),
    ]).start();

    let current = cell.currentFaceIndex ?? 0;
    rollIntervalRef.current = setInterval(() => {
      current = (current + 1) % cell.faces!.length;
      setPreviewFaceIndex(current);
    }, 70);

    resolveTimeoutRef.current = setTimeout(() => {
      clearTimers();
      setPreviewFaceIndex(finalFaceIndex);
      setPhase('resolving');
      Animated.parallel([
        Animated.sequence([
          Animated.timing(previewFlashOpacity, {
            toValue: 0.72, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true,
          }),
          Animated.timing(previewFlashOpacity, {
            toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(previewScale, {
            toValue: 1.3, duration: 110, easing: Easing.out(Easing.quad), useNativeDriver: true,
          }),
          Animated.spring(previewScale, {
            toValue: 1.2, friction: 5, tension: 110, useNativeDriver: true,
          }),
        ]),
      ]).start();

      const isEp1 = cell.faces![finalFaceIndex] === 'die-ep1';
      returnTimeoutRef.current = setTimeout(() => {
        setPhase('returning');
        Animated.parallel([
          Animated.timing(previewScale, {
            toValue: 0.82, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true,
          }),
          Animated.timing(previewOpacity, {
            toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true,
          }),
        ]).start(() => { onDone(); resetRollState(); });
      }, isEp1 ? 1400 : 260);
    }, 980);
  }, [clearTimers, previewFlashOpacity, previewOpacity, previewRotation, previewScale, resetRollState]);

  const beginRoll = React.useCallback(() => {
    if (disabled || phase !== 'previewing' || selectedTileIndex === null || !selectedCell?.faces) return;
    const finalFaceIndex = Math.floor(Math.random() * selectedCell.faces.length);
    setResolvedFaceIndex(finalFaceIndex);
    setPhase('rolling');
    runRollAnimation(selectedCell, finalFaceIndex, () => onCommitRoll(selectedTileIndex, finalFaceIndex));
  }, [disabled, onCommitRoll, phase, runRollAnimation, selectedCell, selectedTileIndex]);

  const startCpuRoll = React.useCallback((
    boardIndex: number,
    finalFaceIndex: number,
    onComplete: (boardIndex: number, faceIndex: number) => void,
  ) => {
    const cell = board[boardIndex];
    if (!cell?.faces) { onComplete(boardIndex, finalFaceIndex); return; }
    setSelectedTileIndex(boardIndex);
    setPreviewFaceIndex(cell.currentFaceIndex ?? 0);
    setResolvedFaceIndex(finalFaceIndex);
    setPhase('rolling');
    previewScale.setValue(1.0);
    previewOpacity.setValue(0.96);
    runRollAnimation(cell, finalFaceIndex, () => onComplete(boardIndex, finalFaceIndex));
  }, [board, previewOpacity, previewScale, runRollAnimation]);

  const previewRotationDeg = previewRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const previewStickerId =
    selectedCell?.faces && previewFaceIndex !== null ? selectedCell.faces[previewFaceIndex] : selectedCell?.stickerId ?? null;
  const previewOwner = previewFaceIndex !== null
    ? (previewFaceIndex < 2 ? 'player1' : previewFaceIndex < 4 ? 'player2' : null)
    : selectedCell?.player ?? null;

  return {
    phase,
    isActive,
    isBusy,
    selectedTileIndex,
    previewStickerId,
    previewOwner,
    previewScale,
    previewOpacity,
    previewFlashOpacity,
    previewRotationDeg,
    enterRollMode,
    handleBoardTilePress,
    beginRoll,
    startCpuRoll,
    resetRollState,
  };
}
