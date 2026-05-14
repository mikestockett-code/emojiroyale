import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { FreshProfile } from '../profile/types';
import type { AlbumStickerDefinition } from '../album/album.types';
import { luxuryResultStyles as styles } from '../shared/luxuryResultStyles';
import { EmojiStickerPicker } from '../shared/EmojiStickerPicker';

type Props = {
  activeProfile?: FreshProfile | null;
  favoriteSticker: AlbumStickerDefinition | null;
  favoriteStickerId?: string;
  ownedStickers: AlbumStickerDefinition[];
  pickerOpen: boolean;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onSetFavoriteSticker?: (stickerId: string | null) => void;
};

export function SoloRecapProfile({
  activeProfile,
  favoriteSticker,
  favoriteStickerId,
  ownedStickers,
  pickerOpen,
  onOpenPicker,
  onClosePicker,
  onSetFavoriteSticker,
}: Props) {
  return (
    <>
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

        <Pressable style={styles.favSlot} onPress={onOpenPicker}>
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

      <EmojiStickerPicker
        visible={pickerOpen}
        stickers={ownedStickers}
        selectedStickerId={favoriteStickerId}
        emptyText="Win Emoji Stickers in Solo to pick a favorite."
        onSelectSticker={(stickerId) => {
          onSetFavoriteSticker?.(stickerId);
          onClosePicker();
        }}
        onClose={onClosePicker}
      />
    </>
  );
}
