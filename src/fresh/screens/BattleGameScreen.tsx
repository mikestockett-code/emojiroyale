import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useBattleGameState } from '../battle/useBattleGameState';
import type { BattleGameNavigation } from '../types/navigation';
import { FreshGameArea } from '../shared/FreshGameArea';

export default function BattleGameScreen({
  onBackToMenu,
  onReloadBattle,
  battleSetup,
  activeProfile,
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
    handleSquarePress,
    handleSelectRackIndex,
    handlePowerSlotPress,
    handleContinue,
  } = useBattleGameState(battleSetup, activeProfile?.albumCounts);

  const playerColors = { player1: '#f97316', player2: '#3b82f6' };
  const playerTileColors = { player1: '#fdba74', player2: '#93c5fd' };

  const timerText = `${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, '0')}`;

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
        rackTileColor="#fdba74"
        rackHighlightColor="#f97316"
        onSelectRackIndex={handleSelectRackIndex}
        rollDisabled={winner !== null || roundEndState !== null || currentPlayer !== 'player1'}
        winner={winner}
        profileName={activeProfile?.name ?? 'Player 1'}
        profileAvatar={activeProfile?.avatar ?? null}
        namePlateText={`Round ${roundNumber}`}
        timerText={timerText}
        isTimerFrozen={timerFrozen}
        topLeftImage={null}
        topRightImage={require('../../../assets/BattleModeCpuEgos/todd.png')}
        topRightImageScale={0.77}
        topRightImageOffsetX={0.0}
        topRightImageOffsetY={0.04}
        powerSlots={powerSlotsArray}
        onPowerSlotPress={(id) => handlePowerSlotPress(id as 'slot1' | 'slot2')}
      />

      {roundEndState && (
        <View style={s.overlay}>
          <View style={s.card}>
            <Text style={s.title}>
              {roundEndState.reason === 'playerWin'
                ? '🏆 You Win!'
                : roundEndState.reason === 'cpuWin'
                ? '🤖 CPU Wins'
                : "⏱ Time's Up!"}
            </Text>
            <Text style={s.sub}>Round {roundEndState.roundNumber} complete</Text>
            <View style={s.btnRow}>
              <Pressable
                onPress={onReloadBattle}
                style={({ pressed }) => [s.btn, s.btnSecondary, pressed && s.pressed]}
              >
                <Text style={s.btnTextSecondary}>RELOAD</Text>
              </Pressable>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [s.btn, s.btnPrimary, pressed && s.pressed]}
              >
                <Text style={s.btnTextPrimary}>CONTINUE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#0d0821',
    borderWidth: 1.5,
    borderColor: '#ffd700',
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 8,
    minWidth: 280,
  },
  title: {
    color: '#ffd700',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
  },
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#ffd700',
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  btnTextPrimary: {
    color: '#0d0821',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  btnTextSecondary: {
    color: '#ffd97d',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
