import { StyleSheet } from 'react-native';

export const profileScreenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0501',
  },
  content: {
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    minWidth: 84,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#5a3300',
    backgroundColor: '#2a1408',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffd86b',
    fontSize: 15,
    fontWeight: '900',
  },
  title: {
    color: '#ffd86b',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: '#3a1a00',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerSpacer: {
    width: 84,
  },
});
