import type { Animated } from 'react-native';
import type { FreshProfileColor } from '../../../fresh/profile/types';
import type { GameBoardEffectEvent } from '../../../lib/gameBoardEffects';
import type { BoardCell, Player, StickerId } from '../../../types';

export type PowerSlot = {
  slotId: string;
  icon: string;
  powerId?: string;
  isSelected: boolean;
};

export type GameAreaProps = {
  onBack?: () => void;

  // Board
  board?: BoardCell[];
  lastMoveIndex?: number | null;
  winningLineIndices?: number[];
  ep1AnimationEvent?: GameBoardEffectEvent | null;
  playerColors?: Record<Player, string>;
  playerTileColors?: Record<Player, string>;

  // Roll flow
  isRollMode?: boolean;
  rollPhase?: string;
  selectedRollIndex?: number | null;
  previewStickerId?: StickerId | null;
  previewOwner?: Player | null;
  previewScale?: Animated.Value;
  previewOpacity?: Animated.Value;
  previewFlashOpacity?: Animated.Value;
  previewRotationDeg?: Animated.AnimatedInterpolation<string>;
  onPreviewPress?: () => void;

  // Rack
  rack?: StickerId[];
  selectedEmojiIndex?: number | null;
  rackScales?: Animated.Value[];
  rackTileColor?: string;
  rackHighlightColor?: string;
  onSelectRackIndex?: (index: number) => void;
  onRoll?: () => void;
  rollDisabled?: boolean;
  onSquarePress?: (index: number) => void;

  // Game status
  winner?: any;

  // Nav bar
  scoreValue?: number;
  profileName?: string;
  profileAvatar?: string | null;
  profileColor?: FreshProfileColor | null;
  profileRoleLabel?: string;
  profileBadgeText?: string | null;
  secondProfileName?: string;
  secondProfileAvatar?: string | null;
  secondProfileColor?: FreshProfileColor | null;
  secondProfileRoleLabel?: string;
  secondProfileBadgeText?: string | null;
  onProfilePress?: () => void;
  onHowToPress?: () => void;

  // Top panel
  topLeftImage?: any;
  topRightImage?: any;
  centerImage?: any;
  namePlateText?: string;
  timerText?: string;
  isTimerFrozen?: boolean;
  topRightImageScale?: number;
  topRightImageOffsetX?: number;
  topRightImageOffsetY?: number;
  layoutScale?: number;
  boardOffsetY?: number;

  // Power slots
  powerSlots?: PowerSlot[];
  onPowerSlotPress?: (slotId: string) => void;

  // Handoff overlay
  isHandoffVisible?: boolean;
  handoffHighlightColor?: string;
  handoffNextPlayerName?: string;
  handoffCurrentPlayerName?: string;
  onContinue?: () => void;
};
