import React from 'react';
import type { ProfileNavigation } from '../types/navigation';
import ProfileScreen from './ProfileScreen';
import type { FreshProfile, FreshProfileColor } from '../profile/types';

type Props = ProfileNavigation & {
  profiles: FreshProfile[];
  activeProfileId: string | null;
  secondaryProfileId: string | null;
  onCreateProfile: (name: string, avatar: string, color: FreshProfileColor) => { ok: true; profileId: string } | { ok: false; error: string };
  onSetActiveProfile: (profileId: string) => void;
  onSetSecondaryProfile: (profileId: string | null) => void;
  onDeleteProfile: (profileId: string) => void;
};

export default function ProfileScreenShell(props: Props) {
  return <ProfileScreen {...props} />;
}
