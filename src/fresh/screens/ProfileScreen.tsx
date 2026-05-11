import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text } from 'react-native';
import { FRESH_PROFILE_AVATARS } from '../profile/useFreshProfiles';
import { hasBlockedProfileNameWord } from '../profile/profileNameFilter';
import { ActiveProfileCard } from './profile/ActiveProfileCard';
import { CreateProfileCard } from './profile/CreateProfileCard';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileListCard } from './profile/ProfileListCard';
import { profileStyles as styles } from './profile/profileStyles';
import type { ProfileScreenProps } from './profile/profileScreen.types';

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

    setDraftName('');
    setDraftAvatar(FRESH_PROFILE_AVATARS[0]);
    setDraftColor('sunset');
    setErrorMessage(null);
  };

  return (
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
  );
}
