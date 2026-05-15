# Refactor Plan

## Goal

Finish the second layer of cleanup: the shared board/rack/roll/power engine is in place, but the mode-flow hooks are still larger than they should be.

The next target is to make Solo, Pass & Play, and Battle share boring flow mechanics while keeping their actual mode rules separate.

Do not redesign visuals. Do not change gameplay rules on purpose. This is code-shape work only.

---

## Current Truth

Already shared:

- Board/rack/roll state: `src/hooks/useBoardStateController.ts`
- Mode-facing board engine: `src/hooks/useModeBoardController.ts`
- Roll/power resolution helpers: `src/lib/boardResolution.ts`, `src/lib/boardRackResolution.ts`
- Player power slots/presses: `src/hooks/useGamePowerSlots.ts`, `src/hooks/useGamePowerPress.ts`
- Setup screens, carousel screens, game area UI

Still too mode-specific:

- `src/hooks/useSoloGameState.ts`
- `src/fresh/screens/passplay/usePassPlayGameState.ts`
- `src/fresh/battle/useBattleGameState.ts`
- `src/hooks/useSoloCpu.ts`
- `src/hooks/solo/useSoloDifficulty.ts`
- `src/hooks/solo/useSoloRound.ts`

Important: `useSoloGameState`, `usePassPlayGameState`, and `useBattleGameState` should still exist. They should become smaller orchestration hooks, not disappear.

---

## Rules

- Keep each refactor small and testable.
- Run `npx tsc --noEmit` after each completed section.
- Do not run Metro unless asked.
- Prefer shared hooks/helpers over new mode-specific files.
- Do not touch multiplayer unless fixing a repeatable bug.
- Do not merge reward engines yet; extract only small shared mechanics.
- Do not merge Todd/Nico/Solo CPU personalities into one behavior file.

---

## Tomorrow Start Here

### 1. Rename Misleading Shared CPU Hook

`useSoloCpu.ts` is already used by Battle, so the name is wrong.

Change:

- `src/hooks/useSoloCpu.ts` -> `src/hooks/useCpuTurn.ts`
- exported hook: `useSoloCpu` -> `useCpuTurn`
- type export: keep or rename `CpuTurnContext` in the same file

Update imports in:

- `src/hooks/useSoloGameState.ts`
- `src/fresh/battle/useBattleGameState.ts`

Verification:

```bash
rg "useSoloCpu" src
npx tsc --noEmit
```

Expected result:

- No `useSoloCpu` import remains.
- The hook name now matches what it does: shared CPU turn timing/intent.

### 2. Extract Shared Round State

Create:

- `src/hooks/useModeRoundState.ts`

It should own the boring repeated round/current-player mechanics:

- `roundNumber`
- `currentPlayer`
- optional CPU thinking flag
- `setCurrentPlayer`
- `setIsCpuThinking`
- `advanceRound`
- `resetRound`

Use it first in Solo only, replacing:

- `src/hooks/solo/useSoloRound.ts`

Then, only if Solo passes TypeScript, use the same hook in Battle for:

- `roundNumber`
- `currentPlayer`
- the `handleContinue` round increment
- the `handleBattleReset` round reset

Do not force Pass & Play into this yet. Pass & Play does not have normal round count; it has handoff/rematch flow.

Verification:

```bash
npx tsc --noEmit
```

Expected result:

- `useSoloRound.ts` can be deleted after Solo imports `useModeRoundState`.
- Battle loses some inline round/current-player state.
- No behavior changes.

### 3. Extract Adaptive CPU Difficulty

Create:

- `src/hooks/useAdaptiveCpuDifficulty.ts`

It should own:

- adaptive bump state
- clamping to max difficulty
- reset bump
- helper to bump by delta

Use it in:

- `src/hooks/solo/useSoloDifficulty.ts`
- `src/fresh/battle/useBattleGameState.ts`

Do not make Solo and Battle difficulty rules identical. Only share the state mechanics.

Solo still decides:

- base difficulty from `getSoloCpuDifficultyLevel`
- suppress legendary wins in practice rounds

Battle still decides:

- base difficulty from `getCpuBaseDifficulty`
- Todd/Nico max difficulty
- score threshold bumps
- epic/performance bumps

Verification:

```bash
npx tsc --noEmit
```

Expected result:

- Solo difficulty file gets smaller.
- Battle difficulty state block gets smaller.
- Gameplay difficulty behavior stays the same.

---

## Later, Not First

### Shared Tie Wiring

`useTieDetection` is already shared, but every mode wires it manually.

Possible later helper:

- `useModeTieDetection`

Do this only if the wiring is truly repeated after round/difficulty cleanup.

### Shared Continue / Restart Helpers

Solo and Battle both reset board, powers, rewards, round state, and CPU state, but each mode has different extras.

Possible later helper:

- `createModeResetActions`
- or small pure reset helper functions

Do not create one giant reset hook unless the duplication becomes obvious after steps 1-3.

### Rewards

Leave rewards alone for now.

Solo rewards, Pass & Play wager rewards, and Battle stage rewards have different product rules. Extracting this too early will make a fake shared system that is harder to edit.

---

## Do Not Do

- Do not restart the architecture.
- Do not create one giant `useEmojiRoyaleGame` hook.
- Do not merge Solo CPU, Battle Todd, Battle Nico, and Online relay into one behavior system.
- Do not touch multiplayer unless the user has a repeatable bug.
- Do not delete mode hooks just because their names include a mode.
- Do not change visual screens during this pass.
