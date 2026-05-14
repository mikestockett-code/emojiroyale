import { StyleSheet } from 'react-native';
import { theme } from '../luxuryTheme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  deckArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  deckWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.mutedDot,
  },
  dotActive: {
    width: 18,
    backgroundColor: theme.gold,
  },
  statusText: {
    marginTop: -16,
    color: theme.goldText,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    ...theme.textShadow,
  },
  startBtn: {
    position: 'absolute',
    bottom: '18%',
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startBtnFlow: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  startImg: {
    width: 210,
    height: 210 * (437 / 1306),
    transform: [{ perspective: 400 }, { rotateX: '25deg' }],
  },
  startDisabled: {
    opacity: 0.48,
  },
  messageWrap: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  messageWrapAbsolute: {
    position: 'absolute',
    bottom: '14%',
    alignSelf: 'center',
  },
  messageText: {
    maxWidth: 320,
    textAlign: 'center',
    color: theme.gold,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
    ...theme.textShadow,
    textShadowRadius: 1,
  },
  messageTextPill: {
    fontSize: 13,
    fontWeight: '800',
    backgroundColor: theme.darkToast,
    borderRadius: 12,
    paddingHorizontal: theme.input.paddingHorizontal,
    paddingVertical: 8,
    overflow: 'hidden',
  },
});
