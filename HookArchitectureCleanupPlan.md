# Hook Architecture Cleanup Plan

## Goal

Make gameplay code match the product truth:

- Solo, Pass & Play, Battle, and Online should share the same board/rack/roll/power engine.
- Mode hooks should only own mode-specific behavior: CPU, timer, handoff, rewards, online sync.
- There should be one obvious file family for each kind of game change.

This is a behavior-preserving refactor. Do not redesign UI or intentionally change rules while doing this pass.

## Current Target Shape

- `src/hooks/useBoardStateController.ts`
  - Owns shared board/rack/roll state and interaction.
  - Calls pure helpers in `src/lib/boardResolution.ts` and `src/lib/boardRackResolution.ts`.

- `src/hooks/useModeBoardController.ts`
  - Mode-facing wrapper around the shared board controller.
  - Owns player power-slot wiring through `useGamePowerSlots`.
  - Exports `TurnEndMeta` for mode hooks.

- `src/hooks/useGamePowerSlots.ts`
  - Single public EP1/EPI power slot manager.
  - Direct `useEP1Powers` usage should stay internal here unless a later refactor removes `useEP1Powers` entirely.

- Mode hooks configure the shared engine:
  - Solo: CPU, solo rounds, solo rewards, solo difficulty.
  - Pass & Play: handoff, wager rewards.
  - Battle: timer, battle CPU, battle scoring/rewards.
  - Online: room authority and sync.

---

## Session Notes (for next AI picking this up)

### Current status

This cleanup plan is complete.

There is no remaining planned hook-architecture work in this file. The shared board/rack/roll/power architecture is in place, TypeScript is green, and the duplicate scanner is clean for the hook/lib/fresh/component areas covered by this cleanup.

Only reopen this plan for:
- a repeatable multiplayer bug,
- a behavior regression caused by this refactor,
- or a deliberate new architecture pass requested by the user.

New product features, screen redesigns, or unrelated cleanup should get their own plan file instead of expanding this one.

### What was done across two sessions

**Session 1 — Hook refactor (completed all steps below):**
- Deleted `useGameBoard.ts`, replaced with `useBoardStateController.ts`.
- Added `src/lib/boardResolution.ts` and `src/lib/boardRackResolution.ts` as pure helpers.
- `useModeBoardController.ts` now wraps `useBoardStateController` + `useGamePowerSlots`.
- `useSoloGameState` shrunk to orchestration only.
- Added `src/hooks/solo/useSoloCpuPowers.ts` and `src/hooks/solo/useSoloDifficulty.ts`.
- `npx tsc --noEmit` passes clean.

**Session 2 — Battle CPU + EP1 pill fixes + useSoloCpu audit:**
- Fixed `Ep1StatusPill` eyebrow: was hardcoded "RANDOM POWER+", now dynamic (`getEyebrow()` reads the label prefix).
- Fixed EP1 status messages: player dice says "You rolled...", CPU dice says "CPU rolled...", CPU direct power says "Todd used X" / "Nico used X".
- Overhauled Nico battle behavior in `useNicoBehavior.ts`: progressive anger on corner hits (hit 1 = taunt only, hit 2 = queue 4 Square if 2+ emojis in corner, hit 3+ = fire 4 Square or fallback clear row/col). Removed instant-play intro sound.
- Removed "emoji power" suffix from all Todd and Nico EP1 status labels.
- Audited `useSoloCpu`: `resolveCpuRoll` now uses shared `resolveBoardRoll` from `boardResolution.ts`. Removed duplicate direct calls to `applyRandomGameBoardEffect`, `createGameBoardEffectEvent`, `applyDieFace`.
- Added editing map (table below).
- `npx tsc --noEmit` passes clean after all changes.

### Multiplayer status — STABILIZED ENOUGH

Original known bugs:
1. Host moves don't show on guest phone.
2. Guest roll button is always greyed out.
3. Roll can start but freeze/not finish cleanly.
4. Host screen appears grey after host places an emoji.

Important diagnosis:
- Do not delete all multiplayer.
- Keep the room/lobby/Firebase layer:
  - `src/multiplayer/useMultiplayerRoom.ts`
  - `src/multiplayer/roomService.ts`
  - `src/multiplayer/multiplayerTypes.ts`
  - `src/fresh/screens/multiplayer/MultiplayerLobbyScreen.tsx`
  - `src/fresh/screens/multiplayer/OnlineGameScreen.tsx`
- Rebuild the gameplay hook layer instead:
  - `src/multiplayer/useOnlineGame.ts`
  - possibly `src/multiplayer/useGuestMoveRelay.ts`
  - possibly `src/multiplayer/onlineGameViewModel.ts`
  - possibly `src/multiplayer/onlineGameHelpers.ts`

Why:
- Current online gameplay is split-brain.
- Host has local React board/rack/roll/winner state.
- Guest renders mirrored Firebase state.
- Guest actions are sent as commands and then replayed into the host's local state.
- That means any missed write, stale closure, rejected command, or roll animation timing issue desyncs the two phones.

