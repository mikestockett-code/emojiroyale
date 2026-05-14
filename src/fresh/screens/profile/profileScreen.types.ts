import type { ProfileNavigation } from '../../types/navigation';
import type { FreshProfile, FreshProfileColor } from '../../profile/types';

export type ProfileScreenProps = ProfileNavigation & {
  profiles: FreshProfile[];
  activeProfileId: string | null;
  secondaryProfileId: string | null;
  onCreateProfile: (
    name: string,
    avatar: string,
    color: FreshProfileColor
  ) => { ok: true; profileId: string } | { ok: false; error: string };
  onSetActiveProfile: (profileId: string) => void;
  onSetSecondaryProfile: (profileId: string | null) => void;
  onDeleteProfile: (profileId: string) => void;
};

export type ProfileDraftState = {
  name: string;
  avatar: string;
  color: FreshProfileColor;
  errorMessage: string | null;
};
