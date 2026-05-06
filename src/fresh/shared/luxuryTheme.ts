import { StyleSheet } from 'react-native';

export const TIER_COLORS = {
  common: '#ffd86b',
  rare: '#a855f7',
  epic: '#00f0ff',
  legendary: '#ff00aa',
} as const;

export const theme = {
  gold: '#ffd86b',
  darkGold: '#5a3300',
  deepBrown: '#1a0a06',
  warmBrown: '#2a1408',
  ringShadow: '#3a1a00',
  purpleAccent: '#7B2FBE',
  textShadow: {
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  cardRing: {
    borderRadius: 22,
    padding: 3,
    shadowOpacity: 0.7,
    shadowRadius: 38,
    shadowOffset: { width: 0, height: 14 },
    elevation: 20,
  },
  cardInner: {
    borderRadius: 19,
    padding: 16,
    overflow: 'hidden',
    alignItems: 'center' as const,
    gap: 8,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '900' as const,
    letterSpacing: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: '900' as const,
    color: '#ffd86b',
    ...StyleSheet.flatten([{ textShadowColor: '#3a1a00', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 }]),
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center' as const,
  },
};

export type Tier = keyof typeof TIER_COLORS;