Target rebuild shape:
- Firebase `roomData.gameState` should be the online source of truth.
- Host is the only device allowed to commit authoritative `gameState`.
- Guest never mutates board/rack/winner locally. Guest only:
  - selects local rack/power UI state,
  - runs local roll preview animation,
  - writes `guestMove` commands.
- Host handles both host actions and guest commands by producing the next serialized `gameState`.
- Host writes that state immediately after each accepted action, not only by hoping a later effect catches local React state.
- `useModeBoardController` can still be used for Solo/Pass/Battle. Online may need a simpler dedicated controller because online sync has different authority rules.

Fixes/rebuild applied:
- `MultiplayerLobbyScreen` now writes an initial serialized `gameState` before advancing the room phase to `playing`.
- `onlineGameHelpers.ts` now has `createInitialOnlineGameState`.
- `onlineGameHelpers.ts` now has `normalizeOnlineGameState` so the guest can safely render Firebase board/rack data even if arrays come back sparse/object-shaped.
- `useOnlineGame` now normalizes `roomData.gameState` before using it.
- `useModeBoardController` now accepts `initialBoard`, so the online host can initialize from the same room snapshot.
- Guest roll now uses the same `writePendingGuestMove` command path as other guest actions.
- Replaced `src/multiplayer/useOnlineGame.ts`.
- Deleted dead old helpers:
  - `src/multiplayer/useGuestMoveRelay.ts`
  - `src/multiplayer/onlineGameViewModel.ts`
- `useOnlineGame` no longer imports `useModeBoardController` or `useSharedRollCounts`.
- Online gameplay now reads from normalized `roomData.gameState`.
- Host commits authoritative `SerializedGameState` immediately after accepted host/guest actions.
- Guest only keeps local selection/roll preview state and writes `guestMove` commands.
- First rebuilt actions:
  - host/guest place from rack,
  - host/guest roll tile,
  - host/guest targeted EP1 board power,
  - rematch/reset.
- Follow-up online fixes:
  - Serialized live `powerUses` into `SerializedGameState`.
  - Serialized `lastSoundKey` so both phones play the same committed move/effect sound.
  - Serialized `lastEffectEvent` so EP1 board effects can animate on both phones.
  - Split online powers correctly:
    - Four Square and Tornado fire instantly from the power button.
    - Remove Emoji, Clear Row, and Clear Column select first, then fire on board tap.
  - Guest `pressSquare` commands now include `selectedPowerSlotId`, so a fast power tap + board tap cannot outrun the host relay.
  - EP1 animations are now shown once per new effect nonce, then cleared locally. This prevents stale effects like Tornado replaying when a later power is only selected.
  - Pressing a power now resets active roll mode on both online roll flows, so a board tap after selecting Clear Row/Column/Remove is treated as a power target, not a roll target.
  - Host now keeps an optimistic committed `SerializedGameState` until Firebase catches up. This makes host-side rack rerolls show immediately after a move instead of waiting for the network echo.
  - Entering roll mode now clears selected powers, which prevents roll selection and power targeting from overlapping.
- Uses existing pure helpers:
  - `resolveRackPlacement`
  - `resolveBoardRoll`
  - `resolveTargetedBoardPower`
  - `getWinner`
- `npx tsc --noEmit` passes after this rebuild.

Current manual status:
- User reports multiplayer is "good enough" after the rebuild.
- Known small residual risk: rare Tornado/roll timing weirdness may still be network or stale-event related, but it did not reproduce consistently after the latest animation/roll-mode fixes.
- Do not reopen multiplayer unless a repeatable bug appears.

Files relevant to MP debugging:
- `src/multiplayer/useOnlineGame.ts` — authoritative online gameplay hook
- `src/multiplayer/useMultiplayerRoom.ts` — `writeGameState` and `subscribeToRoom`
- `src/multiplayer/roomService.ts` — Firebase write calls
- `src/multiplayer/onlineGameHelpers.ts` — serialization, normalization, disabled roll flow

### What the next session should do

1. Treat this plan as closed.
2. Do not restart the multiplayer rebuild unless a repeatable bug appears.
3. Keep `npx tsc --noEmit` green before shipping any follow-up work.
4. If more cleanup is requested, create a new focused plan for that specific area.

---

## Completed

### ~~Removed Old Board Hook~~ — DONE

- Deleted `src/hooks/useGameBoard.ts`.
- Runtime imports of `useGameBoard` are gone.
- Verify: `grep -r "useGameBoard" src` returns nothing.

### ~~Shared Board/Rack Resolution~~ — DONE

- Added `src/lib/boardResolution.ts`.
- Added `src/lib/boardRackResolution.ts`.
- `useBoardStateController` delegates roll, targeted power, placement, and reroll into those pure helpers.

### ~~Power Manager Direction~~ — DONE

- `useGamePowerSlots` is the public EP1/EPI slot manager.
- `useEP1Powers` still exists but direct mode usage is gone.
- Verify: `grep -r "useEP1Powers" src` only shows `useEP1Powers.ts` and `useGamePowerSlots.ts`.

