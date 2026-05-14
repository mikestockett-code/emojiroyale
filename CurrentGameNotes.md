# Current Game Notes

## Mental Model

The game now has four mode families:

- Solo
- Pass & Play
- Battle
- Online Multiplayer

They are mostly the same game with different policy on top. The shared core should own board, rack, roll, power, win, layout, setup, and common UI structure. Mode files should only own the real differences: rewards, CPU behavior, handoff, Firebase relay, story stages, and profile/wager policy.

Before adding a new mode-specific file, check whether the job already belongs to a shared primitive.

## Shared Structure

### Top-Level Routing

- `src/fresh/app/AppRouter.tsx`
  - Chooses which screen to render.
  - Passes profiles, reward callbacks, and navigation callbacks.
  - Keeps the multiplayer room controller because lobby and online game share it.

- `src/fresh/app/useModeRouteState.ts`
  - Owns route-adjacent setup state:
    - `soloSetup`
    - `passPlaySetup`
    - `battleSetup`
    - battle journey stage/cpu
    - pass-play entry mode
    - profile return route

### Submenus And Setup

- `src/fresh/shared/submenu/CarouselSubmenuScreen.tsx`
  - Shared carousel submenu shell for Solo and Pass & Play.
  - Handles background, deck area, dots, start button, and validation/status message.

- `src/fresh/shared/setup/ModePowerSetupScreen.tsx`
  - Shared mode-facing power setup entry point.
  - Solo, Pass & Play, Battle, and Multiplayer should use this instead of importing `PassPlayPowerScreen` directly.
  - Owns shared power setup header, confirm sound behavior, and profile casting boundary.

- `src/components/game/power-setup/PassPlayPowerScreen.tsx`
  - Generic power-pick screen implementation.
  - Uses `PowerScreenLayout`.
  - Despite the name, this is no longer Pass & Play-only.

- `src/components/game/power-setup/PowerScreenLayout.tsx`
  - Visual layout for power selection.
  - Supports EP1-only or EP1 + EPI via `allowEpi`.

- `src/fresh/shared/SharedSubmenuShell.tsx`
  - Shared background shell.

- `src/fresh/shared/SharedBottomNav.tsx`
  - Shared bottom nav/profile HUD row.

### Board And Power Core

- `src/hooks/useGameBoard.ts`
  - Shared board engine.
  - Owns board state, racks, selected rack index, selected power slot, roll flow hookup, tile placement, rack reroll, EP1 effect display state, and board reset.

- `src/hooks/useModeBoardController.ts`
  - Shared mode-facing board/power controller.
  - Wraps `useGameBoard`, `useGamePowerSlots`, `useGamePowerPress`, and power slot mapping.
  - Used by Solo, Pass & Play, Battle, and Online host path.
  - This is the first place to look before adding board/power wiring to a mode.

- `src/hooks/useGamePowerSlots.ts`
  - Converts selected power loadouts into live in-game power slot data and usage counts.

- `src/hooks/useGamePowerPress.ts`
  - Shared in-game power button behavior.

- `src/hooks/useRollFlow.ts`
  - Shared roll interaction/preview/animation flow.

- `src/lib/diceLogic.ts`
  - Shared dice cell creation/application.

- `src/lib/sharedRackLogic.ts`
  - Shared rack generation.

- `src/lib/winDetection.ts`
  - Shared board win detection.

- `src/lib/roundResult.ts`
  - Shared pure winner/result helpers:
    - display title
    - result type/tier
    - winner sound mapping
    - epic/legendary check

### Game Screen Rendering

- `src/fresh/shared/GameModeScreenShell.tsx`
  - Shared game-screen wrapper.
  - Renders `FreshGameArea` and shared overlays.

- `src/fresh/shared/FreshGameArea.tsx`
  - Adapter from mode state to the visual `GameArea`.

- `src/components/game/GameArea/GameArea.tsx`
  - Shared playfield composer.
  - Should not contain gameplay rules.

