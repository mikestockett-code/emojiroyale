import { StyleSheet } from 'react-native';
import { CARD_SIZE } from '../../power-selection/powerCardStyles';
import { theme } from '../../../fresh/shared/luxuryTheme';

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
  powerSetupHeader: {
    alignItems: 'center',
    paddingTop: 8,
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
});
