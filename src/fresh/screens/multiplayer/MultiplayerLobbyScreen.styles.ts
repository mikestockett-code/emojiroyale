import { StyleSheet } from 'react-native';
import { theme } from '../../shared/luxuryTheme';
import { tempButtonStyles } from '../../shared/tempButtonStyles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  title: {
    ...theme.title,
    fontSize: 30,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.subtitle,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  panel: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.darkGlass,
    borderWidth: 1,
    borderColor: theme.goldBorderStrong,
    borderRadius: 14,
    padding: 18,
    gap: 14,
  },
  sectionTitle: {
    color: theme.gold,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  bodyText: {
    color: theme.mutedText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  codeText: {
    color: theme.gold,
    fontSize: 44,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 4,
    ...theme.textShadow,
  },
  input: {
    backgroundColor: theme.onlineInput,
    borderWidth: 1,
    borderColor: theme.goldBorderSoft,
    borderRadius: 14,
    color: theme.creamText,
    minHeight: 52,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
    paddingHorizontal: 14,
  },
  actionButton: {
    ...tempButtonStyles.primaryButton,
    minHeight: 48,
    minWidth: '100%',
    backgroundColor: theme.warmBrown,
  },
  actionButtonText: {
    ...tempButtonStyles.primaryButtonText,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.38,
  },
  pressed: {
    ...theme.pressed,
  },
  errorText: {
    color: theme.errorText,
    textAlign: 'center',
    fontWeight: '700',
  },
});
