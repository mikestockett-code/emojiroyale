import React from 'react';
import { SwipeCardDeck } from './SwipeCardDeck';

const MODE_CARDS = [
  { id: 'practice', cardImg: require('../../../assets/Cards/caysenmain.png'), glowColor: '#22c55e', borderColor: '#4ade80' },
  { id: 'epicLite', cardImg: require('../../../assets/Cards/phoenixside.png'), glowColor: '#3b82f6', borderColor: '#60a5fa' },
  { id: 'epic', cardImg: require('../../../assets/Cards/pollyside.png'), glowColor: '#a855f7', borderColor: '#c084fc' },
];

type SoloModeCardDeckProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  playSound: () => void;
  selectableIds?: string[];
};

export function SoloModeCardDeck({
  selectedId,
  onSelect,
  playSound,
  selectableIds = MODE_CARDS.map((mode) => mode.id),
}: SoloModeCardDeckProps) {
  return (
    <SwipeCardDeck
      cards={MODE_CARDS}
      selectedId={selectedId}
      onSelect={onSelect}
      selectableIds={selectableIds}
      onSwipeSelect={() => playSound()}
      getCardOpacity={(cardId) => (selectableIds.includes(cardId) ? 1 : 0.48)}
    />
  );
}
