import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AlbumStickerDefinition } from '../album/album.types';
import { theme } from './luxuryTheme';

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
      <View style={styles.overlay}>
        <View style={styles.sheet}>
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
                  style={[
                    styles.tile,
                    item.id === selectedStickerId && styles.tileActive,
                  ]}
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.68)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fffdf7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 4,
    borderColor: '#f2b76a',
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#8c3f22',
    textAlign: 'center',
  },
  empty: {
    fontSize: 14,
    color: 'rgba(28,21,17,0.55)',
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '800',
  },
  list: {
    maxHeight: 340,
  },
  tile: {
    flex: 1,
    margin: 5,
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#fffaf0',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#eadfd2',
  },
  tileActive: {
    borderColor: '#fb923c',
    backgroundColor: '#fff3df',
    shadowColor: theme.gold,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 8,
    fontWeight: '900',
    color: '#334155',
    maxWidth: 62,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
