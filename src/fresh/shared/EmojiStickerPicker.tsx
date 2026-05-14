import React from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import type { AlbumStickerDefinition } from '../album/album.types';
import { emojiStickerPickerStyles as styles } from './EmojiStickerPicker.styles';

type Props = {
  visible: boolean;
  title?: string;
  emptyText?: string;
  stickers: AlbumStickerDefinition[];
  selectedStickerId?: string | null;
  onSelectSticker: (stickerId: string) => void;
  onClose: () => void;
};

export function EmojiStickerPicker({
  visible,
  title = 'PICK YOUR EMOJI STICKER',
  emptyText = 'Win Emoji Stickers to pick a favorite.',
  stickers,
  selectedStickerId,
  onSelectSticker,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>{title}</Text>
          {stickers.length === 0 ? (
            <Text style={styles.empty}>{emptyText}</Text>
          ) : (
            <FlatList
              data={stickers}
              keyExtractor={(item) => item.id}
              numColumns={4}
              style={styles.list}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.gridTile, item.id === selectedStickerId && styles.gridTileActive]}
                  onPress={() => onSelectSticker(item.id)}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                </Pressable>
              )}
            />
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>CLOSE</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