- `src/components/game/GameArea/useGameLayout.ts`
  - Board/rack/background geometry only.

## Mode Responsibilities

### Solo

Main files:

- `src/hooks/useSoloGameState.ts`
- `src/hooks/solo/useSoloRound.ts`
- `src/hooks/solo/useSoloRolls.ts`
- `src/hooks/solo/useSoloRewards.ts`
- `src/hooks/solo/useSoloWinHandler.ts`
- `src/fresh/solo/soloSubmenuValidation.ts`
- `src/fresh/solo/soloWagerFactory.ts`

Solo owns:

- Solo wager policy
- Solo reward policy
- Solo high score hooks
- Solo CPU difficulty
- Solo CPU EP1 behavior
- Solo result overlay state

Solo should not reimplement board/power/rack/roll behavior.

### Pass & Play

Main files:

- `src/fresh/screens/passplay/usePassPlayGameState.ts`
- `src/fresh/passplay/usePassPlaySubmenu.ts`
- `src/fresh/passplay/passPlaySubmenuValidation.ts`

Pass & Play owns:

- Two human profiles
- Handoff overlay/timing
- P1/P2 wager sticker payout
- Golden Phoenix holder rules

Pass & Play should share board/power/wager inventory helpers.

### Battle

Main files:

- `src/fresh/battle/useBattleGameState.ts`
- `src/fresh/battle/useBattleRewards.ts`
- `src/fresh/battle/useBattleScore.ts`
- `src/fresh/battle/useToddNervousMistake.ts`
- `src/fresh/battle/useNicoBehavior.ts`
- `src/fresh/battle/battleCpuConfig.ts`

Battle owns:

- Story/stage CPU policy
- Todd/Nico behavior
- Timer and timer EPI behavior
- Battle score to 2000
- Battle stage rewards

Do not merge Battle CPU with Solo CPU yet. They share board systems, but CPU policy is still mode-specific.

### Online Multiplayer

Main files:

- `src/multiplayer/useMultiplayerRoom.ts`
- `src/multiplayer/useOnlineGame.ts`
- `src/multiplayer/useGuestMoveRelay.ts`
- `src/multiplayer/onlineGameViewModel.ts`
- `src/multiplayer/onlineGameHelpers.ts`
- `src/multiplayer/roomService.ts`
- `src/multiplayer/multiplayerTypes.ts`
- `src/fresh/screens/multiplayer/MultiplayerLobbyScreen.tsx`
- `src/fresh/screens/multiplayer/OnlineGameScreen.tsx`

Online owns:

- Firebase room lifecycle
- Host-authoritative game state
- Guest move relay
- Mirrored view model for guest device
- Room code lobby flow

Online should still use shared board/power setup and shared game rendering. Do not merge Online relay with CPU modes.

## Wagers And Inventory

- `src/fresh/shared/wagers/wagerInventory.ts`
  - Shared album-count helpers:
    - owned sticker checks by tier
    - random owned sticker picking
    - Common stack checks/picking

Use this file before filtering `ALBUM_STICKER_CATALOG` inside mode code.

## Theme And Style Rules

- Use `src/fresh/shared/luxuryTheme.ts` for shared tokens.
- Use shared components for repeated layout:
  - `SharedSubmenuShell`
  - `SharedBottomNav`
  - `CarouselSubmenuScreen`
  - `ModePowerSetupScreen`
  - `GameModeScreenShell`
- Do not bring back `src/fresh/shared/submenuStyles.ts` as a broad bucket.
- Do not create new mode-specific style files unless there is a real visual difference.

## Current Guardrails

- Do not merge Solo CPU, Battle CPU, and Online relay.
- Do not create one giant reward engine.
- Do not redesign submenus visually during code-shape refactors.
- Do not duplicate board logic, rack logic, roll logic, win detection, EP1 animation, power press behavior, result overlays, or reward preview display.
- Run `npx tsc --noEmit` after meaningful refactors.

