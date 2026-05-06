import type { BoardCell, DieFaces, Player, SoloModeId, StickerId } from '../types';
import { RACK_POOL_EMOJIS } from '../data/stickerPool';
import { LEGENDARY_STICKER_IDS, SOLO_EPIC_MODE_IDS, getRandomStickerId } from './stickerHelpers';

function getSoloRackStickerPool(roundNumber: number, mode: SoloModeId = 'practice') {
  const legendaryStickerIds = new Set(LEGENDARY_STICKER_IDS);
  const standardStickerIds = RACK_POOL_EMOJIS
    .filter((entry) => entry.rarity !== 'legendary')
    .map((entry) => entry.id);
  const legendaryPoolIds = RACK_POOL_EMOJIS
    .filter((entry) => entry.rarity === 'legendary')
    .map((entry) => entry.id);
  const legendarySetPoolIds = RACK_POOL_EMOJIS
    .filter((entry) => legendaryStickerIds.has(entry.id))
    .map((entry) => entry.id);
  const shouldIncludeSecret67 = SOLO_EPIC_MODE_IDS.includes(mode);
  const secret67PoolIds = shouldIncludeSecret67 ? Array(2).fill('secret-67' as StickerId) : [];

  if (roundNumber < 3) {
    return [...standardStickerIds, ...secret67PoolIds];
  }

  return [
    ...standardStickerIds,
    ...standardStickerIds,
    ...standardStickerIds,
    ...standardStickerIds,
    ...standardStickerIds,
    ...legendaryPoolIds,
    ...legendarySetPoolIds,
    ...secret67PoolIds,
  ];
}

// faces layout: [p1-placed, p1-random, p2-placed, p2-random, die-ep1, die-free]
export function buildDieCell(
  placedBy: Player,
  placedStickerId: StickerId,
  roundNumber: number = 1,
  mode: SoloModeId = 'practice',
): NonNullable<BoardCell> {
  const pool = getSoloRackStickerPool(roundNumber, mode);
  const rand = () => pool[Math.floor(Math.random() * pool.length)] ?? placedStickerId;

  const p1Placed = placedBy === 'player1' ? placedStickerId : rand();
  const p1Random = rand();
  const p2Placed = placedBy === 'player2' ? placedStickerId : rand();
  const p2Random = rand();
  const faces: DieFaces = [p1Placed, p1Random, p2Placed, p2Random, 'die-ep1', 'die-free'];
  const currentFaceIndex = placedBy === 'player1' ? 0 : 2;

  return {
    player: placedBy,
    stickerId: placedStickerId,
    faces,
    currentFaceIndex,
    placedBy,
  };
}

// Full 6-side roll — for human players (can land on die-free face 5)
export function rollDieFace(cell: NonNullable<BoardCell>): NonNullable<BoardCell> {
  if (!cell.faces) return cell;
  const newFaceIndex = Math.floor(Math.random() * 6);
  const newPlayer: Player = newFaceIndex < 2 ? 'player1' : 'player2';
  return {
    ...cell,
    currentFaceIndex: newFaceIndex,
    stickerId: cell.faces[newFaceIndex],
    player: newPlayer,
  };
}

// 5-side roll — for CPU (secretly excludes die-free at face 5)
export function rollDieFaceCpu(cell: NonNullable<BoardCell>): NonNullable<BoardCell> {
  if (!cell.faces) return cell;
  const newFaceIndex = Math.floor(Math.random() * 5);
  const newPlayer: Player = newFaceIndex < 2 ? 'player1' : 'player2';
  return {
    ...cell,
    currentFaceIndex: newFaceIndex,
    stickerId: cell.faces[newFaceIndex],
    player: newPlayer,
  };
}

export function applyDieFace(cell: NonNullable<BoardCell>, faceIndex: number): NonNullable<BoardCell> {
  if (!cell.faces) return cell;
  const boundedFaceIndex = Math.max(0, Math.min(5, faceIndex));
  const newPlayer: Player = boundedFaceIndex < 2 ? 'player1' : 'player2';
  return {
    ...cell,
    currentFaceIndex: boundedFaceIndex,
    stickerId: cell.faces[boundedFaceIndex],
    player: newPlayer,
  };
}

export function getRandomFreeSticker(): StickerId {
  const epicPlus = RACK_POOL_EMOJIS.filter(
    (e) => e.rarity === 'epic' || e.rarity === 'legendary' || e.rarity === 'platinum',
  );
  if (epicPlus.length === 0) return getRandomStickerId();
  return epicPlus[Math.floor(Math.random() * epicPlus.length)]?.id ?? getRandomStickerId();
}

export function getFallbackDieStickerId() {
  return getRandomStickerId();
}
