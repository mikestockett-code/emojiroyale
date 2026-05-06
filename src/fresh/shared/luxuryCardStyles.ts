import { StyleSheet } from 'react-native';
import { theme } from './luxuryTheme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },

  resultTitle: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.gold,
    ...theme.textShadow,
  },
  defeatColor: { color: '#ff4d1c' },
  victoryColor: { color: theme.gold },

  resultSub: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.gold,
    marginTop: 2,
    marginBottom: 20,
    ...theme.textShadow,
  },

  scoreBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(26,10,6,0.92)',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: theme.gold,
    shadowOpacity: 0.75,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  scoreDivider: {
    width: 2,
    backgroundColor: '#3a2060',
    marginVertical: 4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: theme.gold,
    ...theme.textShadow,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  stickerBox: {
    width: '100%',
    backgroundColor: 'rgba(26,10,6,0.92)',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: theme.gold,
    shadowOpacity: 0.75,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 12,
  },
  stickerBoxLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.gold,
    ...theme.textShadow,
  },
  stickerTile: {
    width: 110,
    height: 110,
  },
  stickerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    ...theme.textShadow,
  },

  spacer: { flex: 1 },

  btnShell: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#000',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    marginBottom: 12,
  },
  menuBtnShell: {
    shadowColor: theme.purpleAccent,
    shadowOpacity: 0.8,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    ...theme.textShadow,
  },
});
