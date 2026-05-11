import { useCallback, useEffect, useMemo, useState } from 'react';
import type { StickerId } from '../../types';
import type { AlbumPuzzleId } from '../album/album.types';
import type { FreshProfile, FreshProfileColor } from './types';
import { createFreshProfileId, hasBlockedProfileNameWord } from './profileNameFilter';
import { storageGetItem, storageSetItem } from '../../lib/storage';

export const FRESH_PROFILE_AVATARS = ['😀', '😎', '🥳', '🔥', '👑', '🌈', '🐶', '⭐', '⚡', '🦄'];

export const FRESH_PROFILE_COLORS: Record<FreshProfileColor, { label: string; swatch: string; bg: string }> = {
  sunset: { label: 'Sunset', swatch: '#f97316', bg: '#ffedd5' },
  ocean: { label: 'Ocean', swatch: '#2563eb', bg: '#dbeafe' },
  mint: { label: 'Mint', swatch: '#059669', bg: '#d1fae5' },
  violet: { label: 'Violet', swatch: '#7c3aed', bg: '#ede9fe' },
  ember: { label: 'Ember', swatch: '#dc2626', bg: '#fee2e2' },
  slate: { label: 'Slate', swatch: '#334155', bg: '#e2e8f0' },
};

const FRESH_PROFILES_STORAGE_KEY = 'fresh.profiles.v1';
const FRESH_ACTIVE_PROFILE_ID_STORAGE_KEY = 'fresh.activeProfileId.v1';
const FRESH_SECONDARY_PROFILE_ID_STORAGE_KEY = 'fresh.secondaryProfileId.v1';

const DEFAULT_PROFILES: FreshProfile[] = [
  {
    id: 'starter-profile',
    name: 'Player One',
    avatar: '😀',
    color: 'sunset',
    createdAt: Date.now(),
  },
];

