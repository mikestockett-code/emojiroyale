# Project Finish Map

## Purpose

This is the practical map for finishing Emoji Royale without reopening the same cleanup arguments every day.

The big hook cleanup is closed in `HookArchitectureCleanupPlan.md`. Use this file for the remaining finish work: what is already unified, where to make common edits, what still needs checking, and a realistic order for the last polish pass.

## Current Truth

The project is no longer split into completely separate old/new gameplay systems.

Major shared pieces now exist:

- Board/rack/roll rules are shared.
- Power selection setup is shared.
- Solo and Pass & Play carousel submenus are shared.
- How-To screens share rendering parts while keeping mode-specific entry routes.
- Multiplayer was rebuilt enough to continue, but should be reopened only for repeatable bugs.

Do not restart architecture from scratch unless something repeatable proves this map wrong.

## Completed Cleanup

### Hook / Gameplay Architecture

Closed in `HookArchitectureCleanupPlan.md`.

Important files:

- `src/hooks/useBoardStateController.ts`
- `src/hooks/useModeBoardController.ts`
- `src/lib/boardResolution.ts`
- `src/lib/boardRackResolution.ts`
- `src/hooks/useGamePowerSlots.ts`
- `src/hooks/useGamePowerPress.ts`

Status:

- `useGameBoard.ts` is deleted.
- `useSoloGameState.ts` is orchestration, not the old giant board owner.
- CPU power handling is split into `src/hooks/solo/useSoloCpuPowers.ts`.
- `npx tsc --noEmit` passes after the cleanup.

### Power Setup Screen

One shared setup family now lives here:

- `src/fresh/shared/setup/ModePowerSetupScreen.tsx`
- `src/fresh/shared/setup/ModePowerSetupScreen.styles.ts`
- `src/fresh/shared/setup/PowerCard.tsx`
- `src/fresh/shared/setup/PowerSection.tsx`
- `src/fresh/shared/setup/usePowerSlots.ts`

Used by:

- `src/fresh/screens/SoloSubmenuScreen.tsx`
- `src/fresh/screens/PassPlaySubmenuScreen.tsx`
- `src/fresh/screens/BattleSubmenuScreen.tsx`
- `src/fresh/screens/multiplayer/MultiplayerLobbyScreen.tsx`

Status:

- Old `src/components/power-selection/*` setup pieces were removed.
- Solo, Pass & Play, Battle, and Multiplayer all use `ModePowerSetupScreen`.
- Change power setup layout/font/card behavior in one setup folder.

### Carousel Submenus

One shared carousel family now lives here:

- `src/fresh/shared/submenu/CarouselSubmenuScreen.tsx`
- `src/fresh/shared/submenu/CarouselSubmenuScreen.styles.ts`
- `src/fresh/shared/submenu/CarouselCardDeck.tsx`

Used by:

- `src/fresh/screens/SoloSubmenuScreen.tsx`
- `src/fresh/screens/PassPlaySubmenuScreen.tsx`

Status:

- Old `SoloSubMenu.tsx` wrapper was removed.
- Old card deck files are removed.
- Solo and Pass & Play now differ by card PNG/config/start behavior/nav data, not separate carousel animation code.

### How-To Screens

Shared renderer:

- `src/fresh/screens/how-to/HowToParts.tsx`
- `src/fresh/screens/how-to/styles.ts`

Mode entry files still exist on purpose:

- `src/fresh/screens/how-to/HowToPlayMain.tsx`
- `src/fresh/screens/how-to/HowToSolo.tsx`
- `src/fresh/screens/how-to/HowToPassAndPlay.tsx`
- `src/fresh/screens/how-to/HowToBattle.tsx`

Status:

- Home opens the general How-To.
- Solo opens Solo How-To.
- Pass & Play opens Pass & Play How-To.
- Battle opens Battle How-To.
- Keep this route behavior.

### Album Progression Data

Main file:

- `src/fresh/album/albumProgressionSpec.ts`

Status:

