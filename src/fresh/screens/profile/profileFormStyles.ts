import { StyleSheet } from 'react-native';

export const profileFormStyles = StyleSheet.create({
  sectionBlock: {
    gap: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(255,216,107,0.55)',
    backgroundColor: '#2a1408',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionLabel: {
    color: '#ffd86b',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  pickerShell: {
    backgroundColor: '#2a1408',
    borderWidth: 2,
    borderColor: 'rgba(255,216,107,0.55)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  picker: {
    height: 52,
    color: '#fff',
    backgroundColor: '#2a1408',
  },
  helperText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  selectorShell: {
    minHeight: 52,
    backgroundColor: '#2a1408',
    borderWidth: 2,
    borderColor: 'rgba(255,216,107,0.55)',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorValue: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  selectorModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,2,2,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  selectorModalCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: 420,
    backgroundColor: '#160803',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffd86b',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },
  selectorList: {
    maxHeight: 300,
  },
  selectorOption: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2a1408',
    borderWidth: 1.5,
    borderColor: 'rgba(255,216,107,0.25)',
    marginBottom: 10,
  },
  selectorOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 15,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '700',
  },

  // Avatar Options
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarOption: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,216,107,0.3)',
    backgroundColor: '#2a1408',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: {
    borderColor: '#ffd86b',
    backgroundColor: '#3d1e0a',
  },
  avatarOptionText: {
    fontSize: 24,
  },

  // Color Options
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    minWidth: 88,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderColor: '#ffd86b',
    borderWidth: 2.5,
    transform: [{ scale: 1.04 }],
  },
  colorOptionText: {
    fontSize: 13,
    fontWeight: '900',
  },
});
