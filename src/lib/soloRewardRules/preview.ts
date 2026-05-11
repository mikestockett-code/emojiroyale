import type { SoloWagerTier } from '../../types';
import { getTotalBronzePuzzlePiecesCollected, pickMissingBronzePuzzlePiece } from '../../fresh/album/albumPuzzleProgress';
import type { AlbumPuzzlePieceCounts } from '../../fresh/album/album.types';
import {
  BRONZE_PUZZLE_REWARD_BASE_CHANCE,
  BRONZE_PUZZLE_REWARD_CHANCE_BY_COLLECTED_COUNT,
} from './constants';
import { getSoloRewards } from './rewardEngine';
import { getRewardKindLabel, pickRewardSticker } from './stickerPicker';
import type { FreshSoloReward, FreshSoloRewardKind, FreshSoloRewardPreview, FreshSoloRewardWinType } from './types';

const ROLL_WIN_POWER_REWARDS: Array<{ kind: FreshSoloRewardKind; stickerId: string; stickerName: string }> = [
  { kind: 'power', stickerId: 'power-torture-rack', stickerName: 'Torture Rack' },
  { kind: 'power', stickerId: 'power-clear-row', stickerName: 'Clear Row' },
  { kind: 'power', stickerId: 'power-clear-column', stickerName: 'Clear Column' },
  { kind: 'power', stickerId: 'power-remove-emoji', stickerName: 'Remove Emoji' },
  { kind: 'powerPlus', stickerId: 'power-plus-10-seconds', stickerName: '+10 Seconds' },
  { kind: 'powerPlus', stickerId: 'power-clock-freeze', stickerName: 'Clock Freeze' },
];

export function getSoloRewardPreview(
  winType: FreshSoloRewardWinType,
  wagerTier: SoloWagerTier = 'skip',
  hasGoldAlbum = false,
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
): FreshSoloRewardPreview | null {
  return getSoloRewardPreviews(winType, wagerTier, hasGoldAlbum, albumPuzzlePieces)[0] ?? null;
}

export function getSoloRewardPreviews(
  winType: FreshSoloRewardWinType,
  wagerTier: SoloWagerTier = 'skip',
  hasGoldAlbum = false,
  albumPuzzlePieces: AlbumPuzzlePieceCounts = {},
): FreshSoloRewardPreview[] {
  const previews = getSoloRewards(winType, wagerTier, hasGoldAlbum)
    .map((reward) => buildRewardPreview(reward, albumPuzzlePieces))
    .filter((preview): preview is FreshSoloRewardPreview => preview !== null);

  if (isRollWinType(winType)) {
    previews.push(getRandomRollWinPowerPreview());
  }

  return previews;
}

function buildRewardPreview(
  reward: FreshSoloReward,
  albumPuzzlePieces: AlbumPuzzlePieceCounts,
): FreshSoloRewardPreview | null {
  if (isAlbumStickerReward(reward.kind) && Math.random() < getBronzePuzzleRewardChance(albumPuzzlePieces)) {
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

  const sticker = pickRewardSticker(reward.kind);
  return {
    kind: reward.kind,
    count: reward.count,
    stickerId: sticker?.id ?? null,
    stickerName: sticker?.name ?? getRewardKindLabel(reward.kind),
  };
}

function getRandomRollWinPowerPreview(): FreshSoloRewardPreview {
  const reward = ROLL_WIN_POWER_REWARDS[Math.floor(Math.random() * ROLL_WIN_POWER_REWARDS.length)];
  return {
    kind: reward.kind,
    count: 1,
    stickerId: reward.stickerId,
    stickerName: reward.stickerName,
  };
}

function isRollWinType(winType: FreshSoloRewardWinType) {
  return winType === 'commonRoll' || winType === 'epicRoll' || winType === 'legendaryRoll';
}

function isAlbumStickerReward(kind: FreshSoloRewardKind) {
  return kind === 'common' || kind === 'epic' || kind === 'legendary';
}

function getBronzePuzzleRewardChance(albumPuzzlePieces: AlbumPuzzlePieceCounts) {
  const collectedCount = getTotalBronzePuzzlePiecesCollected(albumPuzzlePieces);
  return BRONZE_PUZZLE_REWARD_CHANCE_BY_COLLECTED_COUNT[collectedCount] ?? BRONZE_PUZZLE_REWARD_BASE_CHANCE;
}
