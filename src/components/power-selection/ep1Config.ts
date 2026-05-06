import type { BattlePowerId } from '../../types';

export type PowerConfig = {
  powerId: BattlePowerId;
  label: string;
  imageSource: any;
};

export const EP1_CONFIG: PowerConfig[] = [
  {
    powerId: 'power-torture-rack',
    label: 'Torture Rack',
    imageSource: require('../../../assets/PowersSlots/TortureRackSelector.png'),
  },
  {
    powerId: 'power-remove-emoji',
    label: 'Remove Emoji',
    imageSource: require('../../../assets/PowersSlots/TheEraserSelector.png'),
  },
  {
    powerId: 'power-clear-row',
    label: 'Clear Row',
    imageSource: require('../../../assets/PowersSlots/RowClearSelector.png'),
  },
  {
    powerId: 'power-clear-column',
    label: 'Clear Column',
    imageSource: require('../../../assets/PowersSlots/ColumnClear.png'),
  },
  {
    powerId: 'power-four-square',
    label: 'Four Square',
    imageSource: require('../../../assets/PowersSlots/foursquare.png'),
  },
  {
    powerId: 'power-tornado',
    label: 'The Tornado',
    imageSource: require('../../../assets/PowersSlots/thetornado.png'),
  },
];

export const EP1_IMAGES: Partial<Record<BattlePowerId, any>> = Object.fromEntries(
  EP1_CONFIG.map((p) => [p.powerId, p.imageSource])
);
