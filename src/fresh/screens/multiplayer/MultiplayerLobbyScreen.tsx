import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModePowerSetupScreen } from '../../shared/setup/ModePowerSetupScreen';
import { SharedBottomNav } from '../../shared/SharedBottomNav';
import { SharedSubmenuShell } from '../../shared/SharedSubmenuShell';
import type { BattlePowerSlotLoadout } from '../../../types';
import type { FreshProfile } from '../../profile/types';
import type { MultiplayerRoomController } from '../../../multiplayer/useMultiplayerRoom';
import { normalizeRoomCode } from '../../../multiplayer/roomService';
import { createInitialOnlineGameState } from '../../../multiplayer/onlineGameHelpers';
import { onlineTheme } from '../../multiplayer/onlineTheme';
import { styles } from './MultiplayerLobbyScreen.styles';
import BG from '../../../../assets/backgrounds/backgroundgamearea.png';

type LobbyStep = 'choose' | 'hostCode' | 'powers' | 'waiting';

type Props = {
  mpRoom: MultiplayerRoomController;
  activeProfile: FreshProfile | null;
  onBackToMenu: () => void;
  onStartOnlineGame: () => void;
};

const EMPTY_LOADOUT: BattlePowerSlotLoadout = { slot1: null, slot2: null };

