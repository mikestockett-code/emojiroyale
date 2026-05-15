import React, { useEffect, useRef } from 'react';
import { Animated, Image, PanResponder, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SharedSubmenuShell } from '../SharedSubmenuShell';
import type { ImageSourcePropType } from '../../../types';
import { useAudioContext } from '../../audio/AudioContext';
import type { CarouselCard } from './CarouselCardDeck';
import { styles } from './CarouselSubmenuScreen.styles';

const START_IMG = require('../../../../assets/buttons/start.png');
const CARD_W = 324;
const SIDE_OFFSET = Math.round(CARD_W * 0.36);

type DotItem = string | { id: string };

type Props = {
  backgroundSource: ImageSourcePropType;
  bottomNav: React.ReactNode;
  cards: CarouselCard[];
  selectedCardId: string;
  onSelectCard: (id: string) => void;
  selectableCardIds?: string[];
  getCardOpacity?: (cardId: string) => number;
  dots?: DotItem[];
  selectedDotId?: string;
  statusText?: string | null;
  startDisabled?: boolean;
  startMessage?: string | null;
  messageVariant?: 'plain' | 'pill';
  onStart?: () => void;
};

function dotId(dot: DotItem) {
  return typeof dot === 'string' ? dot : dot.id;
}

function CarouselDeck({
  cards,
  selectedCardId,
  onSelectCard,
  selectableCardIds = cards.map((card) => card.id),
  getCardOpacity,
}: Pick<Props, 'cards' | 'selectedCardId' | 'onSelectCard' | 'selectableCardIds' | 'getCardOpacity'>) {
  const { playSound } = useAudioContext();
  const selectedIndex = Math.max(0, cards.findIndex((card) => card.id === selectedCardId));

  const selectedCardIdRef = useRef(selectedCardId);
  const onSelectCardRef = useRef(onSelectCard);
  useEffect(() => { selectedCardIdRef.current = selectedCardId; }, [selectedCardId]);
  useEffect(() => { onSelectCardRef.current = onSelectCard; }, [onSelectCard]);

  const anims = useRef(
    cards.map((_, index) => {
      const offset = index - selectedIndex;
      return {
        x: new Animated.Value(Math.max(-1, Math.min(1, offset)) * SIDE_OFFSET),
        y: new Animated.Value(offset === 0 ? -26 : 18),
        scale: new Animated.Value(offset === 0 ? 1 : 0.78),
      };
    }),
  ).current;

  useEffect(() => {
    const targets = cards.map((_, index) => {
      const offset = index - selectedIndex;
      const isCenter = offset === 0;
      return Animated.parallel([
        Animated.timing(anims[index].x, {
          toValue: Math.max(-1, Math.min(1, offset)) * SIDE_OFFSET,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(anims[index].y, { toValue: isCenter ? -26 : 18, duration: 220, useNativeDriver: true }),
        Animated.timing(anims[index].scale, { toValue: isCenter ? 1 : 0.78, duration: 220, useNativeDriver: true }),
      ]);
    });
    Animated.parallel(targets).start();
  }, [anims, cards, selectedIndex]);

  const swipeLock = useRef(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy) * 0.8,
      onPanResponderRelease: (_, { dx, vx }) => {
        if (swipeLock.current) return;
        if (Math.abs(dx) <= 18 && Math.abs(vx) <= 0.2) return;

        swipeLock.current = true;
        setTimeout(() => { swipeLock.current = false; }, 300);

        const currentIdx = cards.findIndex((card) => card.id === selectedCardIdRef.current);
        const nextIdx = dx < 0
          ? (currentIdx + 1) % cards.length
          : (currentIdx - 1 + cards.length) % cards.length;

        if (nextIdx === currentIdx) return;

        playSound('button');
        onSelectCardRef.current(cards[nextIdx].id);
      },
    }),
  ).current;

  return (
    <View style={styles.cardDeckContainer} {...panResponder.panHandlers}>
      {cards.map((card, index) => {
        const isSelected = card.id === selectedCardId;
        const isSelectable = selectableCardIds.includes(card.id);
        const offset = index - selectedIndex;
        const opacity = getCardOpacity?.(card.id) ?? (isSelectable ? 1 : 0.48);

        return (
          <Animated.View
            key={card.id}
            style={[
              styles.cardDeckCard,
              {
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
                onSelectCard(card.id);
              }}
              style={styles.cardTouchableFixed}
            >
              <View
                style={[
                  styles.cardWrap,
                  { opacity },
                  isSelected
                    ? {
                        borderColor: card.borderColor,
                        shadowColor: card.glowColor,
                      }
                    : styles.cardWrapUnselected,
                  isSelected && styles.cardWrapSelected,
                ]}
              >
                <Image source={card.cardImg} style={styles.cardImage} resizeMode="cover" />
                {isSelected && (
                  <View style={[styles.cardCheckBadge, { backgroundColor: card.glowColor }]}>
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

export function CarouselSubmenuScreen({
  backgroundSource,
  bottomNav,
  cards,
  selectedCardId,
  onSelectCard,
  selectableCardIds,
  getCardOpacity,
  dots,
  selectedDotId,
  statusText,
  startDisabled = false,
  startMessage = null,
  messageVariant = 'plain',
  onStart,
}: Props) {
  return (
    <SharedSubmenuShell backgroundSource={backgroundSource} rootStyle={styles.root} bottomNav={bottomNav}>
      <View style={styles.deckArea}>
        <View style={styles.deckWrap}>
          <CarouselDeck
            cards={cards}
            selectedCardId={selectedCardId}
            onSelectCard={onSelectCard}
            selectableCardIds={selectableCardIds}
            getCardOpacity={getCardOpacity}
          />
          {dots ? (
            <View style={styles.dotRow}>
              {dots.map((dot) => {
                const id = dotId(dot);
                return <View key={id} style={[styles.dot, selectedDotId === id && styles.dotActive]} />;
              })}
            </View>
          ) : null}
          {statusText ? <Text style={styles.statusText}>{statusText}</Text> : null}
        </View>
      </View>

      <Pressable
        onPress={onStart}
        style={({ pressed }) => [
          styles.startBtn,
          startDisabled && styles.startDisabled,
          pressed && !startDisabled && styles.startPressed,
        ]}
      >
        <Image source={START_IMG} style={styles.startImg} resizeMode="contain" />
      </Pressable>

      {startMessage ? (
        <View style={styles.messageWrapAbsolute}>
          <Text style={[styles.messageText, messageVariant === 'pill' && styles.messageTextPill]}>
            {startMessage}
          </Text>
        </View>
      ) : null}
    </SharedSubmenuShell>
  );
}
