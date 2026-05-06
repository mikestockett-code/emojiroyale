import type { ImageSourcePropType } from 'react-native';
import type { StickerId } from '../../types';

export type AlbumEraId = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type AlbumBookId =
  | 'favorite'
  | AlbumEraId
  | 'doodle'
  | 'easterEggs';

export type AlbumChapterId = 'common' | 'epic' | 'legendary';

export type AlbumBookSectionId = AlbumChapterId | 'puzzle';

export type AlbumScarcityId = 'common' | 'rare' | 'extremelyRare';

export type AlbumPageKind = 'standardSlot' | 'specialPage';

export type AlbumBookConfig = {
  id: AlbumBookId;
  title: string;
  cover: ImageSourcePropType;
  spine: ImageSourcePropType;
  openBook: ImageSourcePropType;
  pageLeft?: ImageSourcePropType;
  pageRight?: ImageSourcePropType;
  kind: 'special' | 'era';
  visibleAtStart: boolean;
};

export type AlbumStickerSlot = {
  stickerId: string;
  emoji: string;
  name: string;
  scarcityId: AlbumScarcityId;
  collected: boolean;
};

export type AlbumPageSpread = {
  id: string;
  sectionId?: AlbumBookSectionId;
  chapterId?: AlbumChapterId;
  chapterTitle?: string;
  leftSlots: AlbumStickerSlot[];
  rightSlots: AlbumStickerSlot[];
  leftPuzzleId?: AlbumPuzzleId;
  rightPuzzleId?: AlbumPuzzleId;
};

export type AlbumChapterConfig = {
  id: AlbumBookSectionId;
  title: string;
  shortTitle: string;
};

export type AlbumProgressionState = {
  activeEraId: AlbumEraId;
  // Additive unlocks: completed eras stay completed, and new eras add more stickers.
  unlockedEraIds: AlbumEraId[];
  completedEraIds: AlbumEraId[];
};

export type AlbumScarcityRequirement = {
  totalUniqueStickers: number;
  pageKind: AlbumPageKind;
};

export type AlbumChapterRequirement = {
  scarcity: Record<AlbumScarcityId, AlbumScarcityRequirement>;
};

export type AlbumEraSpec = {
  id: AlbumEraId;
  title: string;
  chapters: Record<AlbumChapterId, AlbumChapterRequirement>;
};

export type AlbumChapterCollectedCounts = Partial<Record<AlbumChapterId, number>>;

export type AlbumChapterProgressSummary = {
  chapterId: AlbumChapterId;
  uniqueCollected: number;
  totalUniqueStickers: number;
  percentComplete: number;
  isComplete: boolean;
};

export type AlbumEraProgressSummary = {
  eraId: AlbumEraId;
  uniqueCollected: number;
  totalUniqueStickers: number;
  percentComplete: number;
  isComplete: boolean;
  chapters: AlbumChapterProgressSummary[];
};

export type AlbumStickerCustomization = {
  isFavorite?: boolean;
  displayName?: string;
  backstory?: string;
};

export type AlbumPuzzleId = 'hiddenSon' | 'goldenPhoenix' | 'fireDragon';

export type AlbumPuzzlePieceDefinition = {
  id: string;
  pieceNumber: number;
  imageSource: ImageSourcePropType;
};

export type AlbumPuzzleDefinition = {
  id: AlbumPuzzleId;
  eraId: AlbumEraId;
  title: string;
  shortTitle: string;
  pieceCount: number;
  completedPageSource: ImageSourcePropType;
  downloadableEmojiSource: ImageSourcePropType;
  pieces: AlbumPuzzlePieceDefinition[];
};

export type AlbumPuzzlePieceCounts = Partial<Record<AlbumPuzzleId, Record<string, number>>>;

export type AlbumStickerDefinition = {
  id: StickerId;
  name: string;
  eraId: AlbumEraId;
  chapterId: AlbumChapterId;
  scarcityId: AlbumScarcityId;
  pageKind: AlbumPageKind;
  playable: boolean;
  emoji?: string;
  imageSource?: ImageSourcePropType;
};
