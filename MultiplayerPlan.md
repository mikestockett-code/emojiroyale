# Multiplayer Mode Plan

## Goal

Build online multiplayer cleanly from scratch.
No pass-and-play inheritance.
No handoff. No wager cards.
Production-ready from day one, runs free until we have real players.

---

## Mental Model

Same pizza rule as the other modes.

- `useGameBoard` is the shared dough.
- Multiplayer is just a new set of toppings on top of it.
- The only new thing multiplayer adds is a network layer between two devices.

Host runs `useGameBoard` locally.
Host writes the result to Firebase after every move.
Guest reads Firebase and mirrors it.
Guest sends move requests back to Host via Firebase.
Host applies them and writes the next state.

This is called a relay architecture. It is simple and correct when the Host is the only authority that mutates game state.
The Guest never decides whether a move is valid. The Guest only requests a move.
The Host validates the request against its local board, applies it, then publishes the next snapshot.

---

## Why Firebase Realtime Database (RTDB)

- Already in the project (Firebase project is set up).
- Built for live game sync. Low latency. Simple.
- Free tier: 100 simultaneous connections = ~50 concurrent games. Enough to start.
- Pure JS SDK = OTA compatible. No native rebuild needed.
- When we grow: upgrade to Blaze (pay-as-you-go). Still cheap at small scale.

---

## Why Anonymous Auth

Firebase Anonymous Auth is free and requires nothing from the player.
It gives every device a stable Firebase UID automatically.

Benefits:
- Reconnection: player backgrounds the app and comes back to their active game.
- Security rules can be scoped to the room creator's UID.
- No email, password, or signup required. Invisible to the player.

Enable it in Firebase Console → Authentication → Sign-in method → Anonymous → Enable.

Player-facing login is not needed.
The app signs in silently with Firebase Anonymous Auth and uses the active local profile name for display.

---

## Current Project Decisions

- Firebase app: Emoji Royale.
- Firebase project ID: `emoji-royale6741`.
- Firebase app ID: `1:338154552013:web:681518f57d7a5fd9218784`.
- Firebase config lives in `src/firebase/firebaseConfig.ts` for now because this is still private TestFlight/family testing.
- Do not import Firebase Analytics. It is not needed and can break React Native.
- Multiplayer button is visible in the main menu for testing.
- Testing target is two real devices.
- Player names come from the active local profile. No typed multiplayer name field for now.
- First playable version should include powers, but basic placement sync must work first.
- If Host leaves, mark the room `done`, then delete after a short delay.

---

## Firebase RTDB Schema

```
rooms/
  {roomCode}/
    phase: 'lobby' | 'playing' | 'done'
    hostUid: string           ← Firebase anonymous auth UID
    guestUid: string | null
    hostName: string
    guestName: string | null
    hostPowers: { slot1: string|null, slot2: string|null } | null
    guestPowers: { slot1: string|null, slot2: string|null } | null
    wagerMode: 'none'         ← always none for now
    isGoldenPhoenixEntry: boolean
    gameState: SerializedGameState | null   ← Host writes this
    guestMove: GuestMove | null            ← Guest writes this
    processedGuestMoveId: string | null    ← Host writes this after applying a move
    goldenPhoenixWinner: string | null
    presence:
      host:
        connected: boolean
        lastSeen: number
      guest:
        connected: boolean
        lastSeen: number
    createdAt: number         ← Unix ms timestamp, for expiry
```

Room codes: 6 uppercase alphanumeric, no ambiguous chars (no O, 0, I, 1).

Rooms older than 24 hours are considered expired.
Client checks and deletes on join. No Cloud Functions needed yet.

---

## Current Implementation Status

Done:
- Firebase config and anonymous auth files exist.
- Firebase Analytics is intentionally not imported.
- Anonymous Auth is enabled in Firebase Console.
- Realtime Database is enabled.
- Temporary testing rules are in Firebase Console.
- `src/multiplayer/multiplayerTypes.ts` exists.
- `src/multiplayer/roomService.ts` exists.
- `src/multiplayer/useMultiplayerRoom.ts` exists.
- `useGameBoard` has `placeFromRackIndex()` so Host can apply Guest placement without fake UI taps.
- AppRouter owns one `mpRoom` controller and passes it to lobby/game screens.
- Routes exist for `multiplayerLobby` and `onlineGame`.
- Main menu has visible `mp.png` button.
- Multiplayer lobby exists.
- Lobby flow is now correct: create room, show code, then pick powers; guest joins, then picks powers.
- Host can share the room code through the native share sheet to reduce typo risk.
- Host can start only after Guest joined and both players picked powers.
- Lobby uses `luxuryTheme` styles and scroll-safe layout.
- `src/multiplayer/useOnlineGame.ts` exists.
- `src/multiplayer/onlineGameHelpers.ts` exists; helper logic was pulled out of `useOnlineGame`.
- `OnlineGameScreen` renders through `GameModeScreenShell` and `FreshGameArea`.
- TypeScript passes with `npx tsc --noEmit`.

Current first-playable behavior:
- Host owns the real `useGameBoard` board.
- Host writes `SerializedGameState` snapshots to RTDB.
- Guest mirrors the latest `gameState`.
- Guest sends `selectRackIndex`, `pressSquare`, and `pressPowerSlot` requests.
- Host checks the Guest UID, turn, duplicate move id, and current board before applying a move.
- Each phone shows its own rack, not the current turn player's rack.
- Each phone builds power buttons for its own player, not the host/current local hook player.
- Each phone's rack color/highlight stays tied to its own side.
- Used powers grey out through the shared `PowerSlots` renderer, so this behavior is shared with Solo, Battle, and Pass & Play.
- Power picker album locks are temporarily bypassed with `UNLOCK_ALL_POWERS_FOR_TESTING` in `src/components/power-selection/PowerSection.tsx`.
- Online HUD is local-first: `YOU` and `OPP`.
- Top-right game badge says `BATTLE`, not the room code.
- Rolls are disabled for online mode for now.

