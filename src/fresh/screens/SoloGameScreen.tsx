import React, { useCallback } from 'react';
import { theme } from '../shared/luxuryTheme';
import { Alert } from 'react-native';
import type { GameScreenNavigation } from '../types/navigation';
import GameResultOverlay from '../shared/GameResultOverlay';
import { isWizardOfOzRewardPreview } from '../../lib/jackpotRewards';
import { useSoloGameState } from '../../hooks/useSoloGameState';
import { getSoloSafeScore } from '../../lib/soloRewardRules';
import type { FreshProfile, FreshProfileColor } from '../profile/types';
import type { FreshSoloSetup } from '../solo/soloSetup.types';
import { GameModeScreenShell } from '../shared/GameModeScreenShell';
import { getFreshSoloModeAvailability } from '../solo/soloSubmenuValidation';
import { createFreshSoloSetup } from '../solo/soloWagerFactory';
import { useSoloLossHighScore } from '../solo/useSoloLossHighScore';
import type { BattlePowerSlotId, StickerId } from '../../types';
import type { AlbumPuzzleId } from '../album/album.types';
import { getAlbumStickerEmoji, getAlbumStickerLabel } from '../album/albumStickerLookup';

type Props = GameScreenNavigation & {
  soloSetup: FreshSoloSetup;
  activeProfile: FreshProfile | null;
  onSwitchSoloSetup?: (setup: FreshSoloSetup) => void;
  onGrantAlbumSticker: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;
  onGrantAlbumPuzzlePiece: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void;
  onUpdateSoloHighScore: (profileId: string | null | undefined, score: number) => void;
  onSetFavoriteSticker: (profileId: string | null | undefined, stickerId: string | null) => void;
  globalHighScore?: number;
  onGoToHowTo?: () => void;
};

const CPU_COLOR_PRIORITY: FreshProfileColor[] = ['ocean', 'mint', 'violet', 'ember', 'slate', 'sunset'];

