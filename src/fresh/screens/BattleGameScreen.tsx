import React from 'react';
import type { FreshProfileColor } from '../profile/types';
import { useBattleGameState } from '../battle/useBattleGameState';
import { useDelayedVisibility } from '../../hooks/useDelayedVisibility';
import type { BattleGameNavigation } from '../types/navigation';
import { GameModeScreenShell } from '../shared/GameModeScreenShell';
import GameResultOverlay from '../shared/GameResultOverlay';
import { createWizardOfOzRewardPreview } from '../../lib/jackpotRewards';

export default function BattleGameScreen({
  onBackToMenu,
  onReloadBattle,
  onNextBattleStage,
  battleSetup,
  activeProfile,
  onGrantAlbumSticker,
  onGrantAlbumPuzzlePiece,
  onGoToHowTo,
}: BattleGameNavigation) {
  const {
    board,
    currentRack,
    currentPlayer,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    winner,
    roundNumber,
    roundEndState,
    timerSeconds,
    timerFrozen,
    rollFlow,
    ep1AnimationEvent,
    powerSlotsArray,
    rewardPreview,
    pendingStickerRewards,
    isWizardOfOzJackpot,
    toddThoughtText,
    isTimerStealing,
    playerRollsRemaining,
    playerBattleScore,
    cpuBattleScore,
    handleSquarePress,
    handleSelectRackIndex,
    handlePowerSlotPress,
    handleContinue,
  } = useBattleGameState(battleSetup, {
    activeProfileId: activeProfile?.id ?? null,
    albumPuzzlePieces: activeProfile?.albumPuzzlePieces,
    onGrantAlbumSticker,
    onGrantAlbumPuzzlePiece,
  });

  const CPU_COLOR_PRIORITY: FreshProfileColor[] = ['ocean', 'mint', 'violet', 'ember', 'slate', 'sunset'];
  const cpuColor = CPU_COLOR_PRIORITY.find(c => c !== (activeProfile?.color ?? 'sunset')) ?? 'ocean';

  const playerColors = { player1: '#f97316', player2: '#3b82f6' };
  const playerTileColors = { player1: '#fdba74', player2: '#93c5fd' };

  const timerText = `${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, '0')}`;
  const isRoundEndOverlayVisible = useDelayedVisibility(roundEndState !== null, 2000);
  const jackpotPreview = isWizardOfOzJackpot ? createWizardOfOzRewardPreview() : null;
  const battleResultTitle = roundEndState?.battleComplete && roundEndState.reason === 'playerWin'
    ? 'Stage Won!'
    : roundEndState?.battleComplete
    ? 'Stage Lost'
    : roundEndState?.reason === 'playerWin'
    ? 'You Win!'
    : roundEndState?.reason === 'cpuWin'
    ? 'CPU Wins'
    : "Time's Up!";
  const battleResultTier = winner?.type === 'legendary'
    ? 'legendary'
    : winner?.type === 'epic'
    ? 'epic'
    : 'common';
  const didWinStage = roundEndState?.battleComplete && roundEndState.reason === 'playerWin';

  return (
    <GameModeScreenShell
      jackpotVisible={isRoundEndOverlayVisible && isWizardOfOzJackpot}
      gameAreaProps={{
        onBack: onBackToMenu,
        board,
        lastMoveIndex,
        winningLineIndices: winner?.indices ?? [],
        ep1AnimationEvent,
        playerColors,
        playerTileColors,
        rollFlow,
        onSquarePress: handleSquarePress,
        rack: currentRack,
        selectedEmojiIndex,
        rackScales,
        rackTileColor: '#fdba74',
        rackHighlightColor: '#f97316',
        onSelectRackIndex: handleSelectRackIndex,
        rollDisabled: winner !== null || roundEndState !== null || currentPlayer !== 'player1',
        winner,
        profileName: activeProfile?.name ?? 'Player 1',
        profileAvatar: activeProfile?.avatar ?? null,
        profileColor: activeProfile?.color,
        profileBadgeText: String(playerRollsRemaining),
        secondProfileName: 'CPU',
        secondProfileAvatar: '🤖',
        secondProfileColor: cpuColor,
        secondProfileBadgeText: '3',
        namePlateText: `Round ${roundNumber}`,
        stageText: `STAGE ${battleSetup.stageNumber}/3`,
        timerText,
        isTimerFrozen: timerFrozen,
        topLeftImage: null,
        topRightImage: require('../../../assets/BattleModeCpuEgos/todd.png'),
        topRightImageScale: 0.77,
        topRightImageOffsetX: 0,
        topRightImageOffsetY: 0.01,
        topRightThoughtText: toddThoughtText,
        isTimerStealing,
        topScoreValue: playerBattleScore,
        topSubLabel: 'TO WIN',
        topSubValue: 2000,
        topRightSubLabel: 'SCORE',
        topRightSubValue: cpuBattleScore,
        onHowToPress: onGoToHowTo,
        powerSlots: powerSlotsArray,
        onPowerSlotPress: (id) => handlePowerSlotPress(id as 'slot1' | 'slot2'),
      }}
    >
      <GameResultOverlay
        visible={Boolean(roundEndState && isRoundEndOverlayVisible)}
        resultTitle={battleResultTitle}
        resultSubtitle={roundEndState ? `Round ${roundEndState.roundNumber} complete` : ''}
        resultTier={battleResultTier}
        rewardStickerId={jackpotPreview?.stickerId ?? rewardPreview?.stickerId ?? null}
        rewardStickerCount={jackpotPreview?.count ?? rewardPreview?.count ?? 0}
        rewardStickerLabel={jackpotPreview?.stickerName ?? rewardPreview?.stickerName ?? ''}
        rewardStickerKind={jackpotPreview?.kind ?? rewardPreview?.kind}
        rewardImageSource={jackpotPreview?.rewardImageSource ?? rewardPreview?.rewardImageSource}
        runRewardPreviews={pendingStickerRewards}
        continueLabel={didWinStage ? 'NEXT STAGE' : roundEndState?.battleComplete ? 'RETURN TO JOURNEY' : 'CONTINUE'}
        backLabel="MAIN MENU"
        restartLabel="RESTART STAGE"
        showRecapOnLoss
        activeProfile={activeProfile}
        onContinue={didWinStage ? onNextBattleStage : roundEndState?.battleComplete ? onReloadBattle : handleContinue}
        onBack={onBackToMenu}
        onRestart={onReloadBattle}
      />
    </GameModeScreenShell>
  );
}
