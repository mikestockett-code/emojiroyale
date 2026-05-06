import React from 'react';
import { Text, View } from 'react-native';
import { FRESH_PROFILE_COLORS } from '../../profile/useFreshProfiles';
import type { FreshProfile } from '../../profile/types';
import { profileCardStyles } from './profileCardStyles';
import { profileFormStyles } from './profileFormStyles';

type Props = {
  activeProfile: FreshProfile | null;
  secondaryProfile: FreshProfile | null;
};

export function ActiveProfileCard({ activeProfile, secondaryProfile }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardEyebrow}>ACTIVE PROFILE</Text>
      {activeProfile ? (
        <View style={styles.activeProfileRow}>
          <View
            style={[
              styles.avatarBadge,
              {
                backgroundColor: FRESH_PROFILE_COLORS[activeProfile.color].bg,
                borderColor: FRESH_PROFILE_COLORS[activeProfile.color].swatch,
              },
            ]}
          >
            <Text style={styles.avatarEmoji}>{activeProfile.avatar}</Text>
          </View>
          <View style={styles.activeProfileCopy}>
            <Text style={styles.activeProfileName}>{activeProfile.name}</Text>
            <Text style={styles.activeProfileMeta}>{FRESH_PROFILE_COLORS[activeProfile.color].label}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.emptyText}>No active profile yet.</Text>
      )}
      <View style={styles.secondaryProfileWrap}>
        <Text style={styles.secondaryEyebrow}>SECONDARY PROFILE</Text>
        {secondaryProfile ? (
          <View style={styles.secondaryProfileRow}>
            <View
              style={[
                styles.avatarBadgeSmall,
                {
                  backgroundColor: FRESH_PROFILE_COLORS[secondaryProfile.color].bg,
                  borderColor: FRESH_PROFILE_COLORS[secondaryProfile.color].swatch,
                },
              ]}
            >
              <Text style={styles.avatarOptionText}>{secondaryProfile.avatar}</Text>
            </View>
            <View style={styles.profileRowCopy}>
              <Text style={styles.profileRowName}>{secondaryProfile.name}</Text>
              <Text style={styles.profileRowMeta}>{FRESH_PROFILE_COLORS[secondaryProfile.color].label}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>Set a secondary profile for fast Pass & Play setup.</Text>
        )}
      </View>
    </View>
  );
}

const styles = {
  ...profileCardStyles,
  ...profileFormStyles,
};
