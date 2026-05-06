import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { StickerId } from '../../types';
import { getStickerById, getStickerRarityVisual } from '../../lib/stickerHelpers';

const styles = StyleSheet.create({
  emojiText:               { textAlign: 'center', includeFontPadding: false },
  rackStickerGlowShellMuted: { borderColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  rackStickerTile:         { width: 38, height: 38 },
  imageStickerTile:        {},
  textStickerTile:         {},
});

const customEmojiStyles = StyleSheet.create({
  stickerGlowShell:        { borderRadius: 999, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  boardStickerGlowShell:   { width: '100%', height: '100%' },
  rackStickerGlowShell:    { width: 44, height: 44 },
  largeStickerGlowShell:   { width: 80, height: 80 },
  emojiTile:               { borderRadius: 999, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', height: '100%' },
  boardEmojiTile:          {},
  rackEmojiTile:           {},
  mutedStickerTile:        { opacity: 0.45 },
  largeStickerTile:        { width: 76, height: 76 },
  stickerImage:            { width: '80%', height: '80%' },
  mutedStickerContent:     { opacity: 0.45 },
  emojiText:               { textAlign: 'center', includeFontPadding: false },
});

export function StickerTile({
  stickerId,
  backgroundColor,
  isBoardTile = false,
  muted = false,
  size = 'normal',
  variant = 'default',
}: {
  stickerId: StickerId;
  backgroundColor: string;
  isBoardTile?: boolean;
  muted?: boolean;
  size?: 'normal' | 'large';
  variant?: 'default' | 'rack' | 'naked';
}) {
  const sticker = getStickerById(stickerId);
  const isImageSticker = Boolean(sticker.imageSource);
  const isRackVariant = variant === 'rack';
  const isNaked = variant === 'naked';
  const rarityVisual = getStickerRarityVisual(sticker);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => { setImageFailed(false); }, [stickerId]);

  // Determine emoji font size based on context
  let emojiFontSize = 32;
  if (size === 'large') emojiFontSize = 52;
  else if (isRackVariant) emojiFontSize = 38;
  else if (isBoardTile) emojiFontSize = 28;

  if (isNaked) {
    return isImageSticker && !imageFailed ? (
      <Image source={sticker.imageSource} style={{ width: '100%', height: '100%' }} resizeMode="contain" onError={() => setImageFailed(true)} />
    ) : (
      <Text style={[styles.emojiText, { fontSize: emojiFontSize }]} numberOfLines={1} adjustsFontSizeToFit>{sticker.emoji ?? '★'}</Text>
    );
  }

  return (
    <View
      style={[
        customEmojiStyles.stickerGlowShell,
        isBoardTile ? customEmojiStyles.boardStickerGlowShell : customEmojiStyles.rackStickerGlowShell,
        isRackVariant && customEmojiStyles.rackStickerGlowShell,
        size === 'large' && customEmojiStyles.largeStickerGlowShell,
        isRackVariant ? styles.rackStickerGlowShellMuted : rarityVisual,
      ]}
    >
      <View
        style={[
        customEmojiStyles.emojiTile,
        isBoardTile ? customEmojiStyles.boardEmojiTile : customEmojiStyles.rackEmojiTile,
        { backgroundColor },
        isRackVariant && styles.rackStickerTile,
        isImageSticker ? styles.imageStickerTile : styles.textStickerTile,
        muted && customEmojiStyles.mutedStickerTile,
        size === 'large' && customEmojiStyles.largeStickerTile,
        ]}
      >
        {isImageSticker && !imageFailed ? (
          <Image
            source={sticker.imageSource}
            style={[
              customEmojiStyles.stickerImage,
              muted && customEmojiStyles.mutedStickerContent,
            ]}
            resizeMode="contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Text
            style={[
              customEmojiStyles.emojiText,
              { fontSize: emojiFontSize },
              muted && customEmojiStyles.mutedStickerContent,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {sticker.emoji ?? '★'}
          </Text>
        )}
      </View>
    </View>
  );
}
