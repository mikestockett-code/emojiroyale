---
name: Battle Mode Architecture
description: Battle mode is single-player vs CPU; power setup screen built; between-rounds popup pending
type: project
---

Battle mode is single-player (1 human vs CPU "alter egos"). Not multiplayer, no online yet.

**Power rules:**
- EP1 (Emoji Power +): TortureRack, RemoveEmoji, ClearRow, ClearColumn — used ONCE per round, checked against album
- EPI (Emoji Power): PowerFreeze, +10Seconds — multi-use per round (as many as owned), checked against album
- Player picks 2 total, any combo (2x EP1, 2x EPI, or 1 each), no duplicates
- Each round can re-pick powers (via reload popup)

**Album check:** `profile.albumCounts[powerId] > 0` — if not owned, card is dimmed/unselectable; player goes in without that power. `albumCounts` added as optional to FreshProfile.

**Assets (battle mode only, in PowerSlotBattleMode/):**
- `powerfreeze.png` — replaces old `power_clock_freeze.png`
- `10secondsadded.png` — replaces old `power_plus_10_seconds.png`
- Old files still exist in folder but no longer referenced in code

**Between-rounds popup (not yet built):** Win or lose → popup with Reload | Continue | TBD. Reload → back to BattleSubmenuScreen (can change slot 1 or 2).

**Why:** Single-player CPU battle, no online, "alter egos of CPU" — user's personal mode.

**How to apply:** When building battle game logic, remember EP1 is once-per-round reset, EPI uses inventory count. Reload popup should navigate back to battleSubmenu route in AppRouter.
