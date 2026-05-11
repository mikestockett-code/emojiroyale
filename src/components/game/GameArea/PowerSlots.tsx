import React from 'react';
import { Image, Pressable, Text } from 'react-native';
import { POWER_IMAGES } from './constants';
import type { PowerSlot } from './types';
import { useAudioContext } from '../../../fresh/audio/AudioContext';

type Props = {
  powerSlots: PowerSlot[];
  onPowerSlotPress?: (slotId: string) => void;
  isHandoffVisible: boolean;
  width: number;
  rackPadTop: number;
  height: number;
};

export function PowerSlots({ powerSlots, onPowerSlotPress, isHandoffVisible, width, rackPadTop, height }: Props) {
  const { playSound } = useAudioContext();
  if (powerSlots.length === 0 || isHandoffVisible) return null;

  return (
    <>
      {(['left', 'right'] as const).map((side, i) => {
        const slot = powerSlots[i];
        if (!slot) return null;
        return (
          <Pressable
            key={side}
            onPress={() => {
              playSound('button');
              onPowerSlotPress?.(slot.slotId);
            }}
            style={({ pressed }) => ({
              position: 'absolute',
              [side]: width * 0.01,
              top: rackPadTop + height * 0.055,
              opacity: pressed ? 0.7 : 1,
              zIndex: 25,
            })}
          >
            {slot.powerId && POWER_IMAGES[slot.powerId] ? (
              <Image source={POWER_IMAGES[slot.powerId]} style={{ width: 88, height: 88 }} resizeMode="contain" />
            ) : (
              <Text style={{ fontSize: 36 }}>{slot.icon}</Text>
            )}
          </Pressable>
        );
      })}
    </>
  );
}
