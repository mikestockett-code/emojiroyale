// AppShell.tsx
// New clean app entry surface for the rewrite.
//
// Job:
// - Wrap the new app tree with top-level providers if needed.
// - Render the new router.
//
// This file should stay tiny.
// It should not contain game logic.

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRouter from './AppRouter';
import { useFreshProfiles } from '../profile/useFreshProfiles';
import { AudioProvider } from '../audio/AudioContext';

export default function AppShell() {
  const profileState = useFreshProfiles();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <AudioProvider>
      <AppRouter
        profiles={profileState.profiles}
        activeProfileId={profileState.activeProfileId}
        secondaryProfileId={profileState.secondaryProfileId}
        onCreateProfile={profileState.createProfile}
        onSetActiveProfile={profileState.setActiveProfile}
        onSetSecondaryProfile={profileState.setSecondaryProfile}
        onDeleteProfile={profileState.deleteProfile}
        onGrantAlbumSticker={profileState.grantAlbumSticker}
        onGrantAlbumPuzzlePiece={profileState.grantAlbumPuzzlePiece}
        onUpdateSoloHighScore={profileState.updateSoloHighScore}
        onSetFavoriteSticker={profileState.setFavoriteSticker}
        profilesReady={profileState.hasLoadedStorage}
      />
      </AudioProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
