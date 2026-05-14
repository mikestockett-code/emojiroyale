import { StyleSheet } from 'react-native';

const albumStyles = StyleSheet.create({
  // ── Page root ─────────────────────────────────────────────────────
  root: { flex: 1, overflow: 'hidden', backgroundColor: '#efe0bd' },
  leftPage: { borderRightWidth: 1, borderColor: 'rgba(68,45,25,0.3)' },
  rightPage: { borderLeftWidth: 1, borderColor: 'rgba(68,45,25,0.3)' },
  fullImage: { width: '100%', height: '100%' },
  blackOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  lockedFrame: {
    flex: 1, margin: 10, borderWidth: 1, borderColor: 'rgba(112,79,43,0.44)',
    backgroundColor: '#efe2c5', shadowColor: '#5a3e20', shadowOpacity: 0.25,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },

  // ── Page header ───────────────────────────────────────────────────
  header: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#6f4b2a', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  count: { color: '#6f4b2a', fontSize: 10, fontWeight: '900' },

  // ── Hidden / locked panel ─────────────────────────────────────────
  hiddenPanel: {
    position: 'absolute', top: 58, left: 12, right: 12, height: 104,
    borderRadius: 6, borderWidth: 1, borderColor: 'rgba(112,79,43,0.28)',
    backgroundColor: 'rgba(95,63,31,0.1)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8,
  },
  hiddenTitle: { color: '#6f4b2a', fontSize: 12, fontWeight: '900', textAlign: 'center' },
  hiddenCopy: { color: 'rgba(93,61,31,0.72)', fontSize: 8, fontWeight: '700', textAlign: 'center', marginTop: 5 },

  // ── Puzzle pieces ─────────────────────────────────────────────────
  pieceGrid: {
    position: 'absolute', top: 190, left: '50%', width: 72, marginLeft: -36,
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', columnGap: 8, rowGap: 7,
  },
  pieceSlot: {
    width: 32, height: 32, borderRadius: 5, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff7db', borderWidth: 1, borderColor: 'rgba(95,63,31,0.55)',
  },
  pieceSlotEmpty: { backgroundColor: 'rgba(95,63,31,0.13)', borderColor: 'rgba(95,63,31,0.22)' },
  pieceImage: { width: 30, height: 30 },
  emptyPieceMark: { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(95,63,31,0.22)' },

  // ── Complete prompt ───────────────────────────────────────────────
  completePrompt: {
    position: 'absolute', left: 10, right: 10, bottom: 54, minHeight: 52,
    borderRadius: 7, borderWidth: 1, borderColor: 'rgba(255,227,163,0.65)',
    backgroundColor: 'rgba(28,16,10,0.82)', flexDirection: 'row', alignItems: 'center',
    paddingLeft: 10, paddingRight: 6,
  },
  completePromptTextWrap: { flex: 1 },
  completePromptTitle: { color: '#ffe3a3', fontSize: 8, fontWeight: '900' },
  completePromptCopy: { color: 'rgba(255,247,219,0.88)', fontSize: 7, fontWeight: '700', marginTop: 3 },
  completePromptClose: {
    width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,227,163,0.16)', marginLeft: 4,
  },
  completePromptCloseText: { color: '#ffe3a3', fontSize: 10, fontWeight: '900' },
  completeBadge: { position: 'absolute', right: 16, bottom: 24, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,227,163,0.86)' },
  completeText: { color: '#1c100a', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },

  // ── Sticker slot ──────────────────────────────────────────────────
  albumEmojiSlot: { width: 40, height: 50, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 },
  albumEmoji: { textAlign: 'center', fontSize: 26, lineHeight: 30, includeFontPadding: false },
  rarityDot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  stickerName: { fontSize: 6, textAlign: 'center', color: '#5a3e2b', marginTop: 1, width: 38 },
  stickerNameHidden: { color: '#aaa' },
  pageHalfEmojiGrid: {
    position: 'absolute', top: 19, width: 85, height: 170,
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'space-between',
  },

  // ── Open book / flipper ───────────────────────────────────────────
  closeBookButton: {
    position: 'absolute', left: 22, top: 34, zIndex: 4, width: 38, height: 38,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,8,28,0.7)',
    borderRadius: 19, borderWidth: 1, borderColor: 'rgba(255,227,163,0.24)',
  },
  pageSpreadFlip: { position: 'absolute', left: '50%', top: 126, width: 283, height: 425, marginLeft: -142, overflow: 'hidden' },
  pageControls: { position: 'absolute', left: 88, right: 88, top: 506, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageButton: {
    width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(15,8,28,0.7)', borderRadius: 19, borderWidth: 1, borderColor: 'rgba(255,227,163,0.24)',
  },
  disabledButton: { opacity: 0.3 },
  pageCount: { minWidth: 54, color: '#ffe3a3', fontSize: 13, fontWeight: '900', textAlign: 'center' },
  pageControlsWithTabs: { top: 598 },
  chapterTabRow: { position: 'absolute', left: 40, right: 40, top: 558, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  chapterTab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 14, backgroundColor: 'rgba(15,8,28,0.65)', borderWidth: 1, borderColor: 'rgba(255,227,163,0.22)' },
  chapterTabActive: { backgroundColor: 'rgba(255,227,163,0.15)', borderColor: '#ffe3a3' },
  chapterTabDisabled: { opacity: 0.28 },
  chapterTabText: { color: 'rgba(255,227,163,0.6)', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  chapterTabTextActive: { color: '#ffe3a3' },

  // ── Battle pages ──────────────────────────────────────────────────
  battleSinglePageWrap: {
    position: 'absolute', left: '50%', top: 72, width: 326, height: 489, marginLeft: -163,
    overflow: 'hidden', borderRadius: 8, backgroundColor: '#140d0a',
    shadowColor: '#000', shadowOpacity: 0.55, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  battleSinglePageControls: { position: 'absolute', left: 78, right: 78, top: 574, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  battlePage: { flex: 1, overflow: 'hidden', backgroundColor: '#140d0a' },
  battlePageReveal: { position: 'absolute', left: 0, top: 0, right: 0, overflow: 'hidden' },
  battlePageLockedText: {
    position: 'absolute', left: 8, right: 8, top: '46%',
    color: '#ffe3a3', fontSize: 15, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center',
    textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5,
  },

  // ── Shelf ─────────────────────────────────────────────────────────
  favoriteBookCover:    { width: 49.605, height: 70.063 },
  bronzeBookCover:      { width: 53.112, height: 70.063 },
  silverBookCover:      { width: 50.925, height: 70.063 },
  goldBookCover:        { width: 50.239, height: 70.063 },
  platinumBookCover:    { width: 50.455, height: 70.063 },
  diamondBookCover:     { width: 50.032, height: 70.063 },
  doodleBookCover:      { width: 46.682, height: 70.042 },
  easterEggsBookCover:  { width: 46.708, height: 70.063 },
  battleModeBookCover:  { width: 52,     height: 70.063 },
  shelfFavorite:             { left: 77.963,  top: 255.595 },
  shelfBronze:               { left: 161.438, top: 255.595 },
  shelfSilver:               { left: 253.125, top: 255.595 },
  shelfGold:                 { left: 77.963,  top: 338.636 },
  shelfPlatinum:             { left: 161.438, top: 338.636 },
  shelfDiamond:              { left: 253.125, top: 338.636 },
  shelfDoodle:               { left: 77.963,  top: 413.464 },
  shelfBattleMode:           { left: 253.125, top: 413.547 },
  shelfEasterEggs:           { left: 161.438, top: 413.547 },
  shelfGoldenPhoenixTrophy:  { left: 252,     top: 492 },
});

export default albumStyles;
