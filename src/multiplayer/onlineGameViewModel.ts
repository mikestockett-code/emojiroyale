import { Animated } from 'react-native';
import type { RollFlowViewModel } from '../hooks/rollFlowTypes';
import type { BattlePowerSlotId, BoardCell, Player, StickerId, WinnerInfo } from '../types';
import type { MultiplayerRoomController } from './useMultiplayerRoom';
import type { SerializedGameState } from './multiplayerTypes';
import { playerForRole, winnerTitleFor } from './onlineGameHelpers';

type BuildOnlineGameViewModelParams = {
  role: MultiplayerRoomController['role'];
  mirroredState: SerializedGameState | null;
  hostBoard: BoardCell[];
  hostPlayerRacks: Record<Player, StickerId[]>;
  hostCurrentPlayer: Player;
  hostWinner: WinnerInfo;
  hostWinnerNames: {
    hostName: string;
    guestName: string;
  };
  hostWinningLineIndices: number[];
  hostLastMoveIndex: number | null;
  hostRollCounts: Record<Player, number>;
  hostSelectedEmojiIndex: number | null;
  guestSelectedEmojiIndex: number | null;
  hostSelectedPowerSlotId: BattlePowerSlotId | null;
  guestSelectedPowerSlotId: BattlePowerSlotId | null;
  buildPowerSlotsArrayForPlayer: (
    player: Player,
    selectedPowerSlotId?: BattlePowerSlotId | null,
  ) => { slotId: string; icon: string; powerId: string; isSelected: boolean }[];
  hostRackScales: Animated.Value[];
  guestRackScales: Animated.Value[];
  hostRollFlow: RollFlowViewModel;
  guestRollFlow: RollFlowViewModel;
};

export function buildOnlineGameViewModel({
  role,
  mirroredState,
  hostBoard,
  hostPlayerRacks,
  hostCurrentPlayer,
  hostWinner,
  hostWinnerNames,
  hostWinningLineIndices,
  hostLastMoveIndex,
  hostRollCounts,
  hostSelectedEmojiIndex,
  guestSelectedEmojiIndex,
  hostSelectedPowerSlotId,
  guestSelectedPowerSlotId,
  buildPowerSlotsArrayForPlayer,
  hostRackScales,
  guestRackScales,
  hostRollFlow,
  guestRollFlow,
}: BuildOnlineGameViewModelParams) {
  const visibleBoard = role === 'host' ? hostBoard : mirroredState?.board ?? [];
  const visibleRacks = role === 'host' ? hostPlayerRacks : mirroredState?.playerRacks ?? { player1: [], player2: [] };
  const visibleCurrentPlayer = role === 'host' ? hostCurrentPlayer : mirroredState?.currentPlayer ?? 'player1';
  const visibleWinnerTitle = role === 'host'
    ? winnerTitleFor(hostWinner, hostWinnerNames.hostName, hostWinnerNames.guestName)
    : mirroredState?.winnerTitle ?? null;
  const visibleWinningLineIndices = role === 'host' ? hostWinningLineIndices : mirroredState?.winningLineIndices ?? [];
  const visibleLastMoveIndex = role === 'host' ? hostLastMoveIndex : mirroredState?.lastMoveIndex ?? null;
  const visibleRollCounts = role === 'host' ? hostRollCounts : mirroredState?.rollsRemaining ?? { player1: 3, player2: 3 };
  const myPlayer = playerForRole(role);
  const isMyTurn = visibleCurrentPlayer === myPlayer;
  const selectedPower = role === 'host' ? hostSelectedPowerSlotId : guestSelectedPowerSlotId;

  return {
    board: visibleBoard,
    currentPlayer: visibleCurrentPlayer,
    currentRack: visibleRacks[myPlayer] ?? [],
    selectedEmojiIndex: role === 'host' ? hostSelectedEmojiIndex : guestSelectedEmojiIndex,
    rackScales: role === 'host' ? hostRackScales : guestRackScales,
    lastMoveIndex: visibleLastMoveIndex,
    winningLineIndices: visibleWinningLineIndices,
    winnerTitle: visibleWinnerTitle,
    rollCounts: visibleRollCounts,
    rollFlow: role === 'host' ? hostRollFlow : guestRollFlow,
    powerSlotsArray: buildPowerSlotsArrayForPlayer(myPlayer, selectedPower),
    myPlayer,
    isMyTurn,
  };
}
