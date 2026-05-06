import React from 'react';
import { SwipeCardDeck } from './SwipeCardDeck';

const BATTLE_CARDS = [
  { id: 'epicDuel', cardImg: require('../../../assets/Cards/BattleCards/epicduel.png'), glowColor: '#f97316', borderColor: '#fb923c' },
  { id: 'legendary', cardImg: require('../../../assets/Cards/BattleCards/ld.png'), glowColor: '#a855f7', borderColor: '#c084fc' },
  { id: 'platinum', cardImg: require('../../../assets/Cards/BattleCards/platinum.png'), glowColor: '#60a5fa', borderColor: '#93c5fd' },
];

type BattleModeCardDeckProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function BattleModeCardDeck({ selectedId, onSelect }: BattleModeCardDeckProps) {
  return (
    <SwipeCardDeck
      cards={BATTLE_CARDS}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