export default function MultiplayerLobbyScreen({ mpRoom, activeProfile, onBackToMenu, onStartOnlineGame }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<LobbyStep>('choose');
  const [loadout, setLoadout] = useState<BattlePowerSlotLoadout>(EMPTY_LOADOUT);
  const [joinCode, setJoinCode] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const profileName = activeProfile?.name?.trim() || 'Player';
  const normalizedJoinCode = normalizeRoomCode(joinCode);
  const leaveToMenu = () => {
    mpRoom.leaveRoom().finally(onBackToMenu);
  };

  useEffect(() => {
    if (mpRoom.roomData?.phase === 'playing') {
      onStartOnlineGame();
    }
  }, [mpRoom.roomData?.phase, onStartOnlineGame]);

  if (step === 'powers') {
    return (
      <ModePowerSetupScreen
        playerLabel={`${mpRoom.role === 'host' ? 'HOST' : 'GUEST'}  •  PICK 2`}
        actionLabel="READY →"
        p1Profile={activeProfile ?? null}
        initialSlots={loadout}
        playConfirmSound={false}
        onConfirm={async (slots) => {
          setLoadout(slots);
          setIsBusy(true);
          setErrorText(null);
          try {
            await mpRoom.setMyPowers(slots);
          } catch (error) {
            console.warn('Set multiplayer powers failed', error);
            setErrorText('Could not save powers. Check connection and try again.');
            setIsBusy(false);
            return;
          }
          setIsBusy(false);
          setStep('waiting');
        }}
        onBack={() => {
          mpRoom.leaveRoom().finally(() => {
            setStep('choose');
          });
        }}
      />
    );
  }

  const handleCreate = async () => {
    setIsBusy(true);
    setErrorText(null);
    try {
      await mpRoom.createRoom(profileName, 'none', false);
      setStep('hostCode');
    } catch (error) {
      console.warn('Create multiplayer room failed', error);
      setErrorText('Could not create a room. Check Firebase setup and connection.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleJoin = async () => {
    setIsBusy(true);
    setErrorText(null);
    try {
      const result = await mpRoom.joinRoom(normalizedJoinCode, profileName);
      if (result !== 'ok') {
        setErrorText(
          result === 'full'
            ? 'That room is already full.'
            : `Room ${normalizedJoinCode || '------'} was not found or expired.`,
        );
        return;
      }
      setStep('powers');
    } catch (error) {
      console.warn('Join multiplayer room failed', error);
      setErrorText('Could not join the room. Check the code and connection.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleStart = async () => {
    if (!mpRoom.roomData?.guestUid) {
      Alert.alert('Waiting for Guest', 'Have the second device join with this code first.');
      return;
    }
    if (!mpRoom.roomData.hostPowers || !mpRoom.roomData.guestPowers) {
      Alert.alert('Waiting for Powers', 'Both players need to pick powers before starting.');
      return;
    }
    await mpRoom.writeGameState(createInitialOnlineGameState({
      hostPowers: mpRoom.roomData.hostPowers,
      guestPowers: mpRoom.roomData.guestPowers,
      hostName: mpRoom.roomData.hostName,
      guestName: mpRoom.roomData.guestName ?? 'Guest',
    }));
    await mpRoom.advancePhase('playing');
  };

  const handleShareCode = async () => {
    const code = mpRoom.roomCode;
    if (!code) return;
    try {
      await Share.share({
        title: 'Emoji Royale Room Code',
        message: `Join my Emoji Royale online battle. Room code: ${code}`,
      });
    } catch (error) {
      console.warn('Share multiplayer room code failed', error);
    }
  };

  const renderActionButton = (label: string, onPress: () => void, disabled = false) => (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
    </Pressable>
  );

  return (
    <SharedSubmenuShell
      backgroundSource={BG}
      rootStyle={styles.root}
      bottomNav={(
        <SharedBottomNav
          profileName={activeProfile?.name ?? 'Profile'}
          profileAvatar={activeProfile?.avatar ?? '🙂'}
          profileColor={activeProfile?.color ?? 'sunset'}
          profileRoleLabel={mpRoom.role === 'guest' ? 'GUEST' : 'HOST'}
          onBackPress={leaveToMenu}
          onProfilePress={() => {}}
          onHowToPress={() => {}}
          bottomInset={insets.bottom}
        />
      )}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 54, paddingBottom: insets.bottom + 92 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Online Battle</Text>
        <Text style={styles.subtitle}>Create a room, share the code, then lock in powers.</Text>

        <View style={styles.panel}>
          {step === 'choose' ? (
            <>
              <Text style={styles.sectionTitle}>Create or Join</Text>
              <Text style={styles.bodyText}>Using profile: {profileName}</Text>
              {renderActionButton(isBusy ? 'WORKING...' : 'CREATE ROOM', handleCreate, isBusy)}
              <TextInput
                value={joinCode}
                onChangeText={(value) => setJoinCode(normalizeRoomCode(value))}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={6}
                placeholder="ROOM CODE"
                placeholderTextColor={onlineTheme.mutedText}
                style={styles.input}
              />
              {renderActionButton('JOIN ROOM', handleJoin, isBusy || normalizedJoinCode.length < 6)}
            </>
          ) : step === 'hostCode' ? (
            <>
              <Text style={styles.sectionTitle}>Room Code</Text>
              <Text style={styles.codeText}>{mpRoom.roomCode ?? '------'}</Text>
              <Text style={styles.bodyText}>Give this code to the second device, then pick your powers.</Text>
              {renderActionButton('SHARE CODE', handleShareCode, isBusy || !mpRoom.roomCode)}
              {renderActionButton('PICK POWERS', () => setStep('powers'), isBusy || !mpRoom.roomCode)}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>{mpRoom.role === 'host' ? 'Ready Room' : 'Joined Room'}</Text>
              {mpRoom.role === 'host' ? <Text style={styles.codeText}>{mpRoom.roomCode ?? '------'}</Text> : null}
              <Text style={styles.bodyText}>
                {mpRoom.role === 'host'
                  ? mpRoom.roomData?.guestUid
                    ? mpRoom.roomData.guestPowers
                      ? `${mpRoom.roomData.guestName ?? 'Guest'} is ready. Start when ready.`
                      : `${mpRoom.roomData.guestName ?? 'Guest'} joined. Waiting for powers.`
                    : 'Tell the second device this code.'
                  : 'Waiting for the host to start.'}
              </Text>
              {mpRoom.role === 'host' ? (
                renderActionButton('START ONLINE GAME', handleStart)
              ) : (
                <ActivityIndicator color={onlineTheme.gold} />
              )}
            </>
          )}

          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
      </ScrollView>
    </SharedSubmenuShell>
  );
}
