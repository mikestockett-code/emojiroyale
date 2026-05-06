import { StyleSheet } from 'react-native';

export const BG        = require('../../../assets/backgrounds/backgroundgamearea.png');
export const START_IMG = require('../../../assets/buttons/start.png');

export const ss = StyleSheet.create({
  root:          { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  deckArea:      { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  startBtn:      { alignItems: 'center', paddingBottom: 24 },
  startImg:      {
    width: 210,
    height: 210 * (437 / 1306),
    transform: [{ perspective: 400 }, { rotateX: '25deg' }],
  },
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#0d0821',
    borderWidth: 1.5,
    borderColor: '#ffd700',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    gap: 14,
  },
  cardTitle: {
    color: '#ffd700',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardBody: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'left',
    width: '100%',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#ffd700',
    borderColor: '#ffd700',
  },
  checkmark: {
    color: '#0d0821',
    fontSize: 14,
    fontWeight: '900',
  },
  checkLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
  },
  dismissBtn: {
    backgroundColor: '#ffd700',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 6,
  },
  dismissText: {
    color: '#0d0821',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.2,
  },
});
