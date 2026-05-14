import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WinTypeKey } from './WinTypeKey';
import { theme } from './luxuryTheme';

const SEEN_KEY = 'win_type_key_seen_v1';
const AUTO_DISMISS_MS = 7000;

export function WinTypeBanner() {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const slide = useRef(new Animated.Value(-width)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(slide, { toValue: -width, duration: 340, useNativeDriver: true }).start(() => {
      setVisible(false);
      AsyncStorage.setItem(SEEN_KEY, '1');
    });
  }, [slide, width]);

  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY).then(val => {
      if (val) return;
      setVisible(true);
      Animated.timing(slide, { toValue: 0, duration: 480, useNativeDriver: true }).start();
      timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    });
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateX: slide }],
      }}
    >
      <View style={{
        width: '82%',
        backgroundColor: theme.warmBrown,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,216,107,0.22)',
        padding: 16,
        paddingRight: 40,
      }}>
        <Text style={{ fontSize: 9, fontWeight: '900', color: 'rgba(255,216,107,0.45)', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 8 }}>
          Win Types
        </Text>
        <WinTypeKey />

        <Pressable
          onPress={dismiss}
          hitSlop={12}
          style={{ position: 'absolute', top: 12, right: 12, padding: 6 }}
        >
          <Text style={{ color: 'rgba(255,216,107,0.45)', fontSize: 15, lineHeight: 15 }}>✕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
