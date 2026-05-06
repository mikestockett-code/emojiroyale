import React from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import { getStickerById } from '../../../lib/stickerHelpers';
import { ROLL_BUTTON } from './constants';
import type { StickerId } from '../../../types';
import { useAudioContext } from '../../../fresh/audio/AudioContext';

type Props = {
  rack: StickerId[];
  selectedEmojiIndex: number | null;
  rackScales: Animated.Value[];
  rackTileColor: string;
  rackHighlightColor: string;
  rackPadTop: number;
  height: number;
  onSelectRackIndex?: (index: number) => void;
  onRoll?: () => void;
  rollDisabled: boolean;
};

export function StickerRack({
  rack,
  selectedEmojiIndex,
  rackScales,
  rackTileColor,
  rackHighlightColor,
  rackPadTop,
  height,
  onSelectRackIndex,
  onRoll,
  rollDisabled,
}: Props) {
  const { playSound } = useAudioContext();
  const row1 = rack.slice(0, 4);
  const row2 = rack.slice(4, 8);

  return (
    <View style={{ position: 'absolute', top: rackPadTop, left: '8%', right: '8%', alignItems: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ zIndex: 20 }}>
          {[row1, row2].map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'center', marginTop: rowIndex === 0 ? 0 : -4 }}>
              {row.map((stickerId, i) => {
                const globalIndex = rowIndex * 4 + i;
                const isSelected  = selectedEmojiIndex === globalIndex;
                const scale       = rackScales[globalIndex];

                const tile = (
                  <Pressable
                    key={i}
                    onPress={() => {
                      playSound('place');
                      onSelectRackIndex?.(globalIndex);
                    }}
                    style={({ pressed }) => ({
                      width: 44, height: 44,
                      borderWidth: 2,
                      borderColor: isSelected ? '#fff' : rackHighlightColor,
                      borderRadius: 22,
                      backgroundColor: rackTileColor,
                      alignItems: 'center', justifyContent: 'center',
                      marginLeft: i === 0 ? 0 : -8,
                      opacity: pressed ? 0.7 : 1,
                      shadowColor: isSelected ? '#fff' : 'transparent',
                      shadowOpacity: isSelected ? 0.6 : 0,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 0 },
                    })}
                  >
                    {(() => {
                      const s = getStickerById(stickerId);
                      return s.imageSource ? (
                        <Image source={s.imageSource} style={{ width: 28, height: 28 }} resizeMode="contain" />
                      ) : (
                        <Text style={{ fontSize: 26 }}>{s.emoji ?? '★'}</Text>
                      );
                    })()}
                  </Pressable>
                );

                return scale ? (
                  <Animated.View key={i} style={{ transform: [{ scale }] }}>
                    {tile}
                  </Animated.View>
                ) : tile;
              })}
            </View>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => {
          playSound('button');
          onRoll?.();
        }}
        disabled={rollDisabled}
        style={({ pressed }) => ({
          marginTop: 4 - height * 0.04,
          opacity: pressed ? 0.7 : rollDisabled ? 0.35 : 1,
        })}
      >
        <Image
          source={ROLL_BUTTON}
          style={{ width: 469, height: 116, transform: [{ perspective: 400 }, { rotateX: '25deg' }] }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}