export function useFreshProfiles() {
  const [profiles, setProfiles] = useState<FreshProfile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('starter-profile');
  const [secondaryProfileId, setSecondaryProfileId] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const activeProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0] ?? null,
    [activeProfileId, profiles]
  );
  const secondaryProfile = useMemo(
    () => profiles.find((profile) => profile.id === secondaryProfileId) ?? null,
    [profiles, secondaryProfileId]
  );

  useEffect(() => {
    let isMounted = true;

    const loadProfiles = async () => {
      try {
        const [storedProfilesRaw, storedActiveProfileId, storedSecondaryProfileId] = await Promise.all([
          storageGetItem(FRESH_PROFILES_STORAGE_KEY),
          storageGetItem(FRESH_ACTIVE_PROFILE_ID_STORAGE_KEY),
          storageGetItem(FRESH_SECONDARY_PROFILE_ID_STORAGE_KEY),
        ]);

        if (!isMounted) return;

        const parsedProfiles = storedProfilesRaw ? (JSON.parse(storedProfilesRaw) as FreshProfile[]) : null;
        const safeProfiles = parsedProfiles && parsedProfiles.length > 0 ? parsedProfiles : DEFAULT_PROFILES;
        const safeActiveProfileId =
          storedActiveProfileId && safeProfiles.some((profile) => profile.id === storedActiveProfileId)
            ? storedActiveProfileId
            : safeProfiles[0].id;
        const safeSecondaryProfileId =
          storedSecondaryProfileId &&
          safeProfiles.some((profile) => profile.id === storedSecondaryProfileId) &&
          storedSecondaryProfileId !== safeActiveProfileId
            ? storedSecondaryProfileId
            : null;

        setProfiles(safeProfiles);
        setActiveProfileId(safeActiveProfileId);
        setSecondaryProfileId(safeSecondaryProfileId);
      } catch (error) {
        console.log('Failed to load fresh profiles, using defaults.', error);
      } finally {
        if (isMounted) {
          setHasLoadedStorage(true);
        }
      }
    };

    void loadProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    void storageSetItem(FRESH_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  }, [hasLoadedStorage, profiles]);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    void storageSetItem(FRESH_ACTIVE_PROFILE_ID_STORAGE_KEY, activeProfileId);
  }, [activeProfileId, hasLoadedStorage]);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    void storageSetItem(FRESH_SECONDARY_PROFILE_ID_STORAGE_KEY, secondaryProfileId ?? '');
  }, [hasLoadedStorage, secondaryProfileId]);

  const createProfile = (name: string, avatar: string, color: FreshProfileColor) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { ok: false as const, error: 'Please enter a profile name.' };
    }
    if (hasBlockedProfileNameWord(trimmedName)) {
      return { ok: false as const, error: 'Please choose a family-friendly profile name.' };
    }
    const duplicateName = profiles.some(
      (profile) => profile.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicateName) {
      return { ok: false as const, error: 'That profile name already exists.' };
    }

    const nextProfile: FreshProfile = {
      id: createFreshProfileId(trimmedName),
      name: trimmedName,
      avatar,
      color,
      createdAt: Date.now(),
    };

    setProfiles((current) => [...current, nextProfile]);
    setActiveProfileId(nextProfile.id);
    return { ok: true as const };
  };

  const deleteProfile = (profileId: string) => {
    setProfiles((current) => {
      const nextProfiles = current.filter((profile) => profile.id !== profileId);
      if (nextProfiles.length === 0) return current;
      if (activeProfileId === profileId) {
        setActiveProfileId(nextProfiles[0].id);
      }
      if (secondaryProfileId === profileId) {
        setSecondaryProfileId(null);
      }
      return nextProfiles;
    });
  };

  const setActiveProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    if (secondaryProfileId === profileId) {
      setSecondaryProfileId(null);
    }
  };

  const setSecondaryProfile = (profileId: string | null) => {
    if (!profileId || profileId === activeProfileId) {
      setSecondaryProfileId(null);
      return;
    }
    setSecondaryProfileId(profileId);
  };

  const updateSoloHighScore = useCallback((profileId: string | null | undefined, score: number) => {
    if (!profileId) return;
    setProfiles((current) => {
      let didUpdate = false;
      const nextProfiles = current.map((profile) => {
        if (profile.id !== profileId) return profile;
        if (score <= (profile.soloHighScore ?? 0)) return profile;
        didUpdate = true;
        return { ...profile, soloHighScore: score };
      });
      return didUpdate ? nextProfiles : current;
    });
  }, []);

  const setFavoriteSticker = useCallback((profileId: string | null | undefined, stickerId: string | null) => {
    if (!profileId) return;
    setProfiles((current) =>
      current.map((profile) => {
        if (profile.id !== profileId) return profile;
        return { ...profile, favoriteStickerId: stickerId ?? undefined };
      }),
    );
  }, []);

  const grantAlbumSticker = useCallback((profileId: string | null | undefined, stickerId: StickerId, count = 1) => {
    if (!profileId || count <= 0) return;

    setProfiles((current) =>
      current.map((profile) => {
        if (profile.id !== profileId) return profile;

        const albumCounts = profile.albumCounts ?? {};
        return {
          ...profile,
          albumCounts: {
            ...albumCounts,
            [stickerId]: (albumCounts[stickerId] ?? 0) + count,
          },
        };
      }),
    );
  }, []);

  const grantAlbumPuzzlePiece = useCallback((
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count = 1,
  ) => {
    if (!profileId || count <= 0) return;

    setProfiles((current) =>
      current.map((profile) => {
        if (profile.id !== profileId) return profile;

        const albumPuzzlePieces = profile.albumPuzzlePieces ?? {};
        const puzzlePieces = albumPuzzlePieces[puzzleId] ?? {};
        return {
          ...profile,
          albumPuzzlePieces: {
            ...albumPuzzlePieces,
            [puzzleId]: {
              ...puzzlePieces,
              [pieceId]: (puzzlePieces[pieceId] ?? 0) + count,
            },
          },
        };
      }),
    );
  }, []);

  return {
    profiles,
    activeProfile,
    secondaryProfile,
    activeProfileId,
    secondaryProfileId,
    hasLoadedStorage,
    createProfile,
    deleteProfile,
    setActiveProfile,
    setSecondaryProfile,
    grantAlbumSticker,
    grantAlbumPuzzlePiece,
    updateSoloHighScore,
    setFavoriteSticker,
  };
}
