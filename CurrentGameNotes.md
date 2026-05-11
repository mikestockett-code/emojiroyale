# Current Game Notes

## Core Problem

We have 3 game modes:

- Solo
- Battle
- Pass & Play

They are all the same game at the core. The project should not rebuild board/rack/dice/power/win/animation logic inside each mode.

The right mental model:

- We are making 3 pizzas.
- The dough, sauce, cheese, oven, cutter, and pan are shared.
- Only the toppings are different.

In code:

- Shared game systems should be used by every mode.
- Mode files should only contain mode-specific toppings.

## Shared Systems That Should Stay Shared

These are the shared ingredients:

- Board engine
- Rack logic
- Dice logic
- Roll flow
- Win detection
- EP1 effects and animations
- Power slot usage
- In-game power press behavior
- Result overlay
- Jackpot overlay
- Game visual layout
- Game area/playfield renderer
- Bottom nav

## Current Shared Files / Meaning

### Gameplay Logic

- `src/hooks/useGameBoard.ts`
  - Shared board engine.
  - Handles board state, rack state, selected emoji, placing tiles, roll flow hookup, targeted EP1 power coordination, EP1 display state.
  - This is not a visual layout file.

- `src/lib/diceLogic.ts`
  - Shared dice cell/build/apply logic.

- `src/hooks/useRollFlow.ts`
  - Shared roll interaction/preview/animation flow.

- `src/lib/winDetection.ts`
  - Shared win detection.

- `src/lib/gameBoardEffects.ts`
  - Shared EP1 board-effect math: row clear, column clear, eraser, random EP1, effect event data.

- `src/lib/battlePowerEffects.ts`
  - Shared board powers for four-square and tornado.
  - Name is misleading because these powers are used outside Battle too.

- `src/lib/sharedRackLogic.ts`
  - Shared rack creation.

### Power Logic

- `src/components/power-selection/usePowerSlots.ts`
  - Setup-screen selection of power slots.
  - Used before the game starts.

- `src/hooks/useEP1Powers.ts`
  - EP1 usage counts.

- `src/hooks/useEpiPowers.ts`
  - EPI usage counts.

- `src/hooks/useGamePowerSlots.ts`
  - Turns selected power IDs into live in-game slot data.

- `src/hooks/useGamePowerPress.ts`
  - Shared in-game power button/tap behavior.
  - This should be used by modes instead of each mode hand-writing four-square/tornado/consume/clear-selected behavior.

### Visual Game Area

- `src/fresh/shared/GameModeScreenShell.tsx`
  - Shared outer wrapper for game screens.
  - Renders one `FreshGameArea`.
  - Renders shared jackpot overlay.
  - Mode-specific overlays are children.

- `src/fresh/shared/FreshGameArea.tsx`
  - Adapter between mode screens and `GameArea`.
  - Wires roll flow to board presses and preview props.

- `src/components/game/GameArea/GameArea.tsx`
  - Shared playfield composer.
  - Places the top panel, board art, board renderer, win line, EP1 overlay, preview overlay, rack, power slots, bottom nav, and handoff overlay.
  - It should not contain gameplay rules.

- `src/components/game/GameArea/useGameLayout.ts`
  - Visual placement map only.
  - Calculates board/rack/background coordinates and cell positions.
  - This is board placement/geometry, not board game logic.

- `src/components/game/GameArea/GameBoard.tsx`
  - Shared board renderer.

## Correct Architecture Rule

### Screens

Game screens should render through:

- `GameModeScreenShell`
- `FreshGameArea`

Examples:

- `src/fresh/screens/SoloGameScreen.tsx`
- `src/fresh/screens/BattleGameScreen.tsx`
- `src/fresh/screens/PassPlayGameScreen.tsx`

These screens should mostly:

- call the mode state hook
- build labels/colors/view props
- render shared game shell
- render mode-specific result overlay/buttons

### State Hooks

State hooks should not render `FreshGameArea`.

State hooks should use shared logic hooks:

- `useGameBoard`
- `useRollFlow` through `useGameBoard`
- `useSoloCpu` or future shared CPU hook
- `useGamePowerSlots`
- `useGamePowerPress`
- shared reward helpers
- shared win detection

Examples:

- `src/hooks/useSoloGameState.ts`
- `src/fresh/battle/useBattleGameState.ts`
- `src/fresh/screens/passplay/usePassPlayGameState.ts`

## Desired Next Architecture

We likely need:

`src/hooks/useCpuGameStateCore.ts`

This would be shared by Solo and Battle because both are human-vs-CPU modes.

