# Refactor Plan

## Goal

Make the code match the visual truth of the app:

- Modes are mostly the same system with different config.
- Solo, Pass & Play, Battle, and Multiplayer should reuse shared submenu, power setup, board, and style primitives.
- Delete duplicated one-off code as each shared piece replaces it.

Do not redesign visuals unless a bug forces it.
This is a code-shape refactor, not a UI redesign.

---

## Rules

- Keep each refactor small and testable.
- Run `npx tsc --noEmit` after each completed section.
- Do not run Metro unless asked.
- When a task is complete, delete that task from this plan.
- Prefer shared components/config over new mode-specific files.
- Do not merge CPU behavior yet.
- Do not merge reward engines yet; only extract small pure helpers.

---

## Do Not Do Yet

- Do not merge Solo CPU, Battle CPU, and Online relay.
- Do not create one giant reward engine.
- Do not redesign submenus visually.
- Do not add new mode-specific style files unless there is no shared pattern.
- Do not bring back `submenuStyles.ts` as a broad bucket.
