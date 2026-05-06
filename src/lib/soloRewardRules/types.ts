import type { ImageSourcePropType } from 'react-native';
import type { StickerId } from '../../types';
import type {
  AlbumChapterId,
  AlbumPuzzleId,
  AlbumScarcityId,
} from '../../fresh/album/album.types';

export type FreshSoloRewardWinType =
  | 'common'
  | 'commonRoll'
  | 'epic'
  | 'epicRoll'
  | 'legendary'
  | 'legendaryRoll';

export type FreshSoloRewardKind =
  | 'common'
  | 'epic'
  | 'legendary'
  | 'power'
  | 'powerPlus'
  | 'platinum'
  | 'puzzlePiece';

export type FreshSoloReward = {
  kind: FreshSoloRewardKind;
  count: number;
};

export type FreshSoloRewardPreview = {
  kind: FreshSoloRewardKind;
  count: number;
  stickerId: StickerId | null;
  stickerName: string;
  stickerChapterId?: AlbumChapterId;
  stickerScarcityId?: AlbumScarcityId;
  puzzleId?: AlbumPuzzleId;
  puzzlePieceId?: string;
  puzzlePieceNumber?: number;
  puzzlePieceTotal?: number;
  rewardImageSource?: ImageSourcePropType;
};
