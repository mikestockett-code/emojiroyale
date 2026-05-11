import type { Player, SoloModeId, StickerId } from '../types';
import { RACK_SIZE } from '../constants/gameConstants';
import { STICKER_CATALOG } from '../data/stickerPool';
import { LEGENDARY_STICKER_IDS } from './stickerHelpers';

const LEGENDARY_RACK_WEIGHT = 0.2;

const PLAYABLE_RACK_POOL = STICKER_CATALOG.filter((entry) => entry.playable);
const LEGENDARY_WIN_STICKER_IDS = new Set<StickerId>(LEGENDARY_STICKER_IDS);

type RackPoolOptions = {
  soloMode?: SoloModeId;
  roundNumber?: number;
  forceLegendarySet?: boolean;
};

function shouldBlockLegendarySetStickers(options?: RackPoolOptions) {
  return options?.soloMode === 'practice' && (options.roundNumber ?? 1) < 3;
}

function getStickerWeight(stickerId: StickerId) {
  return LEGENDARY_WIN_STICKER_IDS.has(stickerId) ? LEGENDARY_RACK_WEIGHT : 1;
}

export function getSharedPlayableRackPool(options?: RackPoolOptions) {
  if (!shouldBlockLegendarySetStickers(options)) return PLAYABLE_RACK_POOL;
  return PLAYABLE_RACK_POOL.filter((entry) => !LEGENDARY_WIN_STICKER_IDS.has(entry.id));
}

export function pickRandomPlayableStickerId(options?: RackPoolOptions): StickerId {
  const pool = getSharedPlayableRackPool(options);
  const weightedPool = pool.map((entry) => ({
    id: entry.id,
    weight: getStickerWeight(entry.id),
  }));

  const totalWeight = weightedPool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of weightedPool) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.id;
    }
  }

  return weightedPool[weightedPool.length - 1]?.id ?? 'sunny-smile';
}

export function createSharedRack(size = RACK_SIZE, options?: RackPoolOptions) {
  if (!options?.forceLegendarySet) {
    return Array.from({ length: size }, () => pickRandomPlayableStickerId(options));
  }

  const guaranteedStickers = shuffle([...LEGENDARY_STICKER_IDS]).slice(0, Math.min(size, LEGENDARY_STICKER_IDS.length));
  const remainingSlots = Math.max(0, size - guaranteedStickers.length);
  const randomStickers = Array.from({ length: remainingSlots }, () => pickRandomPlayableStickerId(options));
  return shuffle([...guaranteedStickers, ...randomStickers]);
}

export function rerollSharedRack(size = RACK_SIZE, options?: RackPoolOptions) {
  return createSharedRack(size, options);
}

export function createSharedPlayerRacks(size = RACK_SIZE, options?: RackPoolOptions) {
  return {
    player1: createSharedRack(size, options),
    player2: createSharedRack(size, options),
  } satisfies Record<Player, StickerId[]>;
}

function shuffle<T>(items: T[]) {
  const nextItems = [...items];
  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }
  return nextItems;
}
