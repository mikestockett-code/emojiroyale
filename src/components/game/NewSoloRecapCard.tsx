import React, { useMemo, useRef, useState } from 'react';
import { Modal, ScrollView, Share, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import type { StickerId } from '../../types';
import type { FreshProfile } from '../../fresh/profile/types';
import type { AlbumEraId } from '../../fresh/album/album.types';
import type { ImageSourcePropType } from 'react-native';
import type { FreshSoloRewardPreview } from '../../lib/soloRewardRules';
import { AlbumTierBadge } from '../../fresh/shared/AlbumTierBadge';
import { RecapButtons } from '../../fresh/solo/RecapButtons';
import { SoloRecapHeader } from '../../fresh/solo/SoloRecapHeader';
import { SoloRecapProfile } from '../../fresh/solo/SoloRecapProfile';
import { SoloRecapScore } from '../../fresh/solo/SoloRecapScore';
import { SoloRecapHighlights } from '../../fresh/solo/SoloRecapHighlights';
import { SoloRecapReward } from '../../fresh/solo/SoloRecapReward';
import { soloRecapStyles as styles } from '../../fresh/solo/soloRecapStyles';
import {
  getProfileAlbumProgress,
  getOwnedStickers,
} from '../../fresh/album/albumProfileProgress';
import { ALBUM_STICKER_CATALOG } from '../../fresh/album/albumStickerCatalog';

const SCARCITY_RANK: Record<string, number> = { extremelyRare: 3, rare: 2, common: 1 };

type Props = {
  visible: boolean;
  resultTitle: string;
  roundScore: number;
  rewardStickerId?: StickerId | null;
  rewardStickerCount?: number;
  rewardStickerLabel?: string;
  rewardImageSource?: ImageSourcePropType;
  runRewardPreviews?: FreshSoloRewardPreview[];
  activeProfile?: FreshProfile | null;
  activeEraId?: AlbumEraId;
  onSetFavoriteSticker?: (stickerId: string | null) => void;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export function NewSoloRecapCard({
  visible,
  roundScore,
  rewardStickerId,
  rewardStickerCount = 0,
  rewardStickerLabel = '',
  rewardImageSource,
  runRewardPreviews = [],
  activeProfile,
  activeEraId = 'bronze',
  onSetFavoriteSticker,
  onPlayAgain,
  onMenu,
}: Props) {
  const insets = useSafeAreaInsets();
  const recapCaptureRef = useRef<View>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const albumCounts = activeProfile?.albumCounts ?? {};
  const albumPuzzlePieces = activeProfile?.albumPuzzlePieces ?? {};
  const favoriteStickerId = activeProfile?.favoriteStickerId;

  const albumProgress = useMemo(
    () => getProfileAlbumProgress(albumCounts, activeEraId, albumPuzzlePieces),
    [albumCounts, activeEraId, albumPuzzlePieces],
  );

  const highlights = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const preview of runRewardPreviews) {
      if (preview.kind !== 'common' && preview.kind !== 'epic' && preview.kind !== 'legendary') continue;
      if (!preview.stickerId) continue;
      counts[preview.stickerId] = (counts[preview.stickerId] ?? 0) + preview.count;
    }

    return ALBUM_STICKER_CATALOG
      .filter((sticker) => (counts[sticker.id] ?? 0) > 0 && sticker.emoji)
      .sort((a, b) => {
        const rarityDiff = (SCARCITY_RANK[b.scarcityId] ?? 1) - (SCARCITY_RANK[a.scarcityId] ?? 1);
        if (rarityDiff !== 0) return rarityDiff;
        return (counts[b.id] ?? 0) - (counts[a.id] ?? 0);
      })
      .slice(0, 4)
      .map((sticker) => ({ sticker, count: counts[sticker.id] ?? 1 }));
  }, [runRewardPreviews]);

  const favoriteSticker = useMemo(
    () => favoriteStickerId
      ? ALBUM_STICKER_CATALOG.find((s) => s.id === favoriteStickerId) ?? null
      : null,
    [favoriteStickerId],
  );

  const ownedStickers = useMemo(() => getOwnedStickers(albumCounts), [albumCounts]);
  const shareMessage = useMemo(() => {
    const lines = [
      `${activeProfile?.name ?? 'Player'}'s Solo Recap`,
      `Score: ${roundScore.toLocaleString()}`,
    ];

    if (rewardStickerLabel) {
      lines.push(`Won this round: ${rewardStickerLabel}${rewardStickerCount > 1 ? ` x${rewardStickerCount}` : ''}`);
    }

    if (highlights.length > 0) {
      lines.push(
        `Top Emoji Stickers: ${highlights
          .map(({ sticker, count }) => `${sticker.emoji ?? ''} ${sticker.name}${count > 1 ? ` x${count}` : ''}`)
          .join(', ')}`,
      );
    }

    lines.push('Emoji Royale');
    return lines.join('\n');
  }, [activeProfile?.name, highlights, rewardStickerCount, rewardStickerLabel, roundScore]);

  const handleShare = async () => {
    try {
      if (recapCaptureRef.current && await Sharing.isAvailableAsync()) {
        const uri = await captureRef(recapCaptureRef.current, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share Solo Recap',
          mimeType: 'image/png',
          UTI: 'public.png',
        });
        return;
      }
    } catch {
      // Fall back to text sharing below if capture/share is unavailable or cancelled.
    }

    try {
      await Share.share({
        title: 'Solo Recap',
        message: shareMessage,
      });
    } catch {
      // The native share sheet can reject if the user closes it on some platforms.
    }
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <LinearGradient colors={['#0d0608', '#1a0a06', '#0d0608']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View ref={recapCaptureRef} collapsable={false} style={styles.shareCard}>
            <SoloRecapHeader />

            <SoloRecapProfile
              activeProfile={activeProfile}
              favoriteSticker={favoriteSticker}
              favoriteStickerId={favoriteStickerId}
              ownedStickers={ownedStickers}
              pickerOpen={pickerOpen}
              onOpenPicker={() => setPickerOpen(true)}
              onClosePicker={() => setPickerOpen(false)}
              onSetFavoriteSticker={onSetFavoriteSticker}
            />

            <AlbumTierBadge
              eraId={albumProgress.eraId}
              uniqueCollected={albumProgress.uniqueCollected}
              totalUniqueStickers={albumProgress.totalUniqueStickers}
              percentComplete={albumProgress.percentComplete}
            />

            <SoloRecapScore roundScore={roundScore} profileBest={activeProfile?.soloHighScore} />

            <SoloRecapHighlights highlights={highlights} />

            <SoloRecapReward
              rewardStickerId={rewardStickerId}
              rewardStickerCount={rewardStickerCount}
              rewardStickerLabel={rewardStickerLabel}
              rewardImageSource={rewardImageSource}
            />
          </View>

          <View style={{ height: 8 }} />

          <RecapButtons onPlayAgain={onPlayAgain} onShare={handleShare} onMenu={onMenu} />
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}
