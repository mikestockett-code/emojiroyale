import { useCallback, useMemo, useState } from 'react';
import type {
  StickerId,
  BattlePowerSlotId,
  BoardCell,
  Player,
} from '../../../types';
import type { FreshSoloRewardPreview } from '../../../lib/soloRewardRules';
import { useGameBoard } from '../../../hooks/useGameBoard';
import { useGamePowerSlots, toGameBoardPowerSlot } from '../../../hooks/useGamePowerSlots';
import { useSharedRollCounts } from '../../../hooks/useSharedRollCounts';
import { useGamePowerPress } from '../../../hooks/useGamePowerPress';
import { useHandoff } from '../../../hooks/useHandoff';
import { getWinner } from '../../../lib/winDetection';
import { createSharedPlayerRacks } from '../../../lib/sharedRackLogic';
import { ALBUM_STICKER_CATALOG } from '../../album/albumStickerCatalog';
import type { FreshPassPlaySetup } from '../../passplay/passPlaySetup.types';
import { useAudioContext } from '../../audio/AudioContext';
import { getWinSound } from '../../../lib/audio';
import { createWizardOfOzRewardPreview, grantWizardOfOzJackpot } from '../../../lib/jackpotRewards';
import { buildRoundRewardPreviews, grantRoundRewardPreviews } from '../../../lib/sharedRoundRewards';
import type { TurnEndMeta } from '../../../hooks/useGameBoard';
import type { AlbumPuzzleId, AlbumPuzzlePieceCounts } from '../../album/album.types';
import { setGoldenPhoenixHolderName } from '../../../hooks/useGoldenPhoenixHolder';

const DEFAULT_HANDOFF_DELAY_MS = 950;
const EP1_HANDOFF_DELAY_MS = 2600;

