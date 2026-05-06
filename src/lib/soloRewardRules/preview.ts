import type { SoloWagerTier } from '../../types';
import { getTotalBronzePuzzlePiecesCollected, pickMissingBronzePuzzlePiece } from '../../fresh/album/albumPuzzleProgress';
import type { AlbumPuzzlePieceCounts } from '../../fresh/album/album.types';
import {
  BRONZE_PUZZLE_REWARD_BASE_CHANCE,
  BRONZE_PUZZLE_REWARD_CHANCE_BY_COLLECTED_COUNT,
} from './constants';
import { getSoloRewards } from './rewardEngine';
import { getRewardKindLabel, pickRewardSticker } from './stickerPicker';
import type { FreshSoloRewardKind, FreshSoloRewardPreview, FreshSoloRewardWinType } from './types';

export function getSoloRewardPreview(
  winType: FreshSoloRewardWinType,
  wagerTier: SoloWagerTier = 'skip',
  hasGoldAlbum = false,
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
): FreshSoloRewardPreview | null {
  const rewards = getSoloRewards(winType, wagerTier, hasGoldAlbum);
  const primaryReward = rewards[0];
  if (!primaryReward) return null;

  if (isAlbumStickerReward(primaryReward.kind) && Math.random() < getBronzePuzzleRewardChance(albumPuzzlePieces)) {
    const puzzleReward = pickMissingBronzePuzzlePiece(albumPuzzlePieces);
    if (puzzleReward) {
      return {
        kind: 'puzzlePiece',
        count: 1,
        stickerId: null,
        stickerName: `${puzzleReward.puzzle.title} Piece ${puzzleReward.piece.pieceNumber}/${puzzleReward.puzzle.pieceCount}`,
        puzzleId: puzzleReward.puzzle.id,
        puzzlePieceId: puzzleReward.piece.id,
        puzzlePieceNumber: puzzleReward.piece.pieceNumber,
        puzzlePieceTotal: puzzleReward.puzzle.pieceCount,
        rewardImageSource: puzzleReward.piece.imageSource,
      };
    }
  }

  const sticker = pickRewardSticker(primaryReward.kind);
  return {
    kind: primaryReward.kind,
    count: primaryReward.count,
    stickerId: sticker?.id ?? null,
    stickerName: sticker?.name ?? getRewardKindLabel(primaryReward.kind),
  };
}

function isAlbumStickerReward(kind: FreshSoloRewardKind) {
  return kind === 'common' || kind === 'epic' || kind === 'legendary';
}

function getBronzePuzzleRewardChance(albumPuzzlePieces: AlbumPuzzlePieceCounts) {
  const collectedCount = getTotalBronzePuzzlePiecesCollected(albumPuzzlePieces);
  return BRONZE_PUZZLE_REWARD_CHANCE_BY_COLLECTED_COUNT[collectedCount] ?? BRONZE_PUZZLE_REWARD_BASE_CHANCE;
}
