import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { StickerId } from '../../types';
import type { FreshProfile } from '../../fresh/profile/types';
import type { AlbumEraId } from '../../fresh/album/album.types';
import type { ImageSourcePropType } from 'react-native';
import { theme } from '../../fresh/shared/luxuryTheme';
import { AlbumTierBadge } from '../../fresh/shared/AlbumTierBadge';
import { RecapButtons } from '../../fresh/solo/RecapButtons';
import {
  getProfileAlbumProgress,
  getTopOwnedStickers,
  getOwnedStickers,
} from '../../fresh/album/albumProfileProgress';
import { ALBUM_STICKER_CATALOG } from '../../fresh/album/albumStickerCatalog';

type Props = {
  visible: boolean;
  resultTitle: string;
  roundScore: number;
  rewardStickerId?: StickerId | null;
  rewardStickerCount?: number;
  rewardStickerLabel?: string;
  rewardImageSource?: ImageSourcePropType;
  activeProfile?: FreshProfile | null;
  activeEraId?: AlbumEraId;
  onSetFavoriteSticker?: (stickerId: string | null) => void;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export function NewSoloRecapCard({
  visible,
  resultTitle,
  roundScore,
  rewardStickerId,
  rewardStickerCount = 0,
  rewardStickerLabel = '',
  rewardImageSource,
  activeProfile,
  activeEraId = 'bronze',
  onSetFavoriteSticker,
  onPlayAgain,
  onMenu,
}: Props) {
  const insets = useSafeAreaInsets();
  const [pickerOpen, setPickerOpen] = useState(false);

  const isLoss =
    resultTitle.toLowerCase().includes('defeat') ||
    resultTitle.toLowerCase().includes('lost') ||
    resultTitle.toLowerCase().includes('cpu');

  const albumCounts = activeProfile?.albumCounts ?? {};
  const albumPuzzlePieces = activeProfile?.albumPuzzlePieces ?? {};
  const profileBest = activeProfile?.soloHighScore;
  const favoriteStickerId = activeProfile?.favoriteStickerId;

  const albumProgress = useMemo(
    () => getProfileAlbumProgress(albumCounts, activeEraId, albumPuzzlePieces),
    [albumCounts, activeEraId, albumPuzzlePieces],
  );

  const highlights = useMemo(
    () => getTopOwnedStickers(albumCounts, 4),
    [albumCounts],
  );

  const favoriteSticker = useMemo(
    () => favoriteStickerId
      ? ALBUM_STICKER_CATALOG.find((s) => s.id === favoriteStickerId) ?? null
      : null,
    [favoriteStickerId],
  );

  const ownedStickers = useMemo(() => getOwnedStickers(albumCounts), [albumCounts]);

  const isBetter = roundScore > (profileBest ?? 0);

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
          {/* Header */}
          <Text style={styles.pageTitle}>SOLO RECAP</Text>
          <Text style={[styles.resultTitle, isLoss ? styles.defeatColor : styles.victoryColor]}>
            {resultTitle}
          </Text>

          {/* Profile row */}
          <View style={styles.card}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarDisc}>
                <Text style={styles.avatarEmoji}>{activeProfile?.avatar ?? '👤'}</Text>
              </View>
              <View>
                <Text style={styles.profileName}>{activeProfile?.name ?? 'Player'}</Text>
                <Text style={styles.profileLabel}>SOLO PROFILE</Text>
              </View>
            </View>

            {/* Favorite sticker slot */}
            <Pressable
              style={styles.favSlot}
              onPress={() => setPickerOpen(true)}
            >
              <Text style={styles.favLabel}>FAVORITE</Text>
              {favoriteSticker ? (
                <>
                  <View style={styles.favDisc}>
                    <Text style={styles.favEmoji}>{favoriteSticker.emoji}</Text>
                  </View>
                  <Text style={styles.favName} numberOfLines={1}>{favoriteSticker.name}</Text>
                </>
              ) : (
                <View style={styles.favDisc}>
                  <Text style={styles.favPrompt}>TAP{'\n'}TO SET</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Album tier progress */}
          <AlbumTierBadge
            eraId={albumProgress.eraId}
            uniqueCollected={albumProgress.uniqueCollected}
            totalUniqueStickers={albumProgress.totalUniqueStickers}
            percentComplete={albumProgress.percentComplete}
          />

          {/* Score box */}
          <View style={styles.card}>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreLabel}>THIS RUN</Text>
              <Text style={styles.scoreValue}>{roundScore.toLocaleString()}</Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreCol}>
              <Text style={styles.scoreLabel}>PROFILE BEST</Text>
              <Text style={[styles.scoreValue, isBetter && styles.newBest]}>
                {profileBest != null ? profileBest.toLocaleString() : '—'}
              </Text>
              {isBetter && <Text style={styles.newBestBadge}>NEW BEST!</Text>}
            </View>
          </View>

          {/* Sticker highlights */}
          {highlights.length > 0 && (
            <View style={styles.highlightsCard}>
              <Text style={styles.highlightsLabel}>TOP STICKERS</Text>
              <View style={styles.highlightsRow}>
                {highlights.map((sticker) => (
                  <View key={sticker.id} style={styles.highlightTile}>
                    <View style={[styles.highlightDisc, styles[`disc_${sticker.scarcityId}`]]}>
                      <Text style={styles.highlightEmoji}>{sticker.emoji}</Text>
                    </View>
                    <Text style={styles.highlightName} numberOfLines={2}>{sticker.name}</Text>
                    <Text style={styles.highlightCount}>×{albumCounts[sticker.id] ?? 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Reward sticker from this round */}
          {(rewardStickerId || rewardImageSource) && rewardStickerLabel ? (
            <View style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>WON THIS ROUND</Text>
              {rewardImageSource ? <Image source={rewardImageSource} style={styles.rewardImage} resizeMode="contain" /> : null}
              <Text style={styles.rewardName}>{rewardStickerLabel}{rewardStickerCount > 1 ? ` ×${rewardStickerCount}` : ''}</Text>
            </View>
          ) : null}

          <View style={{ height: 8 }} />

          <RecapButtons onPlayAgain={onPlayAgain} onMenu={onMenu} />
        </ScrollView>
      </LinearGradient>

      {/* Favorite sticker picker */}
      <Modal visible={pickerOpen} animationType="slide" transparent statusBarTranslucent>
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitle}>PICK YOUR FAVORITE</Text>
            {ownedStickers.length === 0 ? (
              <Text style={styles.pickerEmpty}>Win stickers in Solo to pick a favorite.</Text>
            ) : (
              <FlatList
                data={ownedStickers}
                keyExtractor={(item) => item.id}
                numColumns={4}
                style={{ maxHeight: 340 }}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.pickerTile,
                      item.id === favoriteStickerId && styles.pickerTileActive,
                    ]}
                    onPress={() => {
                      onSetFavoriteSticker?.(item.id);
                      setPickerOpen(false);
                    }}
                  >
                    <Text style={styles.pickerEmoji}>{item.emoji}</Text>
                    <Text style={styles.pickerName} numberOfLines={1}>{item.name}</Text>
                  </Pressable>
                )}
              />
            )}
            <Pressable style={styles.pickerClose} onPress={() => setPickerOpen(false)}>
              <Text style={styles.pickerCloseText}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },

  pageTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 4,
    color: theme.gold,
    ...theme.textShadow,
  },
  resultTitle: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.gold,
    ...theme.textShadow,
    textAlign: 'center',
    marginBottom: 4,
  },
  defeatColor: { color: '#ff4d1c' },
  victoryColor: { color: theme.gold },

  card: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(26,10,6,0.92)',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: theme.gold,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
  },

  // Profile
  profileLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarDisc: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a1408',
    borderWidth: 2,
    borderColor: theme.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 26 },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  profileLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.gold,
    opacity: 0.75,
    marginTop: 2,
  },

  // Favorite slot
  favSlot: {
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  favLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.gold,
    opacity: 0.8,
  },
  favDisc: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2a1408',
    borderWidth: 2,
    borderColor: theme.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favEmoji: { fontSize: 30 },
  favName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    maxWidth: 68,
  },
  favPrompt: {
    fontSize: 8,
    fontWeight: '900',
    color: theme.gold,
    opacity: 0.6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Score
  scoreCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  scoreDivider: {
    width: 2,
    height: 48,
    backgroundColor: '#3a2060',
    marginHorizontal: 8,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: theme.gold,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  newBest: { color: '#ffd86b' },
  newBestBadge: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#1a0a06',
    backgroundColor: theme.gold,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  // Highlights
  highlightsCard: {
    width: '100%',
    backgroundColor: 'rgba(26,10,6,0.92)',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: theme.gold,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  highlightsLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
    color: theme.gold,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  highlightTile: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  highlightDisc: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  disc_common: { backgroundColor: '#1a1a2e', borderColor: '#ffd86b' },
  disc_rare: { backgroundColor: '#1a0a2e', borderColor: '#a855f7' },
  disc_extremelyRare: { backgroundColor: '#0a1a2e', borderColor: '#00f0ff' },
  highlightEmoji: { fontSize: 28 },
  highlightName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    maxWidth: 64,
  },
  highlightCount: {
    fontSize: 9,
    fontWeight: '900',
    color: theme.gold,
    opacity: 0.7,
  },

  // Reward row
  rewardRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26,10,6,0.7)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rewardLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.gold,
    opacity: 0.7,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'right',
  },
  rewardImage: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },

  // Picker
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#1a0a06',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 3,
    borderColor: theme.gold,
    padding: 20,
    gap: 14,
  },
  pickerTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.gold,
    textAlign: 'center',
  },
  pickerEmpty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    paddingVertical: 20,
  },
  pickerTile: {
    flex: 1,
    margin: 4,
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    padding: 8,
  },
  pickerTileActive: {
    borderColor: theme.gold,
    backgroundColor: 'rgba(255,216,107,0.12)',
  },
  pickerEmoji: { fontSize: 28 },
  pickerName: {
    fontSize: 8,
    fontWeight: '700',
    color: '#ccc',
    textAlign: 'center',
  },
  pickerClose: {
    backgroundColor: 'rgba(255,216,107,0.15)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.gold,
    paddingVertical: 12,
    alignItems: 'center',
  },
  pickerCloseText: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.gold,
    letterSpacing: 2,
  },
});
