import React from 'react';
import { theme } from '../../../fresh/shared/luxuryTheme';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedBottomNav } from '../../../fresh/shared/SharedBottomNav';
import { useGameLayout } from './useGameLayout';
import { GameBoard } from './GameBoard';
import { Ep1EffectOverlay } from './Ep1EffectOverlay';
import { Ep1StatusPill } from './Ep1StatusPill';
import { Confetti } from '../../../fresh/shared/GameResultOverlay/Confetti';
import { WinningLineOverlay } from './WinningLineOverlay';
import { PreviewOverlay } from './PreviewOverlay';
import { StickerRack } from './StickerRack';
import { PowerSlots } from './PowerSlots';
import { TopGameArea } from './TopGameArea';
import { HandoffOverlay } from './HandoffOverlay';
import { ALL_ONE_COMBO, BG_IMAGE, SCORE_CLOUD } from './constants';
import type { GameAreaProps } from './types';
import type { Player } from '../../../types';

export default function GameArea({
  onBack,
  board = [],
  lastMoveIndex = null,
  winningLineIndices = [],
  ep1AnimationEvent = null,
  ep1StatusVisible = false,
  ep1StatusLabel = 'Random Power',
  onClearEp1Status,
  playerColors = { player1: '#f97316', player2: '#3b82f6' },
  playerTileColors,
  isRollMode = false,
  rollPhase = 'inactive',
  selectedRollIndex = null,
  previewStickerId = null,
  previewOwner = null,
  previewScale,
  previewOpacity,
  previewFlashOpacity,
  previewRotationDeg,
  onPreviewPress,
  rack = [],
  selectedEmojiIndex = null,
  rackScales = [],
  rackTileColor = '#fdba74',
  rackHighlightColor = theme.gold,
  onSelectRackIndex,
  onRoll,
  rollDisabled = false,
  onSquarePress,
  winner = null,
  scoreValue = 0,
  profileName,
  profileAvatar,
  profileColor,
  profileRoleLabel,
  profileBadgeText,
  secondProfileName,
  secondProfileAvatar,
  secondProfileColor,
  secondProfileRoleLabel,
  secondProfileBadgeText,
  onProfilePress,
  onHowToPress,
  topLeftImage = SCORE_CLOUD,
  topLeftChalkLabel,
  topLeftWagerEmoji,
  topLeftSubProfile,
  topRightImage,
  topRightChalkLabel,
  topRightWagerEmoji,
  topRightWagerEmojiName,
  topRightSubProfile,
  centerImage,
  namePlateText,
  timerText,
  isTimerFrozen = false,
  isTimerStealing = false,
  topRightImageScale = 1,
  topRightImageOffsetX = 0,
  topRightImageOffsetY = 0,
  topRightThoughtText = null,
  centerImageOffsetY = 0,
  namePlateOffsetY = 0,
  namePlateScale = 1,
  topScoreValue,
  topSubLabel,
  topSubValue,
  stageText,
  topRightSubLabel,
  topRightSubValue,
  layoutScale = 1,
  boardOffsetY = 0,
  powerSlots = [],
  onPowerSlotPress,
  isHandoffVisible = false,
  handoffHighlightColor = theme.gold,
  handoffNextPlayerName = 'Player 2',
  handoffCurrentPlayerName = 'Player 1',
  onContinue,
}: GameAreaProps) {
  const insets = useSafeAreaInsets();
  const layout = useGameLayout(layoutScale, boardOffsetY);
  const { width, height, imgWidth, imgRenderedHeight, imgTop, imgLeft, rackPadTop, anchorX, anchorY, cellSize, boardCells } = layout;

  const tileColors: Record<Player, string> = playerTileColors ?? {
    player1: '#fdba74',
    player2: '#93c5fd',
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={BG_IMAGE} resizeMode="stretch" style={{ position: 'absolute', top: 0, left: 0, width, height }} />

      <TopGameArea width={width} height={height} topLeftImage={topLeftImage} topLeftChalkLabel={topLeftChalkLabel} topLeftWagerEmoji={topLeftWagerEmoji} topLeftSubProfile={topLeftSubProfile} topRightImage={topRightImage} topRightChalkLabel={topRightChalkLabel} topRightWagerEmoji={topRightWagerEmoji} topRightWagerEmojiName={topRightWagerEmojiName} topRightSubProfile={topRightSubProfile} centerImage={centerImage} namePlateText={namePlateText} timerText={timerText} isTimerFrozen={isTimerFrozen} isTimerStealing={isTimerStealing} topRightImageScale={topRightImageScale} topRightImageOffsetX={topRightImageOffsetX} topRightImageOffsetY={topRightImageOffsetY} topRightThoughtText={topRightThoughtText} centerImageOffsetY={centerImageOffsetY} namePlateOffsetY={namePlateOffsetY} namePlateScale={namePlateScale} topScoreValue={topScoreValue} topSubLabel={topSubLabel} topSubValue={topSubValue} stageText={stageText} topRightSubLabel={topRightSubLabel} topRightSubValue={topRightSubValue} profileName={profileName} />

      <Image source={ALL_ONE_COMBO} resizeMode="contain" style={{ position: 'absolute', width: imgWidth, height: imgRenderedHeight * 0.995, left: imgLeft, top: imgTop + height * 0.007 }} />

      <GameBoard
        board={board}
        boardCells={boardCells}
        cellSize={cellSize}
        lastMoveIndex={lastMoveIndex}
        winningLineIndices={winningLineIndices}
        selectedRollIndex={selectedRollIndex}
        isRollMode={isRollMode}
        rollPhase={rollPhase}
        playerColors={playerColors}
        tileColors={tileColors}
        onSquarePress={onSquarePress}
      />

      <WinningLineOverlay
        boardCells={boardCells}
        cellSize={cellSize}
        winningLineIndices={winningLineIndices}
      />

      <Ep1EffectOverlay
        boardCells={boardCells}
        cellSize={cellSize}
        event={ep1AnimationEvent}
      />

      <Ep1StatusPill
        visible={ep1StatusVisible}
        effectLabel={ep1StatusLabel}
        onClear={onClearEp1Status}
      />

      {ep1StatusVisible && ep1StatusLabel.includes('Emoji Power refill') ? (
        <Confetti tier="legendary" />
      ) : null}

      <PreviewOverlay
        isRollMode={isRollMode}
        previewStickerId={previewStickerId}
        previewOwner={previewOwner}
        previewScale={previewScale}
        previewOpacity={previewOpacity}
        previewFlashOpacity={previewFlashOpacity}
        previewRotationDeg={previewRotationDeg}
        onPreviewPress={onPreviewPress}
        anchorX={anchorX}
        anchorY={anchorY}
        cellSize={cellSize}
        playerColors={playerColors}
      />

      <StickerRack
        rack={rack}
        selectedEmojiIndex={selectedEmojiIndex}
        rackScales={rackScales}
        rackTileColor={rackTileColor}
        rackHighlightColor={rackHighlightColor}
        rackPadTop={rackPadTop}
        height={height}
        onSelectRackIndex={onSelectRackIndex}
        onRoll={onRoll}
        rollDisabled={rollDisabled}
      />

      <PowerSlots
        powerSlots={powerSlots}
        onPowerSlotPress={onPowerSlotPress}
        isHandoffVisible={isHandoffVisible}
        width={width}
        rackPadTop={rackPadTop}
        height={height}
      />

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SharedBottomNav
          onBackPress={onBack}
          onProfilePress={onProfilePress}
          onHowToPress={onHowToPress}
          scoreValue={scoreValue}
          profileName={profileName}
          profileAvatar={profileAvatar}
          profileColor={profileColor}
          profileRoleLabel={profileRoleLabel}
          profileBadgeText={profileBadgeText}
          secondProfileName={secondProfileName}
          secondProfileAvatar={secondProfileAvatar}
          secondProfileColor={secondProfileColor}
          secondProfileRoleLabel={secondProfileRoleLabel}
          secondProfileBadgeText={secondProfileBadgeText}
        />
      </View>

      <HandoffOverlay
        visible={isHandoffVisible}
        winner={winner}
        highlightColor={handoffHighlightColor}
        currentPlayerName={handoffCurrentPlayerName}
        nextPlayerName={handoffNextPlayerName}
        onContinue={onContinue}
        insets={insets}
      />
    </View>
  );
}
