import type { BattlePowerId, BattlePowerType } from '../types';

export const BATTLE_TEST_POWERS: {
  id: BattlePowerId;
  label: string;
  icon: string;
  type: BattlePowerType;
  imageSource: any;
  shortDescription: string;
  detail: string;
}[] = [
  {
    id: 'power-torture-rack',
    label: 'Torture Rack',
    icon: '🪑',
    type: 'EP1',
    imageSource: require('../../assets/PowersSlots/TortureRackSelector.png'),
    shortDescription: 'Select one rack emoji and lock it for the rest of the battle.',
    detail: 'Select one emoji in your battle rack. That rack slot stays locked and will not reroll for the rest of this battle.',
  },
  {
    id: 'power-clear-row',
    label: 'Clear Row',
    icon: '➡️',
    type: 'EP1',
    imageSource: require('../../assets/PowersSlots/RowClearSelector.png'),
    shortDescription: 'Clear every tile in the chosen row.',
    detail: 'Tap any tile on the board and the entire row will be removed. This spends one power use.',
  },
  {
    id: 'power-clear-column',
    label: 'Clear Column',
    icon: '⬇️',
    type: 'EP1',
    imageSource: require('../../assets/PowersSlots/ColumnClear.png'),
    shortDescription: 'Clear every tile in the chosen column.',
    detail: 'Tap any tile on the board and the entire column will be removed. This spends one power use.',
  },
  {
    id: 'power-remove-emoji',
    label: 'Remove Emoji',
    icon: '✖️',
    type: 'EP1',
    imageSource: require('../../assets/PowersSlots/TheEraserSelector.png'),
    shortDescription: 'Remove one chosen tile from the board.',
    detail: 'Tap any tile on the board to remove that single emoji from play.',
  },
  {
    id: 'power-four-square',
    label: 'Four Square',
    icon: '🟪',
    type: 'EP1',
    imageSource: require('../../assets/PowersSlots/foursquare.png'),
    shortDescription: 'Erase a random 2×2 corner of the board.',
    detail: 'One of the four corners (top-left, top-right, bottom-left, bottom-right) is chosen at random and all four tiles in that corner are removed.',
  },
  {
    id: 'power-tornado',
    label: 'The Tornado',
    icon: '🌪️',
    type: 'EP1',
    imageSource: require('../../assets/PowersSlots/thetornado.png'),
    shortDescription: 'Randomly shuffle every emoji on the board.',
    detail: 'All placed emojis are picked up and dropped back onto the board in a completely random order.',
  },
  {
    id: 'power-plus-10-seconds',
    label: '+10 Seconds',
    icon: '⏱️',
    type: 'EPI',
    imageSource: require('../../assets/PowersSlots/PowerSlotBattleMode/10secondsadded.png'),
    shortDescription: 'Add 10 seconds to the battle timer.',
    detail: 'Instantly adds 10 seconds to the shared battle timer. No target selection is needed.',
  },
  {
    id: 'power-reverse-time',
    label: 'Reverse Time',
    icon: '⏪',
    type: 'EPI',
    imageSource: require('../../assets/PowersSlots/PowerSlotBattleMode/reversetime.png'),
    shortDescription: 'Reset the battle timer back to 130 seconds.',
    detail: 'Instantly resets the round timer to 130 seconds.',
  },
  {
    id: 'power-rerack',
    label: 'Rerack',
    icon: '🔄',
    type: 'EPI',
    imageSource: require('../../assets/PowersSlots/PowerSlotBattleMode/rerack.png'),
    shortDescription: 'Swap your rack for all new emojis.',
    detail: 'Refreshes your entire rack with new emojis. Any emoji locked by Torture Rack stays in place. Cannot be used on the same turn you used Torture Rack.',
  },
  {
    id: 'power-clock-freeze',
    label: 'Power Freeze',
    icon: '❄️',
    type: 'EPI',
    imageSource: require('../../assets/PowersSlots/PowerSlotBattleMode/powerfreeze.png'),
    shortDescription: 'Freeze the battle timer for the rest of this round.',
    detail: 'Pauses the shared battle timer for exactly one round. The board, flips, and other powers still work normally, and the timer resumes next round.',
  },
];
