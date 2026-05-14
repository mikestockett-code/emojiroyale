import { StyleSheet } from 'react-native';
import { theme } from '../shared/luxuryTheme';

export const styles = StyleSheet.create({
  journeyContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  setupEyebrow: {
    color: theme.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
    ...theme.smallTextShadow,
  },
  journeyTitle: {
    ...theme.title,
    marginTop: 4,
    color: theme.creamText,
    fontSize: 34,
    letterSpacing: 0,
  },
  journeyStageText: {
    marginTop: 4,
    color: theme.goldText,
    fontSize: 15,
    fontWeight: '900',
  },
  journeyCpuFrame: {
    marginTop: 24,
    width: 158,
    height: 158,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.goldBorderStrong,
    backgroundColor: theme.darkGlass,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.gold,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  journeyCpuImage: {
    width: 132,
    height: 132,
  },
  journeyButtonStack: {
    width: '100%',
    maxWidth: 310,
    gap: 12,
    marginTop: 30,
  },
  journeyDisabledButton: {
    opacity: 0.36,
  },
  journeyIntroOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: theme.darkScrim,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  journeyIntroPage: {
    width: '100%',
    height: '78%',
  },
  journeyIntroButton: {
    minWidth: 240,
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.gold,
    backgroundColor: theme.warmBrown,
    paddingHorizontal: 18,
    paddingVertical: 13,
    alignItems: 'center',
  },
  journeyIntroButtonText: {
    color: theme.goldText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  pressed: {
    opacity: 0.78,
  },
});