Shared CPU-mode core should own:

- player1/player2 turn switching
- shared `useGameBoard` setup
- CPU hook wiring
- CPU thinking state
- shared roll counters if possible
- shared win check handoff points
- shared board reset for next round

Then:

### `useSoloGameState`

Should only add Solo toppings:

- solo wager
- solo rewards
- solo result overlay state/text
- high score/safe score support

### `useBattleGameState`

Should only add Battle toppings:

- battle timer
- battle score to 2000
- Todd/stage CPU difficulty
- Todd nervous mistake behavior
- battle rewards/puzzle stage rules

### `usePassPlayGameState`

Different because no CPU. It should still share:

- `useGameBoard`
- `useGamePowerSlots`
- `useGamePowerPress`
- shared rewards
- shared result overlay patterns

Pass & Play toppings:

- handoff
- two human profiles
- wager payout
- golden phoenix holder rules

## Recent Cleanup Already Done

- Added `GameModeScreenShell`.
- Solo/Battle/Pass game screens now render through shared shell.
- Added `useGamePowerPress` for shared in-game power press behavior.
- Battle and Pass & Play use `useGamePowerPress`.
- Moved Todd nervous state to `useToddNervousMistake`.
- Moved Battle rewards to `useBattleRewards`.
- Split `SoloTopPanel` into smaller files:
  - `SoloTopPanel.tsx`
  - `SoloTopPanel.styles.ts`
  - `FrozenClockOverlay.tsx`
  - `TopPanelThoughtBubble.tsx`
  - `topPanelLayout.ts`
- Moved Solo screen-only pieces out of `SoloGameScreen`:
  - `SoloEp1StatusPill.tsx`
  - `DevWizardJackpotButton.tsx`
  - `useDevWizardJackpot.ts`
  - `useSoloLossHighScore.ts`
- Collapsed duplicate Pass & Play power setup screens into one:
  - `PassPlayPowerScreen.tsx`
- Deleted duplicate:
  - `PassPlayPowerP1Screen.tsx`
  - `PassPlayPowerP2Screen.tsx`

## Current Concern

`useBattleGameState.ts` is still too big for how young Battle mode is.

Reason:

- Battle has CPU wiring, timer, score, powers, rewards, Todd behavior, reset, and win handling all in one file.
- Solo already has smaller helper hooks.
- Battle should mirror Solo’s structure more.

The next safe cleanup is not to add more Battle-only hooks randomly.

The next safe cleanup is to identify what Solo and Battle both do, then create a shared CPU-mode core hook.

## Important Rule For Future AI

Before adding a new file or new mode-specific logic, check if the behavior already exists in shared systems.

Do not create a Battle-only or Solo-only version of:

- board logic
- rack logic
- dice logic
- roll logic
- win detection
- EP1 animation
- power press behavior
- result overlay
- reward preview display

Only create mode-specific code for actual toppings:

- Solo wager/reward policy
- Battle story/stage/Todd policy
- Pass & Play handoff/two-player/wager policy

old board import { useWindowDimensions } from 'react-native';

export function useGameLayout(layoutScale = 1, verticalOffset = 0) {
  const { width, height } = useWindowDimensions();

  const imgWidth          = width * 1.19 * layoutScale;
  const imgRenderedHeight = imgWidth * 1.5;
  const imgTop            = height * 0.12 + (height - imgRenderedHeight) / 2 + height * verticalOffset;
  const imgLeft           = -(imgWidth - width) / 2;
  const rackPadTop        = imgTop + imgRenderedHeight * 0.6746 - height * 0.012;
  const anchorX           = imgLeft + imgWidth * 0.508 - width * 0.01;
  const anchorY           = imgTop + imgRenderedHeight * 0.3696 + height * 0.015;
  const cellSpacing       = imgWidth * 0.122;
  const cellSize          = cellSpacing * 0.88;

  const colXOffsets = [width * 0.026, width * 0.01, 0, -width * 0.013, -width * 0.027];
  const rowYOffsets = [height * 0.018, height * 0.01, 0, -height * 0.005, -height * 0.012];

  const boardCells = Array.from({ length: 25 }, (_, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    return {
      x: anchorX + (col - 2) * cellSpacing + colXOffsets[col],
      y: anchorY + (row - 2) * cellSpacing + rowYOffsets[row],
    };
  });

  return {
    width, height,
    imgWidth, imgRenderedHeight, imgTop, imgLeft,
    rackPadTop,
    anchorX, anchorY, cellSize,
    boardCells,
  };
}