- Repeated era/chapter objects were replaced with shared builders.
- Future sticker totals should be edited as compact data, not copy-paste blocks.

## Editing Map

| Change needed | Start here |
|---|---|
| Board placement / rack replenish | `src/lib/boardRackResolution.ts` |
| Roll results, die faces, EP1 roll behavior | `src/lib/boardResolution.ts` |
| Board/rack React state glue | `src/hooks/useBoardStateController.ts` |
| Player EP1/EPI slot state | `src/hooks/useGamePowerSlots.ts` |
| What happens when a power button is pressed in-game | `src/hooks/useGamePowerPress.ts` |
| Power definitions, labels, images | `src/data/battlePowers.ts` |
| Power setup screen layout | `src/fresh/shared/setup/ModePowerSetupScreen.tsx` |
| Power setup styles | `src/fresh/shared/setup/ModePowerSetupScreen.styles.ts` |
| Solo/Pass carousel card PNGs | `src/fresh/shared/submenu/CarouselCardDeck.tsx` |
| Solo submenu behavior/validation | `src/fresh/solo/useSoloSubmenuState.ts` |
| Pass & Play submenu behavior/validation | `src/fresh/passplay/usePassPlaySubmenu.ts`, `src/fresh/passplay/passPlaySubmenuValidation.ts` |
| Shared game board/rack/top UI | `src/components/game/GameArea/` |
| Solo game state | `src/hooks/useSoloGameState.ts` |
| Pass & Play game state | `src/fresh/screens/passplay/usePassPlayGameState.ts` |
| Battle game state | `src/fresh/battle/useBattleGameState.ts` |
| Online game state/sync | `src/multiplayer/useOnlineGame.ts` |
| Multiplayer Firebase room layer | `src/multiplayer/useMultiplayerRoom.ts`, `src/multiplayer/roomService.ts` |
| Sounds | `src/fresh/audio/AudioContext.tsx`, `src/lib/audio.ts` |
| How-To wording | `src/fresh/screens/how-to/` |
| Album screen/data | `src/fresh/album/` |
| Main routing | `src/fresh/app/AppRouter.tsx`, `src/fresh/app/useModeRouteState.ts` |

## What Is Probably Left

Keep this list short. The goal is finishing, not infinite cleanup.

### 1. Game Screen UI Audit

Status: done. No refactor needed.

Check whether Solo, Pass & Play, Battle, and Online all use the same shared board/rack/top/power UI pieces cleanly.

Files to inspect:

- `src/fresh/screens/SoloGameScreen.tsx`
- `src/fresh/screens/PassPlayGameScreen.tsx`
- `src/fresh/screens/BattleGameScreen.tsx`
- `src/fresh/screens/multiplayer/OnlineGameScreen.tsx`
- `src/fresh/shared/FreshGameArea.tsx`
- `src/components/game/GameArea/GameArea.tsx`

Rule:

- Do not rewrite gameplay.
- Only remove obvious duplicate layout glue if the same UI is copied across mode screens.

Audit result:

- `SoloGameScreen`, `PassPlayGameScreen`, `BattleGameScreen`, and `OnlineGameScreen` all use `GameModeScreenShell`.
- `GameModeScreenShell` funnels through `FreshGameArea`.
- `FreshGameArea` funnels through the shared `components/game/GameArea`.
- The shared `GameArea` owns board, rack, top area, power slots, EP1 visuals, roll preview, handoff, and bottom nav.
- Targeted duplicate scan over these files reports 0 clones.
- No UI refactor is needed here unless a visible layout bug appears.

### 2. Multiplayer Watch / Polish

Status: skipped for now. User needs more device testing time.

Do not restart multiplayer. Only fix repeatable bugs.

Known watch items:

- Power animation after Tornado / roll overlap.
- Sounds on both phones.
- Rack reroll visibility after move.
- Guest/host turn disabled state.

Files:

- `src/multiplayer/useOnlineGame.ts`
- `src/multiplayer/onlineGameHelpers.ts`
- `src/fresh/screens/multiplayer/OnlineGameScreen.tsx`

