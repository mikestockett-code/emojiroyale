import { StyleSheet } from 'react-native';
import { onlineTheme } from '../../multiplayer/onlineTheme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: onlineTheme.background,
  },
  title: {
    color: onlineTheme.gold,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  body: {
    color: onlineTheme.mutedText,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: onlineTheme.gold,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: onlineTheme.background,
    fontWeight: '900',
  },
  turnOverlay: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 86,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: onlineTheme.panelBorder,
    backgroundColor: onlineTheme.panelStrong,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  turnText: {
    color: onlineTheme.text,
    textAlign: 'center',
    fontWeight: '900',
  },
});
