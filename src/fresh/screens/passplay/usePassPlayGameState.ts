import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  StickerId,
  BattlePowerId,
  BattlePowerSlotId,
  BattlePowerType,
  BoardCell,
  Player,
} from '../../../types';
import {
  getSoloRewardPreview,
  mapWinnerToSoloRewardWinType,
  type FreshSoloRewardPreview,
} from '../../../lib/soloRewardRules';
import { useGameBoard } from '../../../hooks/useGameBoard';
import { useEP1Powers } from '../../../hooks/useEP1Powers';
import { applyFourSquarePower, applyTornadoPower } from '../../../lib/battlePowerEffects';
import { createGameBoardEffectEvent } from '../../../lib/gameBoardEffects';
import { getWinner } from '../../../lib/scoring';
import { createSharedPlayerRacks } from '../../../lib/sharedRackLogic';
import { BATTLE_TEST_POWERS } from '../../../data/battlePowers';
import { ALBUM_STICKER_CATALOG } from '../../album/albumStickerCatalog';
import type { FreshPassPlaySetup } from '../../passplay/passPlaySetup.types';
import { useAudioContext } from '../../audio/AudioContext';
import { getWinSound } from '../../../lib/audio';
import type { AlbumPuzzleId, AlbumPuzzlePieceCounts } from '../../album/album.types';

const DEFAULT_HANDOFF_DELAY_MS = 950;
const EP1_HANDOFF_DELAY_MS = 2600;

type RackPowerSlot = {
  slotId: BattlePowerSlotId;
  powerId: BattlePowerId;
  power: { type: BattlePowerType; label: string; detail: string; icon: string };
  count: number;
  isUsed: boolean;
};

function buildPowerSlot(slotId: BattlePowerSlotId, powerId: BattlePowerId | null): RackPowerSlot | null {
  if (!powerId) return null;
  const power = BATTLE_TEST_POWERS.find((entry) => entry.id === powerId);
  if (!power) return null;
  return {
    slotId,
    powerId,
    power: { type: power.type, label: power.label, detail: power.detail, icon: power.icon },
    count: 1,
    isUsed: false,
  };
}

type PassPlayRewardOptions = {
  activeProfileId?: string | null;
  secondaryProfileId?: string | null;
  activeAlbumCounts?: Record<string, number>;
  secondaryAlbumCounts?: Record<string, number>;
  activeAlbumPuzzlePieces?: AlbumPuzzlePieceCounts;
  secondaryAlbumPuzzlePieces?: AlbumPuzzlePieceCounts;
  onGrantAlbumSticker?: (profileId: string | null | undefined, stickerId: StickerId, count?: number) => void;
  onGrantAlbumPuzzlePiece?: (
    profileId: string | null | undefined,
    puzzleId: AlbumPuzzleId,
    pieceId: string,
    count?: number,
  ) => void;
};

type WagerPayout = {
  stickerId: StickerId;
  count: number;
  label: string;
} | null;

function getWagerChapterId(wagerId: string) {
  if (wagerId === 'legendary') return 'legendary';
  if (wagerId === 'epic') return 'epic';
  return null;
}

function pickOwnedWagerStickerId(wagerId: string, albumCounts: Record<string, number> = {}) {
  const chapterId = getWagerChapterId(wagerId);
  if (!chapterId) return null;

  const ownedSticker = ALBUM_STICKER_CATALOG.find(
    (sticker) => sticker.chapterId === chapterId && (albumCounts[sticker.id] ?? 0) > 0,
  );
  return ownedSticker?.id ?? null;
}

function getAlbumStickerLabel(stickerId: StickerId) {
  return ALBUM_STICKER_CATALOG.find((sticker) => sticker.id === stickerId)?.name ?? 'Wager Sticker';
}

