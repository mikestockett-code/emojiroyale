export const TIER_COLORS = {
  common: '#ffd86b',
  epic: '#00f0ff',
  legendary: '#ff00aa',
} as const;

export const ALBUM_TIER_COLORS = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e8e6e0',
  diamond: '#7df9ff',
} as const;

export const theme = {
  // ── Colors ───────────────────────────────────────────────────────
  gold: '#ffd86b',
  goldText: '#ffe3a3',
  creamText: '#fff7db',
  mutedText: 'rgba(255,255,255,0.78)',
  mutedDot: 'rgba(255,255,255,0.22)',
  errorText: '#ff6b6b',
  darkGold: '#5a3300',
  deepBrown: '#1a0a06',
  warmBrown: '#2a1408',
  ringShadow: '#3a1a00',
  purpleAccent: '#7B2FBE',
  darkGlass: 'rgba(8,4,18,0.55)',
  darkToast: 'rgba(5,3,15,0.7)',
  darkScrim: 'rgba(3,2,8,0.94)',
  goldBorderStrong: 'rgba(255,216,107,0.72)',
  goldBorderSoft: 'rgba(255,216,107,0.55)',
  onlinePanel: 'rgba(15, 23, 42, 0.86)',
  onlinePanelStrong: 'rgba(15, 23, 42, 0.88)',
  onlineInput: 'rgba(255,255,255,0.1)',
  player1Color: '#f97316',
  player2Color: '#3b82f6',
  player1Tile: '#fdba74',
  player2Tile: '#93c5fd',

  // ── Text ─────────────────────────────────────────────────────────
  textShadow: {
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  smallTextShadow: {
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '900' as const,
    letterSpacing: 3,
  },
  eyebrow: {
    color: '#ffd86b',
    fontSize: 14,
    fontWeight: '900' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '900' as const,
    color: '#ffd86b',
    textShadowColor: '#3a1a00',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  displayTitle: {
    color: '#ffd86b',
    fontSize: 46,
    fontWeight: '900' as const,
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center' as const,
  },

  // ── Reusable layout patterns ──────────────────────────────────────
  card: {
    backgroundColor: '#1a0a06',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffd86b',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
    shadowColor: '#ffd86b',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardRing: {
    borderRadius: 22,
    padding: 3,
    shadowOpacity: 0.7,
    shadowRadius: 38,
    shadowOffset: { width: 0, height: 14 },
    elevation: 20,
  },
  cardInner: {
    borderRadius: 19,
    padding: 16,
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  pressed: {
    opacity: 0.75,
  },

  // ── Reusable input patterns ───────────────────────────────────────
  input: {
    borderWidth: 2,
    borderColor: 'rgba(255,216,107,0.55)',
    backgroundColor: '#2a1408',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
};
