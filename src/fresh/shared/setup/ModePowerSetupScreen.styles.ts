import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../luxuryTheme';

const W = Dimensions.get('window').width;
export const CARD_SIZE = (W - 20) / 3 * 0.9;
export const EPI_CARD_SIZE = (W - 26) / 4;

export const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  setupScroll: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  powerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 105,
    paddingBottom: 8,
  },
  powerSetupSubtitle: {
    color: theme.gold,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    ...theme.smallTextShadow,
    marginTop: 4,
    marginBottom: 12,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  slotWrapper: {
    width: CARD_SIZE,
    aspectRatio: 1,
    borderRadius: 12,
    shadowColor: theme.purpleAccent,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  slotImg: {
    width: '100%',
    height: '100%',
  },
  startImageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1 }],
  },
  startImageButtonPressed: {
    opacity: 0.82,
  },
  startImage: {
    width: 210,
    height: 210 * (437 / 1306),
    transform: [{ perspective: 400 }, { rotateX: '25deg' }],
  },
  powerCardWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  powerCardDimmed: {
    opacity: 0.32,
  },
  powerCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: theme.purpleAccent,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  powerCardImage: {
    width: '100%',
    height: '100%',
  },
  powerBadge: {
    position: 'absolute',
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.gold,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  powerBadgeLeft: {
    left: 6,
  },
  powerBadgeRight: {
    right: 6,
  },
  powerBadgeAdd: {
    backgroundColor: '#1a6e2e',
  },
  powerBadgeRemove: {
    backgroundColor: '#7a0000',
  },
  powerBadgeDim: {
    opacity: 0.3,
  },
  powerBadgePressed: {
    opacity: 0.75,
  },
  powerBadgeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
    marginTop: -1,
  },
  powerCardLabel: {
    color: theme.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  powerCardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  powerSectionHead: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  powerSectionLabel: {
    color: theme.gold,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  powerSectionSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
