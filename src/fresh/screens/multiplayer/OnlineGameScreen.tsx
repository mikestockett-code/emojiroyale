import React from 'react';
import { Text, View } from 'react-native';
import type { MultiplayerRoomController } from '../../../multiplayer/useMultiplayerRoom';
import { useOnlineGame } from '../../../multiplayer/useOnlineGame';
import type { FreshProfile } from '../../profile/types';
import { GameModeScreenShell } from '../../shared/GameModeScreenShell';
import GameResultOverlay from '../../shared/GameResultOverlay';
import { onlineTheme } from '../../multiplayer/onlineTheme';
import { styles } from './OnlineGameScreen.styles';

type Props = {
  mpRoom: MultiplayerRoomController;
  activeProfile: FreshProfile | null;
  onBackToMenu: () => void;
};

export default function OnlineGameScreen({ mpRoom, activeProfile, onBackToMenu }: Props) {
  const roomData = mpRoom.roomData;
  const hostName = roomData?.hostName ?? 'Host';
  const guestName = roomData?.guestName ?? 'Guest';
  const onlineGame = useOnlineGame(mpRoom, { hostName, guestName });
  const p1Name = hostName;
  const p2Name = guestName;
  const currentPlayerName = onlineGame.currentPlayer === 'player1' ? p1Name : p2Name;
  const myName = onlineGame.myPlayer === 'player1' ? p1Name : p2Name;
  const opponentName = onlineGame.myPlayer === 'player1' ? p2Name : p1Name;
  const myRolls = onlineGame.rollCounts[onlineGame.myPlayer];
  const opponentRolls = onlineGame.rollCounts[onlineGame.myPlayer === 'player1' ? 'player2' : 'player1'];
  const myTileColor = onlineGame.myPlayer === 'player1' ? onlineTheme.hostTileColor : onlineTheme.guestTileColor;
  const myHighlightColor = onlineGame.myPlayer === 'player1' ? onlineTheme.hostColor : onlineTheme.guestColor;

  return (
    <GameModeScreenShell
      gameAreaProps={{
        onBack: onBackToMenu,
        board: onlineGame.board,
        lastMoveIndex: onlineGame.lastMoveIndex,
        winningLineIndices: onlineGame.winningLineIndices,
        ep1AnimationEvent: onlineGame.ep1AnimationEvent,
        playerColors: { player1: onlineTheme.hostColor, player2: onlineTheme.guestColor },
        playerTileColors: { player1: onlineTheme.hostTileColor, player2: onlineTheme.guestTileColor },
        rollFlow: onlineGame.rollFlow,
        onSquarePress: onlineGame.handleSquarePress,
        rack: onlineGame.currentRack,
        selectedEmojiIndex: onlineGame.selectedEmojiIndex,
        rackScales: onlineGame.rackScales,
        rackTileColor: myTileColor,
        rackHighlightColor: myHighlightColor,
        onSelectRackIndex: onlineGame.handleSelectRackIndex,
        rollDisabled: onlineGame.rollDisabled,
        winner: onlineGame.winnerTitle,
        profileName: myName,
        profileAvatar: activeProfile?.avatar ?? '🙂',
        profileColor: activeProfile?.color ?? 'sunset',
        profileRoleLabel: 'YOU',
        profileBadgeText: String(myRolls),
        secondProfileName: opponentName,
        secondProfileAvatar: '🙂',
        secondProfileColor: onlineGame.myPlayer === 'player1' ? 'ocean' : 'sunset',
        secondProfileRoleLabel: 'OPP',
        secondProfileBadgeText: String(opponentRolls),
        topLeftChalkLabel: 'ONLINE',
        topRightChalkLabel: 'BATTLE',
        centerImage: require('../../../../assets/images/trophy.png'),
        namePlateText: currentPlayerName,
        powerSlots: onlineGame.powerSlotsArray,
        onPowerSlotPress: (id) => onlineGame.handlePowerSlotPress(id as 'slot1' | 'slot2'),
      }}
    >
      {!onlineGame.isMyTurn && !onlineGame.winnerTitle ? (
        <View style={styles.turnOverlay}>
          <Text style={styles.turnText}>{currentPlayerName}'s turn...</Text>
        </View>
      ) : null}
      <GameResultOverlay
        visible={Boolean(onlineGame.winnerTitle)}
        resultTitle={onlineGame.winnerTitle ?? 'Round Over'}
        resultSubtitle={onlineGame.canRematch ? 'Host can start a fresh board.' : 'Waiting for host.'}
        resultTier="common"
        continueLabel="REMATCH"
        backLabel="DONE"
        onContinue={onlineGame.handleRematch}
        onBack={onBackToMenu}
      />
    </GameModeScreenShell>
  );
}
