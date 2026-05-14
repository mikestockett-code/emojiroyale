import { StyleSheet } from 'react-native';
import { theme } from './luxuryTheme';

const luxuryRecapCard = {
  width: '100%' as const,
  backgroundColor: 'rgba(26,10,6,0.92)',
  borderRadius: 18,
  borderWidth: 3,
  borderColor: '#000',
  shadowColor: theme.gold,
  shadowOpacity: 0.4,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 0 },
  elevation: 12,
};

const luxuryRoundLabel = {
  fontWeight: '900' as const,
  color: theme.gold,
  textShadowColor: '#000',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 4,
};

const luxuryRoundValue = {
  fontWeight: '900' as const,
  color: '#fff',
  textShadowColor: '#000',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 4,
};

const fullWidth = {
  width: '100%' as const,
};

const goldDisc = {
  backgroundColor: theme.warmBrown,
  borderWidth: 2,
  borderColor: theme.gold,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const luxuryResultStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  shareCard: {
    ...fullWidth,
    gap: 12,
    padding: 12,
    borderRadius: 22,
    backgroundColor: '#120604',
  },
  resultTitle: {
    ...theme.displayTitle,
    fontSize: 42,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    ...luxuryRecapCard,
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  profileLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarDisc: {
    width: 50,
    height: 50,
    borderRadius: 25,
    ...goldDisc,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  profileName: {
    fontSize: 18,
    ...luxuryRoundValue,
  },
  profileLabel: {
    fontSize: 9,
    letterSpacing: 2,
    opacity: 0.75,
    marginTop: 2,
    ...luxuryRoundLabel,
  },
  favSlot: {
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  favLabel: {
    fontSize: 8,
    letterSpacing: 2,
    opacity: 0.8,
    ...luxuryRoundLabel,
  },
  favDisc: {
    width: 52,
    height: 52,
    borderRadius: 12,
    ...goldDisc,
  },
  favEmoji: {
    fontSize: 30,
  },
  favName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    maxWidth: 68,
  },
  favPrompt: {
    fontSize: 8,
    letterSpacing: 0.5,
    opacity: 0.6,
    textAlign: 'center',
    ...luxuryRoundLabel,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  scoreDivider: {
    width: 2,
    height: 48,
    backgroundColor: '#3a2060',
    marginHorizontal: 8,
  },
  scoreLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    ...luxuryRoundLabel,
  },
  scoreValue: {
    fontSize: 30,
    ...luxuryRoundValue,
  },
  newBest: {
    color: theme.gold,
  },
  highlightsCard: {
    ...luxuryRecapCard,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  highlightsLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    textAlign: 'center',
    ...luxuryRoundLabel,
  },
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  highlightTile: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  highlightDisc: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disc_common: {
    backgroundColor: '#1a1a2e',
    borderColor: theme.gold,
  },
  disc_rare: {
    backgroundColor: '#1a0a2e',
    borderColor: '#a855f7',
  },
  disc_extremelyRare: {
    backgroundColor: '#0a1a2e',
    borderColor: '#00f0ff',
  },
  highlightEmoji: {
    fontSize: 28,
  },
  highlightName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    maxWidth: 64,
  },
  highlightCount: {
    fontSize: 9,
    fontWeight: '900',
    color: theme.gold,
    opacity: 0.7,
  },
  rewardRow: {
    ...fullWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26,10,6,0.7)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rewardLabel: {
    fontSize: 9,
    letterSpacing: 2,
    opacity: 0.7,
    ...luxuryRoundLabel,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'right',
  },
  rewardImage: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  buttonStack: {
    ...fullWidth,
    gap: 10,
  },
  fullWidth: {
    ...fullWidth,
  },
  buttonSpacer: {
    height: 8,
  },
});