### ~~Solo Hook Shrink~~ — DONE

- `useSoloGameState` is now mostly orchestration.
- Added `src/hooks/solo/useSoloCpuPowers.ts`.
- Added `src/hooks/solo/useSoloDifficulty.ts`.
- CPU power use goes through the same slot/refill pattern as player powers.

### ~~Audit `useSoloCpu`~~ — DONE

- `resolveCpuRoll` now uses `resolveBoardRoll` from `boardResolution.ts`.
- Removed duplicate `applyRandomGameBoardEffect`, `createGameBoardEffectEvent`, `applyDieFace` calls.
- CPU power interception via `interceptCpuTurn` callback — stays in `useSoloCpuPowers`. ✓
- Difficulty falls through to `getSoloCpuDifficultyLevel` only as a fallback — `useSoloDifficulty` is authoritative. ✓
- Rest of `useSoloCpu` is intent + timing only. ✓

### ~~Add A Small Editing Map~~ — DONE

**Where to make each kind of change:**

| What you want to change | File(s) |
|---|---|
| Board placement / rack replenish | `src/lib/boardRackResolution.ts` |
| Roll resolution (die faces, EP1, refill) | `src/lib/boardResolution.ts` |
| Board/rack/roll state & interaction | `src/hooks/useBoardStateController.ts` |
| Power slot management (EP1 / EPI slots) | `src/hooks/useGamePowerSlots.ts` |
| Power press handling (board powers, EPI) | `src/hooks/useGamePowerPress.ts` |
| Solo CPU difficulty scaling | `src/hooks/solo/useSoloDifficulty.ts` |
| Solo CPU power interception | `src/hooks/solo/useSoloCpuPowers.ts` |
| Solo CPU move timing / intent | `src/hooks/useSoloCpu.ts` |
| Solo round flow / rewards | `src/hooks/useSoloGameState.ts` |
| Pass & Play handoff / wager | `src/fresh/screens/passplay/usePassPlayGameState.ts` |
| Battle timer / scoring / CPU behavior | `src/fresh/battle/useBattleGameState.ts` |
| Battle Todd behavior | `src/fresh/battle/useToddNervousMistake.ts` |
| Battle Nico behavior | `src/fresh/battle/useNicoBehavior.ts` |
| Online Firebase sync / host-guest authority | `src/multiplayer/useOnlineGame.ts` |

---

## Closed / Watch List

### ~~1. Manual Smoke Test The Shared Engine~~ — DONE

User confirmed all modes feel correct after a full day of play. Solo, Pass & Play, and Battle all working. MP was never working and is tracked separately.

### ~~2. Fix Multiplayer~~ — GOOD ENOUGH / WATCH

Rebuilt the online gameplay layer around serialized Firebase state. User reports it is good enough to move on. Revisit only for repeatable MP bugs.

### ~~3. Shrink `useBoardStateController`~~ — SKIPPED (intentional)

Reviewed after smoke test. All ~360 lines share state tightly — every callback reads or writes state that other callbacks also touch. The only clean extraction would be EP1 notification state (~30 line saving) but it would require passing setters back into 3 callbacks, which is net messier.

The pure logic is already in `boardResolution.ts` and `boardRackResolution.ts`. What remains is React state glue that belongs together. File is acceptable as-is.

### ~~4. Clean Non-Hook Duplication~~ — DONE

The hook architecture cleanup is no longer the main duplication source. `jscpd` pointed at:

- `src/fresh/screens/how-to/HowToSolo.tsx`
- `src/fresh/screens/how-to/HowToPassAndPlay.tsx`
- `src/fresh/screens/how-to/HowToBattle.tsx`
- `src/fresh/screens/how-to/HowToPlayMain.tsx`
- `src/components/game/HomeEmojiSky.tsx`
- `src/fresh/album/albumProgressionSpec.ts`

Do this carefully. These are shared UI/data cleanup tasks, not gameplay-engine rewrites.

Progress:
- `albumProgressionSpec.ts` now uses shared era/chapter builders instead of repeating the zero-filled Silver/Gold/Platinum/Diamond objects.
- How-To screens now keep their current route behavior but share layout/section/row/tip/win rendering through `src/fresh/screens/how-to/HowToParts.tsx`.
- `HomeEmojiSky.tsx` now uses one shared floating-particle renderer for text emojis and legendary PNGs.
- Verify: `npx jscpd src/fresh/screens/how-to src/fresh/album src/components/game/HomeEmojiSky.tsx --min-lines 20 --min-tokens 120` reports 0 clones.

---

## Verification Commands

Run after each completed step:

```bash
npx tsc --noEmit
grep -r "useGameBoard" src
grep -r "useEP1Powers" src
```

Expected:
- TypeScript passes clean.
- `useGameBoard` has no results.
- `useEP1Powers` only appears in `src/hooks/useEP1Powers.ts` and `src/hooks/useGamePowerSlots.ts`.

Duplication check when editing shared hook files:

```bash
npx jscpd src/hooks src/lib src/fresh --min-lines 20 --min-tokens 120
```
