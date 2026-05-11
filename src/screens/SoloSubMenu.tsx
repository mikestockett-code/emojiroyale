import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { SoloModeCardDeck } from '../components/game/SoloModeCardDeck';
import { SharedBottomNav } from '../fresh/shared/SharedBottomNav';
import { SharedSubmenuShell } from '../fresh/shared/SharedSubmenuShell';
import type { SoloModeId } from '../types';
import type { FreshProfileColor } from '../fresh/profile/types';

const BG = require('../../assets/backgrounds/backgroundgamearea.png');

type Props = {
  onBack: () => void;
  onStart?: () => void;
  onOpenProfiles?: () => void;
  profileAvatar?: string | null;
  profileName?: string;
  profileColor?: FreshProfileColor | null;
  soloMode?: SoloModeId;
  onChangeSoloMode?: (mode: SoloModeId) => void;
  selectableModeIds?: SoloModeId[];
  startDisabled?: boolean;
  startMessage?: string | null;
};

export default function SoloSubMenu({
  onBack,
  onStart,
  onOpenProfiles,
  profileAvatar = '🙂',
  profileName = 'Profile',
  profileColor = 'sunset',
  soloMode: controlledSoloMode,
  onChangeSoloMode,
  selectableModeIds = ['practice', 'epicLite', 'epic'],
  startDisabled = false,
  startMessage = null,
}: Props) {
  const [localSoloMode, setLocalSoloMode] = useState<SoloModeId>('practice');
  const soloMode = controlledSoloMode ?? localSoloMode;

  const handleSelectMode = (mode: string) => {
    const nextMode = mode as SoloModeId;
    onChangeSoloMode?.(nextMode);
    if (!controlledSoloMode) {
      setLocalSoloMode(nextMode);
    }
  };

  return (
    <SharedSubmenuShell
      backgroundSource={BG}
      rootStyle={ss.root}
      bottomNav={(
        <SharedBottomNav
          profileName={profileName}
          profileAvatar={profileAvatar}
          profileColor={profileColor}
          scoreLabel="Score"
          scoreValue={0}
          onProfilePress={onOpenProfiles}
          onBackPress={onBack}
          onHowToPress={() => {}}
        />
      )}
    >

      {/* Card carousel — NOT inside a ScrollView so swipe works freely */}
      <View style={ss.deckArea}>
        <SoloModeCardDeck
          selectedId={soloMode}
          onSelect={handleSelectMode}
          playSound={() => {}}
          selectableIds={selectableModeIds}
        />
      </View>

      {/* Start button */}
      <Pressable
        onPress={onStart}
        style={({ pressed }) => [ss.startBtn, startDisabled && ss.startButtonDisabled, pressed && { opacity: 0.75 }]}
      >
        <Image
          source={require('../../assets/buttons/start.png')}
          style={ss.startImg}
          resizeMode="contain"
        />
      </Pressable>
      {startMessage ? (
        <View style={ss.startMessageWrap}>
          <Text style={[ss.startMessage, startDisabled && ss.startMessageDisabled]}>
            {startMessage}
          </Text>
        </View>
      ) : null}

    </SharedSubmenuShell>
  );
}

const ss = StyleSheet.create({
  root:    { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  deckArea:{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  startMessageWrap: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  startBtn: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  startImg: {
    width: 210,
    height: 210 * (437 / 1306),
    transform: [{ perspective: 400 }, { rotateX: '25deg' }],
  },
  startButtonDisabled: {
    opacity: 0.48,
  },
  startMessage: {
    maxWidth: 320,
    textAlign: 'center',
    color: '#ffd700',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  startMessageDisabled: {
    color: '#ffd700',
  },
});
