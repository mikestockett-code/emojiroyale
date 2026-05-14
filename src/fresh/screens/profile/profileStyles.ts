import { StyleSheet } from 'react-native';
import { theme } from '../../shared/luxuryTheme';
import { tempButtonStyles } from '../../shared/tempButtonStyles';

export const profileStyles = StyleSheet.create({
  // ── Screen ───────────────────────────────────────────────────────
  root:    { flex: 1, backgroundColor: theme.deepBrown },
  content: { paddingTop: 12, paddingBottom: 28, paddingHorizontal: 16, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerSpacer: { width: 84 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },

  // ── Typography ───────────────────────────────────────────────────
  title:        { color: theme.gold, fontSize: 28, fontWeight: '900', ...theme.textShadow },
  sectionLabel: { color: theme.gold, fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  cardEyebrow:  { color: theme.gold, fontSize: 11, fontWeight: '900', letterSpacing: 2, ...theme.textShadow },
  helperText:   { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', lineHeight: 16 },
  emptyText:    { color: 'rgba(255,255,255,0.45)', fontSize: 15 },
  errorText:    { color: '#ff6b6b', fontSize: 14, fontWeight: '700' },

  // ── Buttons ──────────────────────────────────────────────────────
  backButton:     { ...tempButtonStyles.smallButton, minWidth: 84, borderColor: theme.darkGold, borderRadius: 16 },
  backButtonText: { ...tempButtonStyles.smallButtonText, fontSize: 15 },
  primaryButton:      { ...tempButtonStyles.primaryButton },
  primaryButtonText:  { ...tempButtonStyles.primaryButtonText },
  primaryButtonDisabled: { opacity: 0.38 },
  smallButton:          { ...tempButtonStyles.smallButton },
  smallButtonText:      { ...tempButtonStyles.smallButtonText },
  smallButtonActive:    { backgroundColor: theme.gold, borderColor: theme.darkGold },
  smallButtonTextActive:{ color: theme.deepBrown },
  smallButtonSecondary: { backgroundColor: '#2563eb', borderColor: '#1d4ed8' },
  deleteButton:     { ...tempButtonStyles.smallButton, borderColor: '#7f1d1d', backgroundColor: '#2d0808' },
  deleteButtonText: { color: '#fca5a5', fontSize: 11, fontWeight: '900' },
  pressed: { ...theme.pressed },

  // ── Cards ────────────────────────────────────────────────────────
  card: { ...theme.card },
  selectorModalCard: { ...theme.card, width: '100%', maxWidth: 360, maxHeight: 420 },

  // ── Avatar ───────────────────────────────────────────────────────
  activeProfileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  activeProfileCopy: { flex: 1, gap: 4 },
  activeProfileName: { color: theme.gold, fontSize: 24, fontWeight: '900', ...theme.textShadow },
  activeProfileMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '700' },
  avatarBadge:      { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: theme.gold, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.warmBrown },
  avatarBadgeSmall: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: theme.gold, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 34 },

  // ── Profile rows ─────────────────────────────────────────────────
  profileList:        { gap: 10 },
  profileRow:         { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 16, backgroundColor: theme.warmBrown, borderWidth: 1.5, borderColor: 'rgba(255,216,107,0.25)' },
  profileRowCopy:     { flex: 1, gap: 2 },
  profileRowName:     { color: '#fff', fontSize: 16, fontWeight: '900' },
  profileRowMeta:     { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '700' },
  secondaryProfileWrap: { marginTop: 6, gap: 8 },
  secondaryEyebrow:     { color: theme.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  secondaryProfileRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, backgroundColor: theme.warmBrown, borderWidth: 1.5, borderColor: 'rgba(255,216,107,0.3)' },

  // ── Form inputs ──────────────────────────────────────────────────
  sectionBlock: { gap: 8 },
  input:        { ...theme.input },
  pickerShell:  { backgroundColor: theme.warmBrown, borderWidth: 2, borderColor: 'rgba(255,216,107,0.55)', borderRadius: 14, overflow: 'hidden' },
  picker:       { height: 52, color: '#fff', backgroundColor: theme.warmBrown },
  selectorShell:       { ...theme.input, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectorValue:       { flex: 1, color: '#fff', fontSize: 16, fontWeight: '700' },
  selectorModalBackdrop: { flex: 1, backgroundColor: 'rgba(5,2,2,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  selectorList:        { maxHeight: 300 },
  selectorOption:      { paddingHorizontal: 12, paddingVertical: 14, borderRadius: 14, backgroundColor: theme.warmBrown, borderWidth: 1.5, borderColor: 'rgba(255,216,107,0.25)', marginBottom: 10 },
  selectorOptionText:  { color: '#fff', fontSize: 16, fontWeight: '800' },

  // ── Pickers (avatar / color) ──────────────────────────────────────
  optionGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  avatarOption:        { width: 52, height: 52, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,216,107,0.3)', backgroundColor: theme.warmBrown, alignItems: 'center', justifyContent: 'center' },
  avatarOptionSelected:{ borderColor: theme.gold, backgroundColor: theme.ringShadow },
  avatarOptionText:    { fontSize: 24 },
  colorGrid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorOption:         { minWidth: 88, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 14, borderWidth: 2, alignItems: 'center' },
  colorOptionSelected: { borderColor: theme.gold, borderWidth: 2.5, transform: [{ scale: 1.04 }] },
  colorOptionText:     { fontSize: 13, fontWeight: '900' },

  // ── Profile list badges ───────────────────────────────────────────
  badgeRow:       { flexDirection: 'row', gap: 5, marginTop: 2 },
  badgeBase:      { fontSize: 10, fontWeight: '900', letterSpacing: 0.8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  badgeActive:    { fontSize: 10, fontWeight: '900', letterSpacing: 0.8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden', color: '#92400e', backgroundColor: '#fde68a' },
  badgeSecondary: { fontSize: 10, fontWeight: '900', letterSpacing: 0.8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden', color: '#fff', backgroundColor: '#2563eb' },
  actionRow:      { flexDirection: 'row', gap: 6, alignItems: 'center' },
  whiteText:      { color: '#fff' },
});