export function usePassPlayGameState(passPlaySetup: FreshPassPlaySetup, rewardOptions: PassPlayRewardOptions = {}) {
  const { playSound } = useAudioContext();
  const handoffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (handoffTimerRef.current) clearTimeout(handoffTimerRef.current);
    };
  }, []);

  const ep1P1 = useEP1Powers(passPlaySetup.powerSlotIds.player1);
  const ep1P2 = useEP1Powers(passPlaySetup.powerSlotIds.player2);

  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [winner, setWinner] = useState<ReturnType<typeof getWinner>>(null);
  const [rewardPreview, setRewardPreview] = useState<FreshSoloRewardPreview | null>(null);
  const [wagerPayout, setWagerPayout] = useState<WagerPayout>(null);
  const [isHandoffVisible, setIsHandoffVisible] = useState(false);
  const [rollCounts, setRollCounts] = useState({ player1: 3, player2: 3 });

  const currentPowerSlots = useMemo(() => {
    const slotIds = passPlaySetup.powerSlotIds[currentPlayer];
    const ep1Current = currentPlayer === 'player1' ? ep1P1 : ep1P2;
    const slot1 = buildPowerSlot('slot1', slotIds.slot1);
    const slot2 = buildPowerSlot('slot2', slotIds.slot2);
    return {
      slot1: slot1 ? { ...slot1, isUsed: ep1Current.slotUsed.slot1 } : null,
      slot2: slot2 ? { ...slot2, isUsed: ep1Current.slotUsed.slot2 } : null,
    };
  }, [currentPlayer, ep1P1, ep1P2, passPlaySetup.powerSlotIds]);

  const handleTurnEnd = useCallback((nextBoard: BoardCell[], metaOrDelayMs?: unknown) => {
    const handoffDelayMs = typeof metaOrDelayMs === 'number' ? metaOrDelayMs : DEFAULT_HANDOFF_DELAY_MS;
    const nextWinner = getWinner(nextBoard);
    if (nextWinner) {
      playSound(getWinSound(nextWinner.type, true));
      setWinner(nextWinner);
      setIsHandoffVisible(false);

      const winnerProfileId =
        nextWinner.player === 'player1'
          ? rewardOptions.activeProfileId
          : rewardOptions.secondaryProfileId;
      const winnerPuzzlePieces =
        nextWinner.player === 'player1'
          ? rewardOptions.activeAlbumPuzzlePieces
          : rewardOptions.secondaryAlbumPuzzlePieces;
      const rewardPreview = getSoloRewardPreview(
        mapWinnerToSoloRewardWinType(nextWinner, false),
        'skip',
        false,
        winnerPuzzlePieces ?? {},
      );
      if (rewardPreview?.kind === 'puzzlePiece' && rewardPreview.puzzleId && rewardPreview.puzzlePieceId) {
        rewardOptions.onGrantAlbumPuzzlePiece?.(
          winnerProfileId,
          rewardPreview.puzzleId,
          rewardPreview.puzzlePieceId,
          1,
        );
      } else if (rewardPreview?.stickerId) {
        rewardOptions.onGrantAlbumSticker?.(winnerProfileId, rewardPreview.stickerId, rewardPreview.count);
      }
      setRewardPreview(rewardPreview);

      const loserAlbumCounts =
        nextWinner.player === 'player1'
          ? rewardOptions.secondaryAlbumCounts
          : rewardOptions.activeAlbumCounts;
      const wagerStickerId = pickOwnedWagerStickerId(passPlaySetup.selectedWagerId, loserAlbumCounts);
      if (wagerStickerId) {
        rewardOptions.onGrantAlbumSticker?.(winnerProfileId, wagerStickerId, 1);
        setWagerPayout({
          stickerId: wagerStickerId,
          count: 1,
          label: getAlbumStickerLabel(wagerStickerId),
        });
      } else {
        setWagerPayout(null);
      }
      return;
    }

    if (handoffTimerRef.current) clearTimeout(handoffTimerRef.current);
    handoffTimerRef.current = setTimeout(() => setIsHandoffVisible(true), handoffDelayMs);
  }, [passPlaySetup.selectedWagerId, playSound, rewardOptions]);

  const consumePower = useCallback((slotId: BattlePowerSlotId) => {
    if (currentPlayer === 'player1') ep1P1.consume(slotId);
    else ep1P2.consume(slotId);
  }, [currentPlayer, ep1P1, ep1P2]);

  const {
    board,
    currentRack,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    rollFlow,
    selectedPowerSlotId,
    ep1AnimationEvent,
    showEp1Launch,
    handleSquarePress,
    handleSelectRackIndex,
    setBoard,
    setLastMoveIndex,
    setSelectedPowerSlotId,
    resetBoardState,
  } = useGameBoard({
    currentPlayer,
    onTurnEnd: handleTurnEnd,
    rollsDisabled: Boolean(winner) || isHandoffVisible || rollCounts[currentPlayer] <= 0,
    interactionDisabled: Boolean(winner) || isHandoffVisible,
    initialPlayerRacks: createSharedPlayerRacks(),
    powerSlots: {
      slot1: currentPowerSlots.slot1
        ? {
            powerId: currentPowerSlots.slot1.powerId,
            type: currentPowerSlots.slot1.power.type,
            usesLeft: currentPowerSlots.slot1.isUsed ? 0 : currentPowerSlots.slot1.count,
          }
        : null,
      slot2: currentPowerSlots.slot2
        ? {
            powerId: currentPowerSlots.slot2.powerId,
            type: currentPowerSlots.slot2.power.type,
            usesLeft: currentPowerSlots.slot2.isUsed ? 0 : currentPowerSlots.slot2.count,
          }
        : null,
    },
    onConsumePower: consumePower,
    onRollConsumed: () => {
      setRollCounts((current) => ({
        ...current,
        [currentPlayer]: Math.max(0, current[currentPlayer] - 1),
      }));
    },
    playSound,
  });

  const handlePressPassPlayPower = useCallback((slotId: BattlePowerSlotId) => {
    if (winner || isHandoffVisible) return;
    const slot = currentPowerSlots[slotId];
    if (!slot || slot.isUsed) return;

    if (slot.powerId === 'power-four-square') {
      const { nextBoard, lastMoveIndex, affectedIndices } = applyFourSquarePower(board);
      if (affectedIndices.length === 0) return;
      showEp1Launch(createGameBoardEffectEvent('fourSquare', 'Four Square', affectedIndices, board));
      setBoard(nextBoard);
      setLastMoveIndex(lastMoveIndex);
      consumePower(slotId);
      handleTurnEnd(nextBoard, EP1_HANDOFF_DELAY_MS);
      return;
    }

    if (slot.powerId === 'power-tornado') {
      const { nextBoard, lastMoveIndex, affectedIndices } = applyTornadoPower(board);
      if (affectedIndices.length === 0) return;
      showEp1Launch(createGameBoardEffectEvent('tornado', 'Tornado', affectedIndices, board));
      setBoard(nextBoard);
      setLastMoveIndex(lastMoveIndex);
      consumePower(slotId);
      handleTurnEnd(nextBoard, EP1_HANDOFF_DELAY_MS);
      return;
    }

    setSelectedPowerSlotId((current) => (current === slotId ? null : slotId));
  }, [
    board,
    consumePower,
    currentPowerSlots,
    handleTurnEnd,
    isHandoffVisible,
    setBoard,
    setLastMoveIndex,
    setSelectedPowerSlotId,
    showEp1Launch,
    winner,
  ]);

  const handleContinue = useCallback(() => {
    playSound('button');
    setIsHandoffVisible(false);
    setSelectedPowerSlotId(null);
    setCurrentPlayer((player) => (player === 'player1' ? 'player2' : 'player1'));
  }, [playSound, setSelectedPowerSlotId]);

  const handleRematch = useCallback(() => {
    playSound('button');
    if (handoffTimerRef.current) clearTimeout(handoffTimerRef.current);
    handoffTimerRef.current = null;
    setCurrentPlayer('player1');
    setWinner(null);
    setRewardPreview(null);
    setWagerPayout(null);
    setIsHandoffVisible(false);
    setRollCounts({ player1: 3, player2: 3 });
    ep1P1.reset();
    ep1P2.reset();
    resetBoardState(undefined, createSharedPlayerRacks());
  }, [ep1P1, ep1P2, playSound, resetBoardState]);

  return {
    board,
    currentRack,
    currentPlayer,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    winner,
    winningLineIndices: winner?.indices ?? [],
    rewardPreview,
    wagerPayout,
    rollCounts,
    isHandoffVisible,
    rollFlow,
    currentPowerSlots,
    selectedPowerSlotId,
    ep1AnimationEvent,
    handleSquarePress,
    handleSelectRackIndex,
    handleContinue,
    handleRematch,
    handlePressPassPlayPower,
  };
}
