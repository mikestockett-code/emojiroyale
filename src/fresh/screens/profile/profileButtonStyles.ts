import { StyleSheet } from 'react-native';

export const profileButtonStyles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Primary "Create Profile" button — gold ring, dark fill
  primaryButton: {
    alignSelf: 'center',
    minWidth: 190,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: '#ffd86b',
    backgroundColor: '#3a1000',
    alignItems: 'center',
    shadowColor: '#ffd86b',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  primaryButtonDisabled: {
    opacity: 0.38,
  },
  primaryButtonText: {
    color: '#ffd86b',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: '#3a1a00',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },

  // Small row-action buttons
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,216,107,0.45)',
    backgroundColor: '#2a1408',
  },
  smallButtonActive: {
    backgroundColor: '#ffd86b',
    borderColor: '#5a3300',
  },
  smallButtonSecondary: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  smallButtonText: {
    color: '#ffd86b',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  smallButtonTextActive: {
    color: '#1a0a06',
  },

  // Delete button
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7f1d1d',
    backgroundColor: '#2d0808',
  },
  deleteButtonText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.75,
  },
});
