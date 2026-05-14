import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FRESH_PROFILE_COLORS } from '../profile/profileOptions';
import type { FreshProfileColor } from '../profile/types';
import { useAudioContext } from '../audio/AudioContext';
import { theme } from './luxuryTheme';

type Props = {
  name?: string;
  avatar?: string | null;
  color?: FreshProfileColor | null;
  roleLabel?: string | null;
  badgeText?: string | null;
  compact?: boolean;
  onPress?: () => void;
};

export function ProfileHud({
  name = 'Profile',
  avatar = '🙂',
  color = 'sunset',
  roleLabel = null,
  badgeText = null,
  compact = false,
  onPress,
}: Props) {
  const { playSound } = useAudioContext();
  const palette = FRESH_PROFILE_COLORS[color ?? 'sunset'];

  return (
    <Pressable
      onPress={() => {
        if (!onPress) return;
        playSound('button');
        onPress();
      }}
      style={({ pressed }) => [styles.root, compact && styles.rootCompact, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.avatarRing,
          compact && styles.avatarRingCompact,
          {
            backgroundColor: palette.bg,
            borderColor: palette.swatch,
            shadowColor: palette.swatch,
          },
        ]}
      >
        <View style={[styles.avatarFace, compact && styles.avatarFaceCompact]}>
          <Text style={[styles.avatarEmoji, compact && styles.avatarEmojiCompact]}>{avatar ?? '🙂'}</Text>
        </View>
        {badgeText ? (
          <View style={[styles.badge, compact && styles.badgeCompact, { backgroundColor: palette.swatch }]}>
            <Text style={[styles.badgeText, compact && styles.badgeTextCompact]}>{badgeText}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.copy}>
        {roleLabel ? <Text style={[styles.roleLabel, compact && styles.roleLabelCompact]}>{roleLabel}</Text> : null}
        <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root:        { minWidth: 74, maxWidth: 110, alignItems: 'center', justifyContent: 'center', gap: 4 },
  rootCompact: { minWidth: 68, maxWidth: 92 },
  avatarRing:        { width: 58, height: 58, borderRadius: 29, borderWidth: 2, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.7, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  avatarRingCompact: { width: 30, height: 30, borderRadius: 15, shadowRadius: 6, elevation: 4 },
  avatarFace:        { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(24,16,8,0.86)', alignItems: 'center', justifyContent: 'center' },
  avatarFaceCompact: { width: 22, height: 22, borderRadius: 11 },
  avatarEmoji:       { fontSize: 24 },
  avatarEmojiCompact:{ fontSize: 16, lineHeight: 18 },
  badge:        { position: 'absolute', top: -4, right: -4, minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 5, backgroundColor: '#ef4444', borderWidth: 2, borderColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' },
  badgeCompact: { minWidth: 18, height: 18, borderRadius: 9, top: -3, right: -3, paddingHorizontal: 4 },
  badgeText:        { color: '#fff', fontSize: 11, fontWeight: '900' },
  badgeTextCompact: { fontSize: 9 },
  copy:              { alignItems: 'center', gap: 1 },
  roleLabel:         { color: theme.gold, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  roleLabelCompact:  { fontSize: 8 },
  name:              { color: theme.gold, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  nameCompact:       { fontSize: 9 },
  pressed:           { ...theme.pressed },
});
