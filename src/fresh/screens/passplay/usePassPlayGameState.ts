import { useCallback, useMemo, useState } from 'react';
import type {
  StickerId,
  BoardCell,
  Player,
} from '../../../types';
import type { FreshSoloRewardPreview } from '../../../lib/soloRewardRules';
import { useSharedRollCounts } from '../../../hooks/useSharedRollCounts';
import { useModeBoardController } from '../../../hooks/useModeBoardController';
import { useHandoff } from '../../../hooks/useHandoff';
import { getWinner } from '../../../lib/winDetection';
import { createSharedPlayerRacks } from '../../../lib/sharedRackLogic';
import type { FreshPassPlaySetup } from '../../passplay/passPlaySetup.types';
import { useAudioContext } from '../../audio/AudioContext';
import { getWinSound } from '../../../lib/audio';
import { buildRoundRewardPreviews, grantRoundRewardPreviews } from '../../../lib/sharedRoundRewards';
import type { TurnEndMeta } from '../../../hooks/useGameBoard';
import type { AlbumPuzzleId, AlbumPuzzlePieceCounts } from '../../album/album.types';
import { setGoldenPhoenixHolderName } from '../../../hooks/useGoldenPhoenixHolder';
import { getAlbumStickerLabel } from '../../album/albumStickerLookup';

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

export function usePassPlayGameState(passPlaySetup: FreshPassPlaySetup, rewardOptions: PassPlayRewardOptions = {}) {
  const { playSound } = useAudioContext();
  const { isHandoffVisible, scheduleHandoff, hideHandoff, clearHandoffTimer } = useHandoff();
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

  const handleTurnEnd = useCallback((nextBoard: BoardCell[], metaOrDelayMs?: unknown) => {
    const meta = typeof metaOrDelayMs === 'object' && metaOrDelayMs !== null ? metaOrDelayMs as PassPlayTurnMeta : null;
    const handoffDelayMs =
      typeof metaOrDelayMs === 'number'
        ? metaOrDelayMs
        : meta?.handoffDelayMs ?? DEFAULT_HANDOFF_DELAY_MS;
    const wasRollWin = meta?.moveType === 'roll';
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
      const rewardPreview = rewardPreviews[0] ?? null;
      grantRoundRewardPreviews(rewardPreviews, {
        profileId: winnerProfileId,
        onGrantAlbumSticker: rewardOptions.onGrantAlbumSticker,
        onGrantAlbumPuzzlePiece: rewardOptions.onGrantAlbumPuzzlePiece,
      });
      setRewardPreview(rewardPreview);

      const wagerStickerId = nextWinner.player === 'player1'
        ? passPlaySetup.p2WagerStickerId
        : passPlaySetup.p1WagerStickerId;
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

  const getPassPlayPowerTurnMeta = useCallback(() => ({ handoffDelayMs: EP1_HANDOFF_DELAY_MS }), []);

  const {
    board,
    currentRack,
    selectedEmojiIndex,
    rackScales,
    lastMoveIndex,
    rollFlow,
    selectedPowerSlotId,
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1,
    handleSquarePress,
    handleSelectRackIndex,
    setSelectedPowerSlotId,
    resetBoardState,
    currentPowerSlots,
    handlePowerSlotPress: handlePressPassPlayPower,
    resetPowers,
  } = useModeBoardController({
    currentPlayer,
    onTurnEnd: handleTurnEnd,
    powerLoadouts: passPlaySetup.powerSlotIds,
    rollsDisabled: Boolean(winner) || isHandoffVisible || rollCounts[currentPlayer] <= 0,
    interactionDisabled: Boolean(winner) || isHandoffVisible,
    initialPlayerRacks: createSharedPlayerRacks(undefined, rackOptions),
    onRollConsumed: () => consumeRoll(currentPlayer),
    playSound,
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
    resetPowers();
    resetBoardState(undefined, createSharedPlayerRacks(undefined, rackOptions));
  }, [clearHandoffTimer, hideHandoff, playSound, rackOptions, resetBoardState, resetPowers, resetRolls]);

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
    isGoldenPhoenixWin: goldenPhoenixHolderName !== null,
    rollCounts,
    isHandoffVisible,
    rollFlow,
    currentPowerSlots,
    selectedPowerSlotId,
    ep1Visible,
    ep1EffectLabel,
    ep1AnimationEvent,
    clearEp1,
    handleSquarePress,
    handleSelectRackIndex,
    handleContinue,
    handleRematch,
    handlePressPassPlayPower,
  };
}
