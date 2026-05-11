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

  return (
    <View style={{ position: 'absolute', top: rackPadTop, left: '4%', right: '4%', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', zIndex: 20 }}>
        {rack.map((stickerId, i) => {
          const isSelected = selectedEmojiIndex === i;
          const scale      = rackScales[i];

          const tile = (
            <Pressable
              key={i}
              onPress={() => {
                playSound('place');
                onSelectRackIndex?.(i);
              }}
              style={({ pressed }) => ({
                width: 37, height: 37,
                borderWidth: 2,
                borderColor: isSelected ? '#fff' : rackHighlightColor,
                borderRadius: 18,
                backgroundColor: rackTileColor,
                alignItems: 'center', justifyContent: 'center',
                marginLeft: i === 0 ? 0 : -6,
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
                  <Image source={s.imageSource} style={{ width: 26, height: 26 }} resizeMode="contain" />
                ) : (
                  <Text style={{ fontSize: 22 }}>{s.emoji ?? '★'}</Text>
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
