import type { ImageSourcePropType } from '../../../types';

export type CarouselCard = {
  id: string;
  cardImg: ImageSourcePropType;
  glowColor: string;
  borderColor: string;
};

export const SOLO_MODE_CARDS: CarouselCard[] = [
  { id: 'practice', cardImg: require('../../../../assets/Cards/caysenmain.png'), glowColor: '#22c55e', borderColor: '#4ade80' },
  { id: 'epicLite', cardImg: require('../../../../assets/Cards/phoenixside.png'), glowColor: '#3b82f6', borderColor: '#60a5fa' },
  { id: 'epic', cardImg: require('../../../../assets/Cards/pollyside.png'), glowColor: '#a855f7', borderColor: '#c084fc' },
];

export const PASS_PLAY_WAGER_CARDS: CarouselCard[] = [
  { id: 'none', cardImg: require('../../../../assets/Cards/NoWager.png'), glowColor: '#22c55e', borderColor: '#4ade80' },
  { id: 'epic', cardImg: require('../../../../assets/Cards/EpicWagerCard.png'), glowColor: '#3b82f6', borderColor: '#60a5fa' },
  { id: 'legendary', cardImg: require('../../../../assets/Cards/LegendaryNormal.png'), glowColor: '#a855f7', borderColor: '#c084fc' },
];

export const GOLDEN_PHOENIX_WAGER_CARDS: CarouselCard[] = [
  { id: 'legendary', cardImg: require('../../../../assets/Cards/GoldenPhoenixMode.png'), glowColor: '#f59e0b', borderColor: '#fde68a' },
];
