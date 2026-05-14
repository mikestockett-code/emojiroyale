import { StyleSheet } from 'react-native';
import { theme } from '../luxuryTheme';

const fullWidth = {
  width: '100%' as const,
};

export const gameResultOverlayStyles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,2,2,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  cardRing: {
    ...fullWidth,
    maxWidth: 360,
    ...theme.cardRing,
    zIndex: 12,
  },
  cardMotion: {
    ...fullWidth,
    alignItems: 'center',
    zIndex: 12,
  },
  heroGlow: {
    position: 'absolute',
    width: 330,
    height: 330,
    borderRadius: 165,
    zIndex: 6,
  },
  cardInner: {
    ...theme.cardInner,
  },
  shineLine: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 2,
    opacity: 0.75,
    shadowColor: '#fff2a8',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  kicker: {
    ...theme.kicker,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  title: {
    ...theme.title,
  },
  subtitle: {
    ...theme.subtitle,
  },
  trophyWrap: {
    ...fullWidth,
  },
  btnStack: {
    ...fullWidth,
    gap: 8,
  },
});
