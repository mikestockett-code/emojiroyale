import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import {
  FRESH_PROFILE_AVATARS,
  FRESH_PROFILE_COLORS,
} from '../../profile/profileOptions';
import type { FreshProfileColor } from '../../profile/types';
import { profileStyles as styles } from './profileStyles';

type Props = {
  draftName: string;
  draftAvatar: string;
  draftColor: FreshProfileColor;
  errorMessage: string | null;
  createDisabled: boolean;
  onChangeName: (value: string) => void;
  onSelectAvatar: (avatar: string) => void;
  onSelectColor: (color: FreshProfileColor) => void;
  onCreate: () => void;
};

export function CreateProfileCard({
  draftName,
  draftAvatar,
  draftColor,
  errorMessage,
  createDisabled,
  onChangeName,
  onSelectAvatar,
  onSelectColor,
  onCreate,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardEyebrow}>CREATE PROFILE</Text>

      {/* Name Input */}
      <TextInput
        value={draftName}
        onChangeText={onChangeName}
        placeholder="Enter profile name"
        placeholderTextColor="#9ca3af"
        maxLength={18}
        style={styles.input}
      />

      {/* Avatar Section */}
      <Text style={styles.sectionLabel}>Avatar</Text>
      <View style={styles.optionGrid}>
        {FRESH_PROFILE_AVATARS.map((avatar) => (
          <Pressable
            key={avatar}
            onPress={() => onSelectAvatar(avatar)}
            style={({ pressed }) => [
              styles.avatarOption,
              draftAvatar === avatar && styles.avatarOptionSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.avatarOptionText}>{avatar}</Text>
          </Pressable>
        ))}
      </View>

      {/* Color Section - Cleaned Up */}
      <Text style={styles.sectionLabel}>Color</Text>
      <View style={styles.colorGrid}>
        {(Object.keys(FRESH_PROFILE_COLORS) as FreshProfileColor[]).map((colorKey) => {
          const color = FRESH_PROFILE_COLORS[colorKey];
          const isSelected = draftColor === colorKey;

          return (
            <Pressable
              key={colorKey}
              onPress={() => onSelectColor(colorKey)}
              style={({ pressed }) => [
                styles.colorOption,
                {
                  backgroundColor: color.bg,
                  borderColor: isSelected ? '#f59e0b' : color.swatch,
                  borderWidth: isSelected ? 3 : 2,
                },
                isSelected && styles.colorOptionSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.colorOptionText, { color: color.swatch }]}>
                {color.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Create Button */}
      <Pressable
        onPress={onCreate}
        disabled={createDisabled}
        style={({ pressed }) => [
          styles.primaryButton,
          createDisabled && styles.primaryButtonDisabled,
          pressed && !createDisabled && styles.pressed,
        ]}>
        <Text style={styles.primaryButtonText}>Create Profile</Text>
      </Pressable>
    </View>
  );
}
