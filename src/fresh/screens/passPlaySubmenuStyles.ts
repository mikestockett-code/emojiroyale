import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    gap: 10,
  },
  deckWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFD700',
  },
  startBtn: {
    position: 'absolute',
    bottom: '18%' as any,
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startImg: {
    width: 210,
    height: 210 * (437 / 1306),
  },
  missingPlayersText: {
    position: 'absolute',
    bottom: '14%' as any,
    alignSelf: 'center',
    color: '#ffe3b0',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: 'rgba(5,3,15,0.7)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  bottomNavWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
