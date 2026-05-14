// TEMP BUTTON QUARANTINE
// These are coded text-button styles that should be deleted as soon as the
// matching PNG button assets exist. Keep new button work out of luxuryTheme.
import { StyleSheet } from 'react-native';
import { theme } from './luxuryTheme';

export const tempButtonStyles = StyleSheet.create({
  primaryButton: {
    alignSelf: 'center',
    minWidth: 190,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: theme.gold,
    backgroundColor: theme.warmBrown,
    alignItems: 'center',
    shadowColor: theme.gold,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  primaryButtonText: {
    color: theme.gold,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,216,107,0.45)',
    backgroundColor: theme.warmBrown,
  },
  smallButtonText: {
    color: theme.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
