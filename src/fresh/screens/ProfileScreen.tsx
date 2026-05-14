import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { FRESH_PROFILE_AVATARS } from '../profile/profileOptions';
import { BATTLE_TEST_POWERS } from '../../data/battlePowers';
import { TIER_COLORS } from '../shared/luxuryTheme';
import { hasBlockedProfileNameWord } from '../profile/profileNameFilter';
import { ActiveProfileCard } from './profile/ActiveProfileCard';
import { CreateProfileCard } from './profile/CreateProfileCard';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileListCard } from './profile/ProfileListCard';
import { profileStyles as styles } from './profile/profileStyles';
import type { ProfileScreenProps } from './profile/profileScreen.types';
import { Confetti } from '../shared/GameResultOverlay/Confetti';

export default function ProfileScreen({
  onBackToMenu,
  profiles,
  activeProfileId,
  secondaryProfileId,
  onCreateProfile,
  onSetActiveProfile,
  onSetSecondaryProfile,
  onDeleteProfile,
}: ProfileScreenProps) {
  const [draftName, setDraftName] = useState('');
  const [draftAvatar, setDraftAvatar] = useState(FRESH_PROFILE_AVATARS[0]);
  const [draftColor, setDraftColor] = useState<'sunset' | 'ocean' | 'mint' | 'violet' | 'ember' | 'slate'>('sunset');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newProfileName, setNewProfileName] = useState<string | null>(null);
  const [newProfileAvatar, setNewProfileAvatar] = useState<string>('😀');
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0] ?? null,
    [activeProfileId, profiles]
  );
  const secondaryProfile = useMemo(
    () => profiles.find((profile) => profile.id === secondaryProfileId) ?? null,
    [profiles, secondaryProfileId]
  );
  const trimmedDraftName = draftName.trim();
  const blockedDraftName = hasBlockedProfileNameWord(trimmedDraftName);
  const visibleErrorMessage = blockedDraftName
    ? 'Please choose a family-friendly profile name.'
    : errorMessage;

  useEffect(() => {
    return () => {
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
    };
  }, []);

  const handleCreate = () => {
    if (blockedDraftName) {
      setErrorMessage('Please choose a family-friendly profile name.');
      return;
    }

    const result = onCreateProfile(draftName, draftAvatar, draftColor);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    const createdName = draftName.trim();
    const createdAvatar = draftAvatar;
    setDraftName('');
    setDraftAvatar(FRESH_PROFILE_AVATARS[0]);
    setDraftColor('sunset');
    setErrorMessage(null);
    setNewProfileName(createdName);
    setNewProfileAvatar(createdAvatar);
    setShowConfetti(true);
    if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
    confettiTimerRef.current = setTimeout(() => setShowConfetti(false), 3500);
  };

  return (
    <View style={{ flex: 1 }}>
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader />
        <ActiveProfileCard activeProfile={activeProfile} secondaryProfile={secondaryProfile} />
        <CreateProfileCard
          draftName={draftName}
          draftAvatar={draftAvatar}
          draftColor={draftColor}
          errorMessage={visibleErrorMessage}
          createDisabled={trimmedDraftName.length === 0 || blockedDraftName}
          onChangeName={(value) => {
            setDraftName(value);
            if (errorMessage) setErrorMessage(null);
          }}
          onSelectAvatar={setDraftAvatar}
          onSelectColor={setDraftColor}
          onCreate={handleCreate}
        />
        <ProfileListCard
          profiles={profiles}
          activeProfileId={activeProfileId}
          secondaryProfileId={secondaryProfileId}
          onSetActiveProfile={onSetActiveProfile}
          onSetSecondaryProfile={onSetSecondaryProfile}
          onDeleteProfile={onDeleteProfile}
        />
        <Pressable onPress={onBackToMenu} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
    {showConfetti && <Confetti tier="legendary" />}
    <Modal visible={newProfileName !== null} transparent animationType="fade">
      <View style={styles.selectorModalBackdrop}>
        <View style={[styles.selectorModalCard, { maxHeight: '85%' }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarEmoji}>{newProfileAvatar}</Text>
              </View>
              <Text style={styles.activeProfileName}>Welcome, {newProfileName}!</Text>
            </View>
            <Text style={styles.cardEyebrow}>YOUR STARTER PACK</Text>
            <Text style={[styles.sectionLabel, { color: TIER_COLORS.common }]}>⭐  25× Common Stickers</Text>
            <Text style={[styles.sectionLabel, { color: TIER_COLORS.epic }]}>💥  1× Epic Sticker</Text>
            <Text style={[styles.sectionLabel, { color: TIER_COLORS.legendary }]}>👑  1× Legendary Sticker</Text>
            <Text style={[styles.cardEyebrow, { marginTop: 6 }]}>BATTLE POWERS (×1 EACH)</Text>
            {BATTLE_TEST_POWERS.map(p => (
              <Text key={p.id} style={styles.helperText}>{p.icon}  {p.label}</Text>
            ))}
          </ScrollView>
          <Pressable
            onPress={() => setNewProfileName(null)}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, { marginTop: 14 }]}
          >
            <Text style={styles.primaryButtonText}>LET'S GO! 🎉</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </View>
  );
}
