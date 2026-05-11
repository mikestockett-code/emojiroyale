import React from 'react';
import { SwipeCardDeck } from './SwipeCardDeck';

const WAGER_CARDS = [
  { id: 'none', cardImg: require('../../../assets/Cards/NoWager.png'), glowColor: '#22c55e', borderColor: '#4ade80' },
  { id: 'epic', cardImg: require('../../../assets/Cards/EpicWagerCard.png'), glowColor: '#3b82f6', borderColor: '#60a5fa' },
  { id: 'legendary', cardImg: require('../../../assets/Cards/LegendaryNormal.png'), glowColor: '#a855f7', borderColor: '#c084fc' },
];

const GOLDEN_PHOENIX_WAGER_CARDS = [
  { id: 'legendary', cardImg: require('../../../assets/Cards/GoldenPhoenixMode.png'), glowColor: '#f59e0b', borderColor: '#fde68a' },
];

type WagerCardDeckProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  variant?: 'default' | 'goldenPhoenix';
};

export default function WagerCardDeck({ selectedId, onSelect, variant = 'default' }: WagerCardDeckProps) {
  const cards = variant === 'goldenPhoenix' ? GOLDEN_PHOENIX_WAGER_CARDS : WAGER_CARDS;

  return (
    <SwipeCardDeck
      cards={cards}
      selectedId={selectedId}
      onSelect={onSelect}
      containerStyle={{ overflow: 'visible', alignSelf: 'center' }}
      cardPositionTop={30}
      cardBorderRadius={20}
      touchableStyleMode="fixed"
      cardWrapUnselectedStyle={{
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOpacity: 0.65,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
      }}
      cardWrapSelectedStyle={{
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
      }}
    />
  );
}
