import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioContext } from '../../fresh/audio/AudioContext';

const CARD_W = 324;
const CARD_H = 445;
const SIDE_OFFSET = Math.round(CARD_W * 0.36);

export type SwipeDeckCard = {
  id: string;
  cardImg: any;
  glowColor: string;
  borderColor: string;
};

type Props = {
  cards: SwipeDeckCard[];
  selectedId: string;
  onSelect: (id: string) => void;
  selectableIds?: string[];
  onSwipeSelect?: (id: string) => void;
  onPressSelect?: (id: string) => void;
  getCardOpacity?: (cardId: string) => number;
  containerStyle?: object;
  cardWrapStyle?: object;
  cardWrapSelectedStyle?: object;
  cardWrapUnselectedStyle?: object;
  cardPositionTop?: number;
  cardBorderRadius?: number;
  touchableStyleMode?: 'fill' | 'fixed';
};

export function SwipeCardDeck({
  cards,
  selectedId,
  onSelect,
  selectableIds = cards.map((card) => card.id),
  onSwipeSelect,
  onPressSelect,
  getCardOpacity,
  containerStyle,
  cardWrapStyle,
  cardWrapSelectedStyle,
  cardWrapUnselectedStyle,
  cardPositionTop = 0,
  cardBorderRadius = 18,
  touchableStyleMode = 'fill',
}: Props) {
  const { playSound } = useAudioContext();
  const selectedIndex = cards.findIndex((card) => card.id === selectedId);

  const selectedIdRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  const onSwipeSelectRef = useRef(onSwipeSelect);
  const selectableIdsRef = useRef(selectableIds);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { onSwipeSelectRef.current = onSwipeSelect; }, [onSwipeSelect]);
  useEffect(() => { selectableIdsRef.current = selectableIds; }, [selectableIds]);

  const anims = useRef(
    cards.map((_, index) => {
      const offset = index - selectedIndex;
      return {
        x: new Animated.Value(offset * SIDE_OFFSET),
        y: new Animated.Value(offset === 0 ? -26 : 18),
        scale: new Animated.Value(offset === 0 ? 1.0 : 0.78),
      };
    }),
  ).current;

  useEffect(() => {
    const targets = cards.map((_, index) => {
      const offset = index - selectedIndex;
      const visualX = Math.max(-1, Math.min(1, offset)) * SIDE_OFFSET;
      const isCenter = offset === 0;
      return Animated.parallel([
        Animated.timing(anims[index].x, { toValue: visualX, duration: 220, useNativeDriver: true }),
        Animated.timing(anims[index].y, { toValue: isCenter ? -26 : 18, duration: 220, useNativeDriver: true }),
        Animated.timing(anims[index].scale, { toValue: isCenter ? 1.0 : 0.78, duration: 220, useNativeDriver: true }),
      ]);
    });
    Animated.parallel(targets).start();
  }, [anims, cards, selectedIndex]);

  const touchableStyle = useMemo(
    () => (touchableStyleMode === 'fixed' ? styles.touchableFixed : styles.touchableFill),
    [touchableStyleMode],
  );

  const swipeLock = useRef(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy) * 0.8,
      onPanResponderRelease: (_, { dx, vx }) => {
        if (swipeLock.current) return;
        const swipe = Math.abs(dx) > 18 || Math.abs(vx) > 0.2;
        if (!swipe) return;

        swipeLock.current = true;
        setTimeout(() => { swipeLock.current = false; }, 300);

        const currentIdx = cards.findIndex((card) => card.id === selectedIdRef.current);
        const nextIdx = dx < 0
          ? (currentIdx + 1) % cards.length
          : (currentIdx - 1 + cards.length) % cards.length;

        if (nextIdx === currentIdx) return;

        const nextId = cards[nextIdx].id;
        playSound('button');
        onSwipeSelectRef.current?.(nextId);
        onSelectRef.current(nextId);
      },
    }),
  ).current;

  return (
    <View style={[styles.deckContainer, containerStyle]} {...panResponder.panHandlers}>
      {cards.map((card, index) => {
        const isSelected = card.id === selectedId;
        const isSelectable = selectableIds.includes(card.id);
        const offset = index - selectedIndex;
        const opacity = getCardOpacity?.(card.id) ?? 1;

        return (
          <Animated.View
            key={card.id}
            style={[
              styles.deckCard,
              {
                top: cardPositionTop,
                zIndex: isSelected ? 10 : Math.abs(offset) === 1 ? 4 : 2,
                transform: [
                  { translateX: anims[index].x },
                  { translateY: anims[index].y },
                  { scale: anims[index].scale },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => {
                playSound('button');
                onPressSelect?.(card.id);
                onSelect(card.id);
              }}
              style={touchableStyle}
            >
              <View
                style={[
                  styles.cardWrap,
                  { borderRadius: cardBorderRadius, opacity },
                  isSelected
                    ? {
                        borderColor: card.borderColor,
                        borderWidth: 2.5,
                        shadowColor: card.glowColor,
                        shadowOpacity: 1,
                        shadowRadius: 26,
                      }
                    : cardWrapUnselectedStyle,
                  cardWrapStyle,
                  isSelected ? cardWrapSelectedStyle : null,
                ]}
              >
                <Image source={card.cardImg} style={styles.cardImage} resizeMode="cover" />
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: card.glowColor }]}>
                    <MaterialIcons name="check" size={14} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  deckContainer: {
    width: CARD_W,
    height: CARD_H + 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckCard: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
  },
  touchableFill: {
    flex: 1,
  },
  touchableFixed: {
    width: CARD_W,
    height: CARD_H,
  },
  cardWrap: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
