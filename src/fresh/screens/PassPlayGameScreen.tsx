import React from 'react';
import { View } from 'react-native';
import type { FreshProfile } from '../profile/types';
import type { FreshPassPlaySetup } from '../passplay/passPlaySetup.types';
import { usePassPlayGameState } from './passplay/usePassPlayGameState';
import { useGoldenPhoenixHolder } from '../../hooks/useGoldenPhoenixHolder';
import { FreshGameArea } from '../shared/FreshGameArea';
import type { StickerId } from '../../types';
import type { AlbumPuzzleId } from '../album/album.types';

type Props = {
  onBackToMenu: () => void;
  passPlaySetup: FreshPassPlaySetup;
  activeProfile?: FreshProfile | null;
  secondaryProfile?: FreshProfile | null;
  onGrantAlbumSticker: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;
  onGrantAlbumPuzzlePiece: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void;
};

export default function PassPlayGameScreen({
  onBackToMenu,
  passPlaySetup,
  activeProfile,
  secondaryProfile,
  onGrantAlbumSticker,
  onGrantAlbumPuzzlePiece,
}: Props) {
  const {
    board,
    currentRack,
    currentPlayer,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    winner,
    rollCounts,
    isHandoffVisible,
    rollFlow,
    ep1AnimationEvent,
    currentPowerSlots,
    selectedPowerSlotId,
    handleSquarePress,
    handleSelectRackIndex,
    handleContinue,
    handlePressPassPlayPower,
  } = usePassPlayGameState(passPlaySetup, {
    activeProfileId: activeProfile?.id ?? null,
    secondaryProfileId: secondaryProfile?.id ?? null,
    activeAlbumPuzzlePieces: activeProfile?.albumPuzzlePieces,
    secondaryAlbumPuzzlePieces: secondaryProfile?.albumPuzzlePieces,
    onGrantAlbumSticker,
    onGrantAlbumPuzzlePiece,
  });

  const powerSlotsArray = ['slot1', 'slot2']
    .map((id) => {
      const slot = currentPowerSlots[id as 'slot1' | 'slot2'];
      if (!slot) return null;
      return { slotId: id, icon: slot.power.icon, powerId: slot.powerId, isSelected: selectedPowerSlotId === id };
    })
    .filter(Boolean) as { slotId: string; icon: string; isSelected: boolean }[];

  const phoenixHolder = useGoldenPhoenixHolder();
  const p1Name = activeProfile?.name ?? 'Player 1';
  const p2Name = secondaryProfile?.name ?? 'Player 2';
  const currentPlayerName = currentPlayer === 'player1' ? p1Name : p2Name;
  const nextPlayerName = currentPlayer === 'player1' ? p2Name : p1Name;

  const playerColors = { player1: '#f97316', player2: '#3b82f6' };
  const playerTileColors = { player1: '#fdba74', player2: '#93c5fd' };
  const rackTileColor = currentPlayer === 'player1' ? '#fdba74' : '#93c5fd';
  const rackHighlightColor = currentPlayer === 'player1' ? '#f97316' : '#3b82f6';

  return (
    <View style={{ flex: 1 }}>
      <FreshGameArea
        onBack={onBackToMenu}
        board={board}
        lastMoveIndex={lastMoveIndex}
        ep1AnimationEvent={ep1AnimationEvent}
        playerColors={playerColors}
        playerTileColors={playerTileColors}
        rollFlow={rollFlow}
        onSquarePress={handleSquarePress}
        rack={currentRack}
        selectedEmojiIndex={selectedEmojiIndex}
        rackScales={rackScales}
        rackTileColor={rackTileColor}
        rackHighlightColor={rackHighlightColor}
        onSelectRackIndex={handleSelectRackIndex}
        rollDisabled={winner !== null || isHandoffVisible}
        winner={winner}
        profileName={p1Name}
        profileAvatar={activeProfile?.avatar ?? '🙂'}
        profileColor={activeProfile?.color ?? 'sunset'}
        profileRoleLabel="P1"
        profileBadgeText={String(rollCounts.player1)}
        secondProfileName={p2Name}
        secondProfileAvatar={secondaryProfile?.avatar ?? '🙂'}
        secondProfileColor={secondaryProfile?.color ?? 'ocean'}
        secondProfileRoleLabel="P2"
        secondProfileBadgeText={String(rollCounts.player2)}
        isHandoffVisible={isHandoffVisible}
        handoffHighlightColor={rackHighlightColor}
        handoffCurrentPlayerName={currentPlayerName}
        handoffNextPlayerName={nextPlayerName}
        topLeftImage={require('../../../assets/SharedAssets/wagercloud.png')}
        topRightImage={require('../../../assets/SharedAssets/wagercloud.png')}
        centerImage={require('../../../assets/images/trophy.png')}
        namePlateText={phoenixHolder}
        powerSlots={powerSlotsArray}
        onPowerSlotPress={(id) => handlePressPassPlayPower(id as 'slot1' | 'slot2')}
        onContinue={handleContinue}
      />
    </View>
  );
}
