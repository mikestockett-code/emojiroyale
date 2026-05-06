// HowToScreen.tsx
// Simple fresh How To screen.
//
// This is intentionally plain for now.
// The goal is to give the button a real destination
// without overbuilding the presentation layer yet.

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

type Props = {
  onBackToMenu: () => void;
};

export default function HowToScreen({ onBackToMenu }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#120d1d' }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 72,
          paddingBottom: 40,
          paddingHorizontal: 20,
          gap: 18,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: '900', color: '#ffe3b0', textAlign: 'center' }}>
          How To Play
        </Text>

        <View style={cardStyle}>
          <Text style={titleStyle}>Goal</Text>
          <Text style={bodyStyle}>
            Build winning patterns on the board before your opponent does.
          </Text>
        </View>

        <View style={cardStyle}>
          <Text style={titleStyle}>Solo</Text>
          <Text style={bodyStyle}>
            Practice / No Wager means no emoji sticker from your album is being wagered.
          </Text>
          <Text style={bodyStyle}>
            Epic Lite means 25 common emoji stickers are wagered.
          </Text>
          <Text style={bodyStyle}>
            Epic means 1 epic sticker from your album is wagered.
          </Text>
        </View>

        <View style={cardStyle}>
          <Text style={titleStyle}>Shared Rules</Text>
          <Text style={bodyStyle}>
            The board and rack are shared systems across modes.
          </Text>
          <Text style={bodyStyle}>
            Some features are still being rebuilt, so this screen is a temporary guide.
          </Text>
        </View>

        <Pressable
          onPress={onBackToMenu}
          style={({ pressed }) => ({
            marginTop: 6,
            alignSelf: 'center',
            minWidth: 180,
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: '#caa46a',
            backgroundColor: pressed ? '#e7dcc9' : '#f5ead8',
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#7c2d12', fontSize: 16, fontWeight: '900' }}>Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  backgroundColor: '#fffaf4',
  borderRadius: 22,
  borderWidth: 3,
  borderColor: '#fdba74',
  paddingHorizontal: 18,
  paddingVertical: 18,
  gap: 8,
} as const;

const titleStyle = {
  fontSize: 18,
  fontWeight: '900' as const,
  color: '#431407',
} as const;

const bodyStyle = {
  fontSize: 15,
  lineHeight: 22,
  color: '#6b7280',
} as const;