Known testing note:
- If Host leaves normally, the room is marked `done` and deleted after 5 seconds.
- If the app is killed or a test gets messy, old rooms may stay in Firebase. It is safe to delete old test rooms manually from the Firebase console.

Temporary Firebase rules for testing:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Do not switch to stricter field-level rules until the two-device flow is proven.

---

## Next Work

1. Test create room on device A and join room on device B.
2. Confirm Host sees the room code before power selection.
3. Confirm Host can share the room code by text/share sheet.
4. Confirm Guest can join with exactly the shown/shared code.
5. Confirm both devices reach power selection after room connection.
6. Confirm Host waiting room sees Guest joined and Guest powers ready.
7. Confirm Host start moves both devices into online game.
8. Test each phone has a different visible rack and gets a fresh rack after its own placement.
9. Test Host placement and Guest board mirroring.
10. Test Guest placement request and Host-applied board update.
11. Test each phone sees only its own selected powers.
12. Test basic EP1 power requests.
13. Fix any real-device RTDB/auth timing bugs.
14. Add disconnection overlay using existing presence data.
15. Add proper online rematch state reset for both devices.
16. Re-enable or design online rolls after placement/power sync is stable.

---

## Reconnection Flow

When app is backgrounded mid-game and comes back:

1. `useMultiplayerRoom` checks if `roomCode` is still in state.
2. If yes, resubscribes to the room.
3. If room still exists and phase === 'playing', resumes from current `gameState`.
4. If room is gone (expired or opponent deleted it), returns to menu.

This works because Anonymous Auth UID is stable across app restarts.

Also refresh this player's presence on app foreground:
- Set `presence/{role}/connected = true`.
- Set `presence/{role}/lastSeen = Date.now()`.
- Re-register `onDisconnect()`.

---

## Room Cleanup (No Cloud Functions Needed)

On `joinRoom`:
- Before writing guest to room, fetch all rooms and delete any where `createdAt` is older than 24 hours and phase is 'done' or 'lobby'.
- Keeps the database clean without needing Blaze plan.
- Abandoned test rooms may remain visible in Firebase until this cleanup runs. It is fine to delete old test rooms manually in the console.

On `leaveRoom`:
- If host leaves: set phase to 'done', then delete room after 5 seconds.
- If guest leaves: set guestUid to null, host sees "Opponent disconnected".

---

## Golden Phoenix Integration

Works the same as Pass & Play:
- If `isGoldenPhoenixEntry === true`, wagerMode is 'legendary'.
- Winner's name is written to `goldenPhoenixWinner` in the room by Host.
- Guest reads `goldenPhoenixWinner` from roomData and calls `setGoldenPhoenixHolderName` to update local AsyncStorage.
- Host does the same when it detects `isGoldenPhoenixWin`.

---

## What We Are NOT Doing

- No Firestore. RTDB is the right tool for this.
- No Cloud Functions yet. Not needed until we have real players.
- No matchmaking. Room codes only. Family/friends play.
- No chat. Not needed.
- No ranked mode. Not needed.
- No spectating. Not needed.
- No wager card selection screen. wagerMode is always determined by entry point.

---

## Key Shared Files

- `src/hooks/useGameBoard.ts` — core engine. Use this directly.
- `src/lib/winDetection.ts` — win detection. Already wired into useGameBoard.
- `src/lib/sharedRackLogic.ts` — rack creation.
- `src/hooks/useGamePowerSlots.ts` — power slot wiring.
- `src/hooks/useGamePowerPress.ts` — power press behavior.
- `src/fresh/shared/GameModeScreenShell.tsx` — outer screen wrapper.
- `src/fresh/shared/FreshGameArea.tsx` — game area adapter.
- `src/fresh/shared/GameResultOverlay.tsx` — result overlay.
- `src/components/game/power-setup/PassPlayPowerScreen.tsx` — power pick screen (shared, reuse for MP lobby).

---

## Notes For Next Session

- Do not run Metro unless asked. User will push/test on phone.
- Start by reading real-device behavior from the user, then fix the smallest failing multiplayer slice.
- Keep Firebase rules simple during testing: authenticated read/write under `rooms`.
- Do not rework the lobby flow back to power-first. Correct flow is Host create room → show code → powers.
- Power cards are intentionally all unlocked during testing. Restore album-based locks after gameplay testing.
- Old test rooms can be manually deleted from Firebase console.

## Shared Menu Refactor Notes

- Visual truth: Solo, Pass & Play, Multiplayer, and Battle are mostly the same patterns with different config.
- `src/fresh/shared/submenu/CarouselSubmenuScreen.tsx` now owns the shared carousel/start-button submenu shell.
- Solo and Pass & Play now use `CarouselSubmenuScreen` instead of separate carousel/start button layouts.
- `src/components/game/power-setup/PassPlayPowerScreen.tsx` is now the shared power setup screen.
- Battle uses the shared power setup screen with `allowEpi`; Solo, Pass & Play, and Multiplayer stay EP1-only.
- Removed fake broad `submenuStyles.ts`; avoid reintroducing one-off submenu buckets.
