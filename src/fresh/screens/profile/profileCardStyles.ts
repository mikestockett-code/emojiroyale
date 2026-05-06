import { StyleSheet } from 'react-native';

export const profileCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#160803',
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
  cardEyebrow: {
    color: '#ffd86b',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#3a1a00',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },

  // Active Profile
  activeProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#ffd86b',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a1408',
  },
  avatarEmoji: {
    fontSize: 34,
  },
  activeProfileCopy: {
    flex: 1,
    gap: 4,
  },
  activeProfileName: {
    color: '#ffd86b',
    fontSize: 24,
    fontWeight: '900',
    textShadowColor: '#3a1a00',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  activeProfileMeta: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '700',
  },

  // Secondary Profile
  secondaryProfileWrap: {
    marginTop: 6,
    gap: 8,
  },
  secondaryEyebrow: {
    color: '#ffd86b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  secondaryProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#2a1408',
    borderWidth: 1.5,
    borderColor: 'rgba(255,216,107,0.3)',
  },
  avatarBadgeSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ffd86b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Profile list rows
  profileList: {
    gap: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#2a1408',
    borderWidth: 1.5,
    borderColor: 'rgba(255,216,107,0.25)',
  },
  profileRowCopy: {
    flex: 1,
    gap: 2,
  },
  profileRowName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  profileRowMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '700',
  },
});
