import type { Animated } from 'react-native';
import type { BoardCell, Player, StickerId } from '../types';

export type RollFlowPhase =
  | 'inactive'
  | 'selecting'
  | 'previewing'
  | 'rolling'
  | 'resolving'
  | 'returning';

export type RollFlowParams = {
  board: BoardCell[];
  onCommitRoll: (index: number, faceIndex: number) => void;
  onEnterRollMode?: () => void;
  onExitRollMode?: () => void;
  disabled?: boolean;
};

export type CpuRollFlow = {
  startCpuRoll: (
    boardIndex: number,
    faceIndex: number,
    onComplete: (boardIndex: number, faceIndex: number) => void,
  ) => void;
};

export type RollFlowViewModel = CpuRollFlow & {
  phase: RollFlowPhase;
  isActive: boolean;
  isBusy: boolean;
  selectedTileIndex: number | null;
  previewStickerId: StickerId | null;
  previewOwner: Player | null;
  previewScale: Animated.Value;
  previewOpacity: Animated.Value;
  previewFlashOpacity: Animated.Value;
  previewRotationDeg: Animated.AnimatedInterpolation<string>;
  enterRollMode: () => void;
  handleBoardTilePress: (index: number) => boolean;
  beginRoll: () => void;
  resetRollState: () => void;
};