type PassPlayRewardOptions = {
  activeProfileId?: string | null;
  secondaryProfileId?: string | null;
  activeProfileName?: string | null;
  secondaryProfileName?: string | null;
  isGoldenPhoenixOpen?: boolean;
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

type PassPlayTurnMeta = TurnEndMeta & {
  handoffDelayMs?: number;
};

function getWagerChapterId(wagerId: string) {
  if (wagerId === 'legendary') return 'legendary';
  if (wagerId === 'epic') return 'epic';
  return null;
}

function pickWagerStickerId(wagerId: string) {
  const chapterId = getWagerChapterId(wagerId);
  if (!chapterId) return null;

  const stickerPool = ALBUM_STICKER_CATALOG.filter((sticker) => sticker.chapterId === chapterId);
  return stickerPool[Math.floor(Math.random() * stickerPool.length)]?.id ?? null;
}

function getAlbumStickerLabel(stickerId: StickerId) {
  return ALBUM_STICKER_CATALOG.find((sticker) => sticker.id === stickerId)?.name ?? 'Wager Sticker';
}

export function usePassPlayGameState(passPlaySetup: FreshPassPlaySetup, rewardOptions: PassPlayRewardOptions = {}) {
  const { playSound } = useAudioContext();
  const { isHandoffVisible, scheduleHandoff, hideHandoff, clearHandoffTimer } = useHandoff();
  const player1Powers = useGamePowerSlots(passPlaySetup.powerSlotIds.player1, { allowEpi: false });
  const player2Powers = useGamePowerSlots(passPlaySetup.powerSlotIds.player2, { allowEpi: false });
  const rackOptions = useMemo(
    () => ({ forceLegendarySet: rewardOptions.isGoldenPhoenixOpen === true }),
    [rewardOptions.isGoldenPhoenixOpen],
  );

  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [winner, setWinner] = useState<ReturnType<typeof getWinner>>(null);
  const [rewardPreview, setRewardPreview] = useState<FreshSoloRewardPreview | null>(null);
  const [wagerPayout, setWagerPayout] = useState<WagerPayout>(null);
  const [goldenPhoenixHolderName, setGoldenPhoenixHolderNameState] = useState<string | null>(null);
  const { rollCounts, consumeRoll, resetRolls } = useSharedRollCounts();

  const currentPowerSlots = useMemo(() => {
    return currentPlayer === 'player1' ? player1Powers.powerSlotData : player2Powers.powerSlotData;
  }, [currentPlayer, player1Powers.powerSlotData, player2Powers.powerSlotData]);

  const handleTurnEnd = useCallback((nextBoard: BoardCell[], metaOrDelayMs?: unknown) => {
    const meta = typeof metaOrDelayMs === 'object' && metaOrDelayMs !== null ? metaOrDelayMs as PassPlayTurnMeta : null;
    const handoffDelayMs =
      typeof metaOrDelayMs === 'number'
        ? metaOrDelayMs
        : meta?.handoffDelayMs ?? DEFAULT_HANDOFF_DELAY_MS;
    const wasRollWin = meta?.moveType === 'roll';
    const isWizardOfOzJackpot = meta?.effectId === 'tornado';
    const nextWinner = getWinner(nextBoard);
    if (nextWinner) {
      playSound(getWinSound(nextWinner.type, true));
      setWinner(nextWinner);
      hideHandoff();

      const winnerProfileId =
        nextWinner.player === 'player1'
          ? rewardOptions.activeProfileId
          : rewardOptions.secondaryProfileId;
      const winnerProfileName =
        nextWinner.player === 'player1'
          ? rewardOptions.activeProfileName
          : rewardOptions.secondaryProfileName;
      const winnerPuzzlePieces =
        nextWinner.player === 'player1'
          ? rewardOptions.activeAlbumPuzzlePieces
          : rewardOptions.secondaryAlbumPuzzlePieces;
      if (nextWinner.type === 'legendary' && rewardOptions.isGoldenPhoenixOpen && winnerProfileName) {
        setGoldenPhoenixHolderNameState(winnerProfileName);
        void setGoldenPhoenixHolderName(winnerProfileName);
      }
      const rewardPreviews = buildRoundRewardPreviews({
        winner: nextWinner,
        wasRollWin,
        wagerTier: 'skip',
        albumPuzzlePieces: winnerPuzzlePieces ?? {},
      });
      const jackpotPreview: FreshSoloRewardPreview | null = isWizardOfOzJackpot
        ? createWizardOfOzRewardPreview()
        : null;
      const rewardPreview = jackpotPreview ?? rewardPreviews[0] ?? null;
      grantRoundRewardPreviews(rewardPreviews, {
        profileId: winnerProfileId,
        onGrantAlbumSticker: rewardOptions.onGrantAlbumSticker,
        onGrantAlbumPuzzlePiece: rewardOptions.onGrantAlbumPuzzlePiece,
      });
      if (isWizardOfOzJackpot) {
        grantWizardOfOzJackpot(winnerProfileId, rewardOptions.onGrantAlbumSticker);
      }
      setRewardPreview(rewardPreview);

      const wagerStickerId = pickWagerStickerId(passPlaySetup.selectedWagerId);
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

    scheduleHandoff(handoffDelayMs);
  }, [hideHandoff, passPlaySetup.selectedWagerId, playSound, rewardOptions, scheduleHandoff]);

  const consumePower = useCallback((slotId: BattlePowerSlotId) => {
    if (currentPlayer === 'player1') player1Powers.consumePower(slotId);
    else player2Powers.consumePower(slotId);
  }, [currentPlayer, player1Powers, player2Powers]);

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
    initialPlayerRacks: createSharedPlayerRacks(undefined, rackOptions),
    powerSlots: {
      slot1: toGameBoardPowerSlot(currentPowerSlots.slot1),
      slot2: toGameBoardPowerSlot(currentPowerSlots.slot2),
    },
    onConsumePower: consumePower,
    onRollConsumed: () => consumeRoll(currentPlayer),
    playSound,
  });

  const getPassPlayPowerTurnMeta = useCallback(() => ({ handoffDelayMs: EP1_HANDOFF_DELAY_MS }), []);

  const handlePressPassPlayPower = useGamePowerPress({
    board,
    powerSlots: currentPowerSlots,
    disabled: Boolean(winner) || isHandoffVisible,
    selectedPowerSlotId,
    setSelectedPowerSlotId,
    consumePower,
    setBoard,
    setLastMoveIndex,
    showEp1Launch,
    finishTurn: handleTurnEnd,
    getPowerTurnMeta: getPassPlayPowerTurnMeta,
  });

  const handleContinue = useCallback(() => {
    playSound('button');
    hideHandoff();
    setSelectedPowerSlotId(null);
    setCurrentPlayer((player) => (player === 'player1' ? 'player2' : 'player1'));
  }, [hideHandoff, playSound, setSelectedPowerSlotId]);

  const handleRematch = useCallback(() => {
    playSound('button');
    clearHandoffTimer();
    setCurrentPlayer('player1');
    setWinner(null);
    setRewardPreview(null);
    setWagerPayout(null);
    hideHandoff();
    resetRolls();
    player1Powers.resetPowers();
    player2Powers.resetPowers();
    resetBoardState(undefined, createSharedPlayerRacks(undefined, rackOptions));
  }, [clearHandoffTimer, hideHandoff, playSound, player1Powers, player2Powers, rackOptions, resetBoardState]);

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
    goldenPhoenixHolderName,
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
