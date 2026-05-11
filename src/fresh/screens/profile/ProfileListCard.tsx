import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FRESH_PROFILE_COLORS } from '../../profile/useFreshProfiles';
import type { FreshProfile } from '../../profile/types';
import { profileStyles as styles } from './profileStyles';

type Props = {
  profiles: FreshProfile[];
  activeProfileId: string | null;
  secondaryProfileId: string | null;
  onSetActiveProfile: (profileId: string) => void;
  onSetSecondaryProfile: (profileId: string | null) => void;
  onDeleteProfile: (profileId: string) => void;
};

export function ProfileListCard({
  profiles,
  activeProfileId,
  secondaryProfileId,
  onSetActiveProfile,
  onSetSecondaryProfile,
  onDeleteProfile,
}: Props) {
  if (profiles.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>MANAGE PROFILES</Text>
        <Text style={styles.emptyText}>No profiles yet - create one above.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardEyebrow}>MANAGE PROFILES</Text>
      <View style={styles.profileList}>
        {profiles.map((profile) => {
          const isActive    = profile.id === activeProfileId;
          const isSecondary = profile.id === secondaryProfileId;
          const colors      = FRESH_PROFILE_COLORS[profile.color];

          return (
            <View key={profile.id} style={styles.profileRow}>
              {/* Avatar */}
              <View style={[styles.avatarBadgeSmall, { backgroundColor: colors.bg, borderColor: colors.swatch }]}>
                <Text style={styles.avatarOptionText}>{profile.avatar}</Text>
              </View>

              {/* Name + badges */}
              <View style={styles.profileRowCopy}>
                <Text style={styles.profileRowName}>{profile.name}</Text>
                <View style={ss.badgeRow}>
                  {isActive    && <Text style={ss.badgeActive}>ACTIVE</Text>}
                  {isSecondary && <Text style={ss.badgeSecondary}>P2</Text>}
                </View>
              </View>

              {/* Actions */}
              <View style={ss.actionRow}>
                <Pressable
                  onPress={() => onSetActiveProfile(profile.id)}
                  style={({ pressed }) => [styles.smallButton, isActive && styles.smallButtonActive, pressed && styles.pressed]}
                >
                  <Text style={[styles.smallButtonText, isActive && styles.smallButtonTextActive]}>
                    Active
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => onSetSecondaryProfile(isSecondary ? null : profile.id)}
                  style={({ pressed }) => [styles.smallButton, isSecondary && styles.smallButtonSecondary, pressed && styles.pressed]}
                >
                  <Text style={[styles.smallButtonText, isSecondary && ss.whiteText]}>P2</Text>
                </Pressable>

                <Pressable
                  onPress={() => onDeleteProfile(profile.id)}
                  style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
                >
                  <Text style={styles.deleteButtonText}>x</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 2,
  },
  badgeActive: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#92400e',
    backgroundColor: '#fde68a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgeSecondary: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#fff',
    backgroundColor: '#2563eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  whiteText: {
    color: '#fff',
  },
});
