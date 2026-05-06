import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { FreshProfileColor } from '../profile/types';
import { ProfileHud } from './ProfileHud';
import { useAudioContext } from '../audio/AudioContext';

type SharedBottomNavProps = {
  profileName?: string;
  profileAvatar?: string | null;
  profileColor?: FreshProfileColor | null;
  profileRoleLabel?: string;
  profileBadgeText?: string | null;
  scoreLabel?: string;
  scoreValue?: string | number;
  secondProfileName?: string;
  secondProfileAvatar?: string | null;
  secondProfileColor?: FreshProfileColor | null;
  secondProfileRoleLabel?: string;
  secondProfileBadgeText?: string | null;
  onSoundPress?: () => void;
  onProfilePress?: () => void;
  onSecondProfilePress?: () => void;
  onBackPress?: () => void;
  onHowToPress?: () => void;
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
};

export function SharedBottomNav({
  profileName = 'Profile',
  profileAvatar = '🙂',
  profileColor = 'sunset',
  profileRoleLabel,
  profileBadgeText,
  scoreLabel = 'Score',
  scoreValue = 0,
  secondProfileName,
  secondProfileAvatar,
  secondProfileColor,
  secondProfileRoleLabel,
  secondProfileBadgeText,
  onSoundPress,
  onProfilePress,
  onSecondProfilePress,
  onBackPress,
  onHowToPress,
  bottomInset = 0,
  style,
}: SharedBottomNavProps) {
  const { playSound } = useAudioContext();
  const hasSecondProfile = !!secondProfileName;

  return (
    <View style={[styles.bottomNav, { paddingBottom: bottomInset, minHeight: 44 }, style]}>
      <View style={styles.bottomNavBtn}>
        <ProfileHud
          name={profileName}
          avatar={profileAvatar}
          color={profileColor}
          compact
          roleLabel={profileRoleLabel}
          badgeText={profileBadgeText}
          onPress={onProfilePress}
        />
      </View>

      <View style={styles.bottomNavBtn}>
        {hasSecondProfile ? (
          <ProfileHud
            name={secondProfileName!}
            avatar={secondProfileAvatar ?? '🙂'}
            color={secondProfileColor ?? 'ocean'}
            compact
            roleLabel={secondProfileRoleLabel}
            badgeText={secondProfileBadgeText}
            onPress={onSecondProfilePress}
          />
        ) : onSoundPress ? (
          <Pressable
            onPress={() => {
              playSound('button');
              onSoundPress();
            }}
            style={({ pressed }) => [styles.bottomNavBtn, pressed && styles.pressed]}
          >
            <MaterialIcons name="volume-up" size={20} color="#ffd97d" />
            <Text style={styles.bottomNavLabel}>SOUND</Text>
          </Pressable>
        ) : (
          <>
            <MaterialIcons name="emoji-events" size={20} color="#ffd97d" />
            <Text style={styles.bottomNavLabel}>{scoreLabel}</Text>
            <Text style={styles.bottomNavValue}>{typeof scoreValue === 'number' ? scoreValue.toLocaleString() : scoreValue}</Text>
          </>
        )}
      </View>

      <Pressable
        onPress={() => {
          if (!onBackPress) return;
          playSound('button');
          onBackPress();
        }}
        style={({ pressed }) => [styles.bottomNavBtn, pressed && styles.pressed]}
      >
        <MaterialIcons name="arrow-back" size={20} color="#ffd97d" />
        <Text style={styles.bottomNavLabel}>BACK</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          if (!onHowToPress) return;
          playSound('button');
          onHowToPress();
        }}
        style={({ pressed }) => [styles.bottomNavBtn, pressed && styles.pressed]}
      >
        <MaterialIcons name="apps" size={20} color="#ffd97d" />
        <Text style={styles.bottomNavLabel}>How to Play</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(5,3,15,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 8,
  },
  bottomNavBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    minHeight: 44,
  },
  bottomNavLabel: {
    fontSize: 10,
    color: '#ffd97d',
    fontWeight: '800',
  },
  bottomNavValue: {
    fontSize: 12,
    color: '#fff5de',
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
  },
});
