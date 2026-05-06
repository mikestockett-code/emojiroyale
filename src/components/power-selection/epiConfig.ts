import type { BattlePowerId } from '../../types';
import type { PowerConfig } from './ep1Config';

export const EPI_CONFIG: PowerConfig[] = [
  {
    powerId: 'power-clock-freeze',
    label: 'Power Freeze',
    imageSource: require('../../../assets/PowersSlots/PowerSlotBattleMode/powerfreeze.png'),
  },
  {
    powerId: 'power-plus-10-seconds',
    label: '+10 Seconds',
    imageSource: require('../../../assets/PowersSlots/PowerSlotBattleMode/10secondsadded.png'),
  },
  {
    powerId: 'power-reverse-time',
    label: 'Reverse Time',
    imageSource: require('../../../assets/PowersSlots/PowerSlotBattleMode/reversetime.png'),
  },
  {
    powerId: 'power-rerack',
    label: 'Rerack',
    imageSource: require('../../../assets/PowersSlots/PowerSlotBattleMode/rerack.png'),
  },
];

export const EPI_IMAGES: Partial<Record<BattlePowerId, any>> = Object.fromEntries(
  EPI_CONFIG.map((p) => [p.powerId, p.imageSource])
);
