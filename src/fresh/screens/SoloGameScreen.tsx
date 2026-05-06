// SoloGameScreen.tsx
// New Solo game screen.
//
// This screen intentionally reuses the existing SoloGameArea presentation,
// but keeps the new fresh lane in control of when and why it is rendered.
//
// This screen is the Solo screen shell for the fresh lane.
// Solo-specific state lives in ../../hooks/useSoloGameState.ts.

import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import type { GameScreenNavigation } from '../types/navigation';
import SoloResultOverlay from '../../components/game/SoloResultOverlay';
import { useSoloGameState } from '../../hooks/useSoloGameState';
import { getSoloSafeScore } from '../../lib/soloRewardRules';
import type { FreshProfile, FreshProfileColor } from '../profile/types';
import type { FreshSoloSetup } from '../solo/soloSetup.types';
import { FreshGameArea } from '../shared/FreshGameArea';
import { getFreshSoloModeAvailability } from '../solo/soloSubmenuValidation';
import { createFreshSoloSetup } from '../solo/soloWagerFactory';
import type { StickerId } from '../../types';
import type { AlbumPuzzleId } from '../album/album.types';

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
}: Props) {
  const savedLossScoreKeyRef = useRef<string | null>(null);
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
  useEffect(() => {
    if (!isLoss || currentScore <= 0) {
      savedLossScoreKeyRef.current = null;
      return;
    }

    const scoreKey = `${activeProfile?.id ?? 'no-profile'}:${soloRoundNumber}:${currentScore}`;
    if (savedLossScoreKeyRef.current === scoreKey) return;

    savedLossScoreKeyRef.current = scoreKey;
    onUpdateSoloHighScore(activeProfile?.id ?? null, currentScore);
  }, [activeProfile?.id, currentScore, isLoss, onUpdateSoloHighScore]);

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
                onSwitchSoloSetup?.(createFreshSoloSetup(fallbackMode));
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
    <View style={{ flex: 1 }}>
      <FreshGameArea
        onBack={onBackToMenu}
        board={board}
        lastMoveIndex={lastMoveIndex}
        winningLineIndices={winningLineIndices}
        ep1AnimationEvent={ep1AnimationEvent}
        playerColors={{ player1: '#f59e0b', player2: '#60a5fa' }}
        playerTileColors={{ player1: '#fdba74', player2: '#93c5fd' }}
        rollFlow={rollFlow}
        onSquarePress={handleSquarePress}
        rack={rack}
        selectedEmojiIndex={selectedEmojiIndex}
        rackScales={rackScales}
        rackTileColor="#fdba74"
        rackHighlightColor="#ffd97d"
        onSelectRackIndex={handleSelectRackIndex}
        timerText="15"
        namePlateText={`Round ${soloRoundNumber}`}
        rollDisabled={Boolean(winnerTitle) || playerRollsRemaining <= 0 || currentPlayer !== 'player1' || isSoloCpuThinking}
        winner={winnerTitle}
        scoreValue={currentScore}
        profileName={activeProfile?.name}
        profileAvatar={activeProfile?.avatar}
        profileColor={activeProfile?.color}
        profileBadgeText={String(playerRollsRemaining)}
        secondProfileName="CPU"
        secondProfileAvatar="🤖"
        secondProfileColor={cpuColor}
        secondProfileBadgeText={String(cpuRollsRemaining)}
      />
      {ep1Visible && (
        <TouchableOpacity
          onPress={clearEp1}
          style={{
            position: 'absolute',
            right: 8,
            top: '34%',
            zIndex: 99,
            backgroundColor: 'rgba(24,9,10,0.92)',
            borderRadius: 12,
            padding: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ef4444',
            shadowColor: '#ef4444',
            shadowOpacity: 0.5,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
          }}
        >
          <Text style={{ color: '#fef3c7', fontWeight: '900', fontSize: 11, letterSpacing: 0, textAlign: 'center' }}>
            RANDOM POWER
          </Text>
          <Text style={{ color: '#fca5a5', fontWeight: '900', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
            {ep1EffectLabel}
          </Text>
          <Text style={{ color: '#fca5a5', fontSize: 9, marginTop: 2 }}>tap to clear</Text>
        </TouchableOpacity>
      )}
      <SoloResultOverlay
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
    </View>
  );
}
