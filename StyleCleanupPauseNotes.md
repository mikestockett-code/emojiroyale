# Style Cleanup Pause Notes

Paused so multiplayer can be fixed/tested first.

## What We Agreed On

The app visually has only a few real style systems:

- Luxury theme: profile cards, handoff cards, win/loss popups, recap/share modals, starter-pack modal.
- Submenu theme: shared backgrounds, carousel layout, validation toast, nav, start buttons.
- Game area: mostly positioned PNG/art/chalk/profile HUD pieces, with tiny layout styles near each component.
- Picker/album: shared picker or album styling, not global luxury theme.
- Buttons: mostly PNG assets. Any coded text-button styles are temporary/quarantined.

The problem is not the screen names.
The problem is duplicated visual ownership: multiple files recreate the same luxury card, label, modal, badge, and row patterns.

## Current Style State

Done:

- `src/fresh/shared/luxuryTheme.ts` is now the global token/pattern toolbox.
- `src/fresh/shared/EmojiStickerPicker.styles.ts` owns sticker picker styles.
- `src/fresh/shared/tempButtonStyles.ts` quarantines coded buttons until PNG buttons replace them.
- `src/fresh/shared/luxuryTheme.styles.ts` was removed.
- `START GAME`, `START BATTLE`, and `START MATCH` now use `assets/buttons/start.png`.
- `GameResultOverlay` win/loss popup styles were moved out of `luxuryResultStyles.ts`.

Current files:

- `src/fresh/shared/GameResultOverlay/GameResultOverlay.styles.ts`
  - Owns only the immediate win/loss popup styles.
  - Uses `theme.cardRing`, `theme.cardInner`, `theme.kicker`, `theme.title`, and `theme.subtitle`.

- `src/fresh/shared/luxuryResultStyles.ts`
  - Now recap-only.
  - Used by `NewSoloRecapCard` and `SoloRecap*` files.
  - Still needs cleanup because it recreates luxury card/text/disc patterns already present in `luxuryTheme.ts`.

## Important Mental Model

`GameResultOverlay` is the universal win/loss popup.
It also opens `NewSoloRecapCard`, but it is not the recap card itself.

`NewSoloRecapCard` is the actual recap/share modal.
It is currently solo-specific, but the long-term idea is that recap can become shared/modded for other modes.

## Next Style Cleanup When We Return

1. Keep `GameResultOverlay.styles.ts` local to the overlay.
2. Rename or move recap styles so ownership is honest, probably near `NewSoloRecapCard`/`SoloRecap*`.
3. Replace recap duplicates with `theme.card`, `theme.displayTitle`, `theme.gold`, text-shadow patterns, and shared disc/card helpers where they are visually the same.
4. Delete `luxuryResultStyles.ts` only when no imports remain.

Do not “hide the monster” by moving duplicate styles into another fake shared file.
Only keep shared styles when they represent a real shared visual contract.

## Last Verification

After separating `GameResultOverlay.styles.ts`, `npx tsc --noEmit` passed.