export default function SoloGameScreen({
  onBackToMenu,
  soloSetup,
  activeProfile,
  onSwitchSoloSetup,
  onGrantAlbumSticker,
  onGrantAlbumPuzzlePiece,
  onUpdateSoloHighScore,
  onSetFavoriteSticker,
  globalHighScore = 0,
  onGoToHowTo,
}: Props) {
  const safeScore = getSoloSafeScore(soloSetup.wager.tier);
  const cpuColor = CPU_COLOR_PRIORITY.find(c => c !== (activeProfile?.color ?? 'sunset')) ?? 'ocean';
  const {
    board,
    rack,
    selectedEmojiIndex,
    lastMoveIndex,
    winningLineIndices,
    winnerTitle,
    winnerType,
    isResultOverlayVisible,
    rewardPreview,
    runRewardPreviews,
    currentScore,
    playerRollsRemaining,
    cpuRollsRemaining,
    currentPlayer,
    isSoloCpuThinking,
    soloRoundNumber,
    rackScales,
    rollFlow,
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1,
    buildPowerSlotsArray,
    selectedPowerSlotId,
    handlePowerSlotPress,
    handleSquarePress,
    handleSelectRackIndex,
    handleContinue,
    handleRestart,
  } = useSoloGameState(soloSetup, {
    activeProfileId: activeProfile?.id ?? null,
    albumPuzzlePieces: activeProfile?.albumPuzzlePieces,
    onGrantAlbumSticker,
    onGrantAlbumPuzzlePiece,
  });

  const modeId = soloSetup.modeId;
  const isWagerMode = modeId === 'epicLite' || modeId === 'epic';
  const restartLabel = isWagerMode ? 'REWAGER' : 'RESTART';

  const isLoss = winnerTitle?.toLowerCase().includes('cpu') ?? false;
  const resultTier = winnerType === 'legendary' ? 'legendary' : winnerType === 'epic' ? 'epic' : 'common';
  const isWizardOfOzJackpot = isWizardOfOzRewardPreview(rewardPreview);
  useSoloLossHighScore({
    activeProfileId: activeProfile?.id ?? null,
    currentScore,
    isLoss,
    soloRoundNumber,
    onUpdateSoloHighScore,
  });

  const handleLossRestart = useCallback(() => {
    if (isWagerMode) {
      const availability = getFreshSoloModeAvailability(activeProfile, modeId);
      if (!availability.isSelectable) {
        const epicLiteAvailability = getFreshSoloModeAvailability(activeProfile, 'epicLite');
        const fallbackMode = epicLiteAvailability.isSelectable ? 'epicLite' : 'practice';
        const fallbackLabel = fallbackMode === 'epicLite' ? 'Epic Lite' : 'Practice';
        Alert.alert(
          'Not Enough Stickers',
          `${availability.reason ?? 'You do not qualify for this wager anymore.'}\n\nSwitch to ${fallbackLabel} instead?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: `Switch to ${fallbackLabel}`,
              onPress: () => {
                onSwitchSoloSetup?.(createFreshSoloSetup(fallbackMode, activeProfile?.albumCounts ?? {}, { slot1: null, slot2: null }));
                handleRestart();
              },
            },
          ],
        );
        return;
      }
      handleRestart();
      return;
    }
    handleRestart();
  }, [isWagerMode, activeProfile, modeId, handleRestart, onSwitchSoloSetup]);

  return (
    <GameModeScreenShell
      jackpotVisible={isResultOverlayVisible && isWizardOfOzJackpot}
      gameAreaProps={{
        onBack: onBackToMenu,
        board,
        lastMoveIndex,
        winningLineIndices,
        ep1AnimationEvent,
        ep1StatusVisible: ep1Visible,
        ep1StatusLabel: ep1EffectLabel,
        onClearEp1Status: clearEp1,
        playerColors: { player1: '#f59e0b', player2: '#60a5fa' },
        playerTileColors: { player1: '#fdba74', player2: '#93c5fd' },
        rollFlow,
        onSquarePress: handleSquarePress,
        rack,
        selectedEmojiIndex,
        rackScales,
        rackTileColor: '#fdba74',
        rackHighlightColor: theme.gold,
        onSelectRackIndex: handleSelectRackIndex,
        timerText: '15',
        namePlateText: `Round ${soloRoundNumber}`,
        rollDisabled: Boolean(winnerTitle) || playerRollsRemaining <= 0 || currentPlayer !== 'player1' || isSoloCpuThinking,
        winner: winnerTitle,
        scoreValue: currentScore,
        topRightChalkLabel: soloSetup.wager.stickerId ? 'WAGER' : 'NO WAGER',
        topRightWagerEmoji: getAlbumStickerEmoji(soloSetup.wager.stickerId),
        topRightWagerEmojiName: soloSetup.wager.stickerId
          ? getAlbumStickerLabel(soloSetup.wager.stickerId, '')
          : null,
        topScoreValue: currentScore,
        topSubLabel: 'HIGH SCORE',
        topSubValue: globalHighScore,
        onHowToPress: onGoToHowTo,
        powerSlots: buildPowerSlotsArray(selectedPowerSlotId),
        onPowerSlotPress: (id) => handlePowerSlotPress(id as BattlePowerSlotId),
        profileName: activeProfile?.name,
        profileAvatar: activeProfile?.avatar,
        profileColor: activeProfile?.color,
        profileBadgeText: String(playerRollsRemaining),
        secondProfileName: 'CPU',
        secondProfileAvatar: '🤖',
        secondProfileColor: cpuColor,
        secondProfileBadgeText: String(cpuRollsRemaining),
      }}
    >
      <GameResultOverlay
        visible={isResultOverlayVisible}
        resultTitle={winnerTitle ?? 'Round Over'}
        resultSubtitle={
          winnerTitle
            ? `Round ${soloRoundNumber} complete. Score: ${currentScore.toLocaleString()}${safeScore > 0 ? ` / Safe at ${safeScore.toLocaleString()}` : ''}.`
            : isSoloCpuThinking
              ? 'CPU is choosing a move...'
              : ''
        }
        rewardStickerId={rewardPreview?.stickerId ?? null}
        rewardStickerCount={rewardPreview?.count ?? 0}
        rewardStickerLabel={rewardPreview?.stickerName ?? ''}
        resultTier={resultTier}
        rewardStickerKind={rewardPreview?.kind}
        rewardImageSource={rewardPreview?.rewardImageSource}
        runRewardPreviews={runRewardPreviews}
        roundScore={currentScore}
        activeProfile={activeProfile}
        onSetFavoriteSticker={(stickerId) => onSetFavoriteSticker(activeProfile?.id ?? null, stickerId)}
        continueLabel="Next Round"
        backLabel="Done"
        restartLabel={restartLabel}
        onContinue={handleContinue}
        onRestart={handleLossRestart}
        onBack={onBackToMenu}
      />
    </GameModeScreenShell>
  );
}
