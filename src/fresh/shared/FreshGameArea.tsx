import React from 'react';
import type { Animated } from 'react-native';
import GameArea from '../../components/game/GameArea';
import type { GameAreaProps } from '../../components/game/GameArea/types';
import type { SoloRollFlowViewModel } from '../../hooks/soloRollTypes';
import type { BoardCell, StickerId } from '../../types';

type Props = Omit<GameAreaProps,
  | 'isRollMode' | 'rollPhase' | 'selectedRollIndex'
  | 'previewStickerId' | 'previewOwner' | 'previewScale'
  | 'previewOpacity' | 'previewFlashOpacity' | 'previewRotationDeg'
  | 'onPreviewPress' | 'onRoll' | 'onSquarePress'
> & {
  onBack: () => void;
  board: BoardCell[];
  lastMoveIndex: number | null;
  winningLineIndices?: number[];
  rollFlow: SoloRollFlowViewModel;
  onSquarePress: (index: number) => void;
  rack: StickerId[];
  selectedEmojiIndex: number | null;
  rackScales: Animated.Value[];
  onSelectRackIndex: (index: number) => void;
  rollDisabled: boolean;
  winner: unknown;
};

export function FreshGameArea({ rollFlow, onSquarePress, ...rest }: Props) {
  const handleBoardPress = (index: number) => {
    if (rollFlow.isActive) {
      rollFlow.handleBoardTilePress(index);
      return;
    }
    onSquarePress(index);
  };

  return (
    <GameArea
      {...rest}
      onSquarePress={handleBoardPress}
      isRollMode={rollFlow.isActive}
      rollPhase={rollFlow.phase}
      selectedRollIndex={rollFlow.selectedTileIndex}
      previewStickerId={rollFlow.previewStickerId}
      previewOwner={rollFlow.previewOwner}
      previewScale={rollFlow.previewScale}
      previewOpacity={rollFlow.previewOpacity}
      previewFlashOpacity={rollFlow.previewFlashOpacity}
      previewRotationDeg={rollFlow.previewRotationDeg}
      onPreviewPress={rollFlow.beginRoll}
      onRoll={rollFlow.enterRollMode}
    />
  );
}
