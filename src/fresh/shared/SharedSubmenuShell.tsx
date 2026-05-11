import React from 'react';
import { ImageBackground, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type { ImageSourcePropType } from '../../types';

type Props = {
  backgroundSource: ImageSourcePropType;
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  rootStyle?: StyleProp<ViewStyle>;
};

export function SharedSubmenuShell({ backgroundSource, children, bottomNav, rootStyle }: Props) {
  return (
    <ImageBackground source={backgroundSource} resizeMode="cover" style={[styles.root, rootStyle]}>
      {children}
      {bottomNav ? <View style={styles.bottomNavWrap}>{bottomNav}</View> : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bottomNavWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
