import React from 'react';
import type { FreshProfile } from '../profile/types';
import type { FreshPassPlaySetup } from '../passplay/passPlaySetup.types';
import { usePassPlayGameState } from './passplay/usePassPlayGameState';
import { useGoldenPhoenixHolder } from '../../hooks/useGoldenPhoenixHolder';
import { useDelayedVisibility } from '../../hooks/useDelayedVisibility';
import { GameModeScreenShell } from '../shared/GameModeScreenShell';
import GameResultOverlay from '../shared/GameResultOverlay';
import { isWizardOfOzRewardPreview } from '../../lib/jackpotRewards';
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
  onGoToHowTo?: () => void;
};

export default function PassPlayGameScreen({
  onBackToMenu,
  passPlaySetup,
  activeProfile,
  secondaryProfile,
  onGrantAlbumSticker,
  onGrantAlbumPuzzlePiece,
  onGoToHowTo,
}: Props) {
  const phoenixHolder = useGoldenPhoenixHolder();
  const isGoldenPhoenixOpen = phoenixHolder === 'OPEN';
  const {
    board,
    currentRack,
    currentPlayer,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    winner,
    winningLineIndices,
    rewardPreview,
    wagerPayout,
    goldenPhoenixHolderName,
    rollCounts,
    isHandoffVisible,
    rollFlow,
    ep1AnimationEvent,
    currentPowerSlots,
    selectedPowerSlotId,
    handleSquarePress,
    handleSelectRackIndex,
    handleContinue,
    handleRematch,
    handlePressPassPlayPower,
  } = usePassPlayGameState(passPlaySetup, {
    activeProfileId: activeProfile?.id ?? null,
    secondaryProfileId: secondaryProfile?.id ?? null,
    activeProfileName: activeProfile?.name ?? 'Player 1',
    secondaryProfileName: secondaryProfile?.name ?? 'Player 2',
    isGoldenPhoenixOpen,
    activeAlbumPuzzlePieces: activeProfile?.albumPuzzlePieces,
    secondaryAlbumPuzzlePieces: secondaryProfile?.albumPuzzlePieces,
    onGrantAlbumSticker,
    onGrantAlbumPuzzlePiece,
  });
  const phoenixHolderLabel = (goldenPhoenixHolderName ?? phoenixHolder) || 'OPEN';

  const powerSlotsArray = ['slot1', 'slot2']
    .map((id) => {
      const slot = currentPowerSlots[id as 'slot1' | 'slot2'];
      if (!slot) return null;
      return { slotId: id, icon: slot.icon, powerId: slot.powerId, isSelected: selectedPowerSlotId === id };
    })
    .filter(Boolean) as { slotId: string; icon: string; isSelected: boolean }[];

  const isResultOverlayVisible = useDelayedVisibility(winner !== null, 2000);
  const p1Name = activeProfile?.name ?? 'Player 1';
  const p2Name = secondaryProfile?.name ?? 'Player 2';
  const currentPlayerName = currentPlayer === 'player1' ? p1Name : p2Name;
  const nextPlayerName = currentPlayer === 'player1' ? p2Name : p1Name;
  const winnerName = winner?.player === 'player2' ? p2Name : p1Name;
  const resultTier = winner?.type === 'legendary' ? 'legendary' : winner?.type === 'epic' ? 'epic' : 'common';
  const resultSubtitle = winner
    ? `${winnerName} wins${wagerPayout ? ` and takes ${wagerPayout.label}` : ''}.`
    : '';
  const isWizardOfOzJackpot = isWizardOfOzRewardPreview(rewardPreview);

  const playerColors = { player1: '#f97316', player2: '#3b82f6' };
  const playerTileColors = { player1: '#fdba74', player2: '#93c5fd' };
  const rackTileColor = currentPlayer === 'player1' ? '#fdba74' : '#93c5fd';
  const rackHighlightColor = currentPlayer === 'player1' ? '#f97316' : '#3b82f6';

  return (
    <GameModeScreenShell
      jackpotVisible={isResultOverlayVisible && isWizardOfOzJackpot}
      gameAreaProps={{
        onBack: onBackToMenu,
        board,
        lastMoveIndex,
        winningLineIndices,
        ep1AnimationEvent,
        playerColors,
        playerTileColors,
        rollFlow,
        onSquarePress: handleSquarePress,
        rack: currentRack,
        selectedEmojiIndex,
        rackScales,
        rackTileColor,
        rackHighlightColor,
        onSelectRackIndex: handleSelectRackIndex,
        rollDisabled: winner !== null || isHandoffVisible,
        winner,
        profileName: p1Name,
        profileAvatar: activeProfile?.avatar ?? '🙂',
        profileColor: activeProfile?.color ?? 'sunset',
        profileRoleLabel: 'P1',
        profileBadgeText: String(rollCounts.player1),
        secondProfileName: p2Name,
        secondProfileAvatar: secondaryProfile?.avatar ?? '🙂',
        secondProfileColor: secondaryProfile?.color ?? 'ocean',
        secondProfileRoleLabel: 'P2',
        secondProfileBadgeText: String(rollCounts.player2),
        isHandoffVisible,
        handoffHighlightColor: rackHighlightColor,
        handoffCurrentPlayerName: currentPlayerName,
        handoffNextPlayerName: nextPlayerName,
        topLeftImage: require('../../../assets/SharedAssets/wagercloud.png'),
        topRightImage: require('../../../assets/SharedAssets/wagercloud.png'),
        centerImage: require('../../../assets/images/trophy.png'),
        namePlateText: phoenixHolderLabel,
        centerImageOffsetY: 0,
        namePlateOffsetY: 0.005,
        namePlateScale: 0.99,
        powerSlots: powerSlotsArray,
        onPowerSlotPress: (id) => handlePressPassPlayPower(id as 'slot1' | 'slot2'),
        onContinue: handleContinue,
        onHowToPress: onGoToHowTo,
      }}
    >
      <GameResultOverlay
        visible={isResultOverlayVisible}
        resultTitle={winner ? `${winnerName} Wins` : 'Round Over'}
        resultSubtitle={resultSubtitle}
        resultTier={resultTier}
        rewardStickerId={rewardPreview?.stickerId ?? wagerPayout?.stickerId ?? null}
        rewardStickerCount={rewardPreview?.count ?? wagerPayout?.count ?? 0}
        rewardStickerLabel={rewardPreview?.stickerName ?? wagerPayout?.label ?? ''}
        rewardStickerKind={rewardPreview?.kind}
        rewardImageSource={rewardPreview?.rewardImageSource}
        continueLabel="REMATCH"
        backLabel="DONE"
        onContinue={handleRematch}
        onBack={onBackToMenu}
      />
    </GameModeScreenShell>
  );
}

