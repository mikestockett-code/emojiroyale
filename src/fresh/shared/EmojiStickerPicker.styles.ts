import { StyleSheet } from 'react-native';
import { theme } from './luxuryTheme';
import { tempButtonStyles } from './tempButtonStyles';

const pickerColors = {
  brown: '#6f4b2a',
  brownDeep: '#5a3e20',
  parchmentCream: '#fff7db',
  parchmentLight: '#efe2c5',
  parchment: '#efe0bd',
  brownBorder: 'rgba(112,79,43,0.44)',
} as const;

export const emojiStickerPickerStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.68)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: pickerColors.parchmentCream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 4,
    borderColor: theme.gold,
    padding: 20,
    gap: 14,
  },
  title: {
    ...theme.kicker,
    color: pickerColors.brown,
    textAlign: 'center',
  },
  empty: {
    fontSize: 14,
    fontWeight: '800',
    color: pickerColors.brownDeep,
    textAlign: 'center',
    paddingVertical: 20,
  },
  list: {
    maxHeight: 340,
  },
  gridTile: {
    flex: 1,
    margin: 5,
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: pickerColors.parchmentLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: pickerColors.brownBorder,
  },
  gridTileActive: {
    borderColor: theme.gold,
    backgroundColor: pickerColors.parchment,
    shadowColor: theme.gold,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 8,
    fontWeight: '900',
    color: pickerColors.brownDeep,
    maxWidth: 62,
    textAlign: 'center',
  },
  closeButton: {
    ...tempButtonStyles.primaryButton,
    minHeight: 58,
    justifyContent: 'center',
  },
  closeText: {
    ...tempButtonStyles.primaryButtonText,
    fontSize: 20,
  },
});
