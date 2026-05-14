import React from 'react';
import { Image, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SharedSubmenuShell } from '../SharedSubmenuShell';
import type { ImageSourcePropType } from '../../../types';
import { styles } from './CarouselSubmenuScreen.styles';

const START_IMG = require('../../../../assets/buttons/start.png');

type DotItem = string | { id: string };

type Props = {
  backgroundSource: ImageSourcePropType;
  bottomNav: React.ReactNode;
  deck: React.ReactNode;
  deckWrapStyle?: StyleProp<ViewStyle>;
  dots?: DotItem[];
  selectedDotId?: string;
  statusText?: string | null;
  startDisabled?: boolean;
  startMessage?: string | null;
  messageVariant?: 'plain' | 'pill';
  startPlacement?: 'absolute' | 'flow';
  onStart?: () => void;
};

function dotId(dot: DotItem) {
  return typeof dot === 'string' ? dot : dot.id;
}

export function CarouselSubmenuScreen({
  backgroundSource,
  bottomNav,
  deck,
  deckWrapStyle,
  dots,
  selectedDotId,
  statusText,
  startDisabled = false,
  startMessage = null,
  messageVariant = 'plain',
  startPlacement = 'absolute',
  onStart,
}: Props) {
  const isFlowStart = startPlacement === 'flow';

  return (
    <SharedSubmenuShell backgroundSource={backgroundSource} rootStyle={styles.root} bottomNav={bottomNav}>
      <View style={styles.deckArea}>
        <View style={[styles.deckWrap, deckWrapStyle]}>
          {deck}
          {dots ? (
            <View style={styles.dotRow}>
              {dots.map((dot) => {
                const id = dotId(dot);
                return <View key={id} style={[styles.dot, selectedDotId === id && styles.dotActive]} />;
              })}
            </View>
          ) : null}
          {statusText ? <Text style={styles.statusText}>{statusText}</Text> : null}
        </View>
      </View>

      <Pressable
        onPress={onStart}
        style={({ pressed }) => [
          isFlowStart ? styles.startBtnFlow : styles.startBtn,
          startDisabled && styles.startDisabled,
          pressed && !startDisabled && { opacity: 0.75 },
        ]}
      >
        <Image source={START_IMG} style={styles.startImg} resizeMode="contain" />
      </Pressable>

      {startMessage ? (
        <View style={isFlowStart ? styles.messageWrap : styles.messageWrapAbsolute}>
          <Text style={[styles.messageText, messageVariant === 'pill' && styles.messageTextPill]}>
            {startMessage}
          </Text>
        </View>
      ) : null}
    </SharedSubmenuShell>
  );
}
