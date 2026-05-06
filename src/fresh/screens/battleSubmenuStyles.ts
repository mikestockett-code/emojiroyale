import { StyleSheet } from 'react-native';
import { CARD_SIZE } from '../../components/power-selection/powerCardStyles';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 10,
    gap: 2,
  },
  eyebrow: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  profileName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  slotWrapper: {
    width: CARD_SIZE,
    aspectRatio: 1,
    borderRadius: 12,
    shadowColor: '#7B2FBE',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  slotImg: {
    width: '100%',
    height: '100%',
  },
});