### 3. Profile / Album / Reward Smoke

Status: passed by user manual testing.

Make sure rewards actually land where expected after wins.

Smoke paths:

- Solo win gives album stickers.
- Pass & Play winner gets reward.
- Battle stage clear gives reward/puzzle pieces.
- Profile switching does not lose selected profile state.

Files:

- `src/fresh/profile/useFreshProfiles.ts`
- `src/hooks/solo/useSoloRewards.ts`
- `src/fresh/battle/useBattleRewards.ts`
- `src/fresh/screens/passplay/usePassPlayGameState.ts`
- `src/fresh/album/`

Manual result:

- User tested reward/profile/album paths and reports everything is good except pre-existing known bugs from before the split.
- Do not spend a cleanup day re-auditing this unless a reward bug becomes repeatable.

### 4. Final Device Smoke

Do this near the end, not after every tiny cleanup.

Minimum pass:

- Solo: practice, epic lite, epic.
- Pass & Play: no wager, epic, legendary.
- Battle: first stage, powers, timer, stage clear/fail.
- Multiplayer: host create, guest join, both pick powers, both place, both roll, both use at least one instant and one targeted power.
- Audio: mute/unmute, power sounds, roll sounds, win sounds.

## 3-4 Day Finish Order

### Day 1 — Game Screen UI Audit

Status: complete.

Goal:

- Confirm game screens are sharing `FreshGameArea` / `GameArea` correctly.
- Remove only obvious duplicate UI wrappers.
- Run `npx tsc --noEmit`.

Stop condition:

- If the audit shows the screens are already shared enough, do not force a refactor.

Result:

- Screens are already shared enough.
- No code changes were needed.
- `npx tsc --noEmit` passes.

### Day 2 — Multiplayer Polish Only If Repeatable

Status: skipped until more real-device testing.

Goal:

- Test multiplayer on two devices.
- Fix only bugs that can be repeated.
- Do not rebuild the whole online system again.

Stop condition:

- If MP is good enough, move on.

### Day 3 — Rewards / Album / Profile Smoke

Status: complete by manual testing.

Goal:

- Verify wins give expected rewards.
- Verify profile selection works across modes.
- Fix small data/wiring bugs.

Stop condition:

- Core reward loops work without obvious missing writes.

### Day 4 — Final Pass

Status: verification passed. Remaining work should be known gameplay bugs, not broad refactor.

Goal:

- Run typecheck.
- Run duplicate scanner once.
- Manual smoke the main modes.
- Update this map with final notes.

Commands:

```bash
npx tsc --noEmit
npx jscpd src/hooks src/lib src/fresh src/components --min-lines 20 --min-tokens 120
```

Current result:

- `npx tsc --noEmit` passes.
- Full duplicate scan reports 0 clones across `src/hooks`, `src/lib`, `src/fresh`, and `src/components`.
- Architecture cleanup is done enough. Do not keep refactoring unless a specific known bug needs it.
- Final verification rerun on 2026-05-15:
  - `npx tsc --noEmit` passed.
  - `npx jscpd src/hooks src/lib src/fresh src/components --min-lines 20 --min-tokens 120` found 0 clones.

## Guardrails

- Do not create a new architecture unless there is a repeatable bug that proves the current one cannot work.
- Prefer one shared file family per screen/system.
- Keep mode files as configuration/orchestration.
- If a file exists only to wrap another shared file with no real behavior, consider deleting it.
- If a file owns mode-specific rules, keep it.
- Run `npx tsc --noEmit` after meaningful changes.

## Current Confidence

Estimated remaining work if no new major bugs appear: 3-4 focused days.

Most remaining risk is not architecture. It is device smoke, multiplayer edge cases, and reward/profile wiring.

Updated after final verification:

- Structure/refactor risk is low.
- Remaining work should be handled as a bug list.
- Fix one known bug at a time, with a focused repro and typecheck after each fix.
