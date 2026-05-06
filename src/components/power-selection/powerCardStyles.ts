import { Dimensions, StyleSheet } from 'react-native';

const W = Dimensions.get('window').width;
export const CARD_SIZE     = (W - 20) / 3 * 0.9;
export const EPI_CARD_SIZE = (W - 26) / 4;

export const cardStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  dimmed: {
    opacity: 0.32,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7B2FBE',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeAdd: {
    backgroundColor: '#1a6e2e',
  },
  badgeRemove: {
    backgroundColor: '#7a0000',
  },
  badgeDim: {
    opacity: 0.3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
    marginTop: -1,
  },
  cardLabel: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  sectionHead: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  sectionLabel: {
    color: '#ffd700',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sectionSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
