import React, { useEffect, useState } from 'react';
import type { FreshProfileColor } from '../profile/types';
import { useBattleGameState } from '../battle/useBattleGameState';
import { useDelayedVisibility } from '../../hooks/useDelayedVisibility';
import type { BattleGameNavigation } from '../types/navigation';
import { GameModeScreenShell } from '../shared/GameModeScreenShell';
import GameResultOverlay from '../shared/GameResultOverlay';
import { BattleStageClearSplash } from '../battle/BattleStageClearSplash';
import { useAudioContext } from '../audio/AudioContext';

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
  const { playSound } = useAudioContext();
  const {
    board,
    currentRack,
    currentPlayer,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    winner,
    roundEndState,
    timerSeconds,
    timerFrozen,
    rollFlow,
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1,
    powerSlotsArray,
    rewardPreview,
    pendingStickerRewards,
    toddThoughtText,
    isTimerStealing,
    playerRollsRemaining,
    playerBattleScore,
    cpuBattleScore,
    adaptiveDifficulty,
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
  const cpuLabel = battleSetup.cpuId === 'nico' ? 'Nico' : 'Todd';
  const battleResultTitle = roundEndState?.battleComplete && roundEndState.reason === 'playerWin'
    ? 'Stage Won!'
    : roundEndState?.battleComplete
    ? 'Stage Lost'
    : roundEndState?.reason === 'playerWin'
    ? 'You Win!'
    : roundEndState?.reason === 'cpuWin'
    ? 'CPU Wins'
    : roundEndState?.reason === 'tie'
    ? 'Draw'
    : "Time's Up!";
  const battleResultTier = winner?.type === 'legendary'
    ? 'legendary'
    : winner?.type === 'epic'
    ? 'epic'
    : 'common';
  const didWinStage = roundEndState?.battleComplete && roundEndState.reason === 'playerWin';
  const didClearAlterEgo = didWinStage && (battleSetup.stageNumber ?? 1) >= 3;
  const [stageClearDismissed, setStageClearDismissed] = useState(false);

  useEffect(() => {
    if (!isRoundEndOverlayVisible || !didWinStage) return;
    playSound('stageClear');
  }, [didWinStage, isRoundEndOverlayVisible, playSound]);

  useEffect(() => {
    setStageClearDismissed(false);
  }, [roundEndState]);

  useEffect(() => {
    if (!isRoundEndOverlayVisible || !didClearAlterEgo) return;
    const timer = setTimeout(() => setStageClearDismissed(true), 3600);
    return () => clearTimeout(timer);
  }, [didClearAlterEgo, isRoundEndOverlayVisible]);

  return (
    <GameModeScreenShell
      gameAreaProps={{
        onBack: onBackToMenu,
        board,
        lastMoveIndex,
        winningLineIndices: winner?.indices ?? [],
        ep1AnimationEvent,
        ep1StatusVisible: ep1Visible,
        ep1StatusLabel: ep1EffectLabel,
        onClearEp1Status: clearEp1,
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
        namePlateText: undefined,
        stageText: `STAGE ${battleSetup.stageNumber}/3`,
        timerText,
        isTimerFrozen: timerFrozen,
        topLeftImage: null,
        topRightImage: battleSetup.cpuId === 'nico'
          ? require('../../../assets/CustomEmojis/nico_non_alpha_emoji.png')
          : require('../../../assets/BattleModeCpuEgos/todd.png'),
        topRightImageScale: 0.77,
        topRightImageOffsetX: 0,
        topRightImageOffsetY: -0.01,
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
      <BattleStageClearSplash
        visible={Boolean(isRoundEndOverlayVisible && didClearAlterEgo && !stageClearDismissed)}
        cpuId={battleSetup.cpuId}
      />
      <GameResultOverlay
        visible={Boolean(roundEndState && isRoundEndOverlayVisible)}
        resultTitle={battleResultTitle}
        resultSubtitle={roundEndState ? `${cpuLabel} ${roundEndState.roundNumber} complete` : ''}
        resultTier={battleResultTier}
        rewardStickerId={rewardPreview?.stickerId ?? null}
        rewardStickerCount={rewardPreview?.count ?? 0}
        rewardStickerLabel={rewardPreview?.stickerName ?? ''}
        rewardStickerKind={rewardPreview?.kind}
        rewardImageSource={rewardPreview?.rewardImageSource}
        runRewardPreviews={pendingStickerRewards}
        continueLabel={didWinStage ? 'NEXT STAGE' : roundEndState?.battleComplete ? 'RETURN TO JOURNEY' : 'CONTINUE'}
        backLabel="MAIN MENU"
        restartLabel={roundEndState?.battleComplete && !didWinStage ? 'RESTART STAGE' : 'NEXT ROUND'}
        showRecapOnLoss
        activeProfile={activeProfile}
        onContinue={didWinStage ? () => onNextBattleStage(adaptiveDifficulty) : roundEndState?.battleComplete ? () => onReloadBattle(adaptiveDifficulty) : handleContinue}
        onBack={onBackToMenu}
        onRestart={roundEndState?.battleComplete && !didWinStage ? () => onReloadBattle(adaptiveDifficulty) : handleContinue}
      />
    </GameModeScreenShell>
  );
}
