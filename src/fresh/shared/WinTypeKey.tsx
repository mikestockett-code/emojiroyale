import React from 'react';
import { Image, Text, View } from 'react-native';

const POLLY      = require('../../../assets/CustomEmojis/polly.png');
const PS_EMOJI   = require('../../../assets/CustomEmojis/psemoji.png');
const HIDDEN_SON = require('../../../assets/CustomEmojis/thehiddenson.png');
const PHOENIX    = require('../../../assets/CustomEmojis/phoenixemoji.png');

const IMG_SZ  = 34;
const TILE_SZ = 30;

function ImgTile({ src }: { src: any }) {
  return (
    <Image source={src} style={{ width: IMG_SZ, height: IMG_SZ }} resizeMode="contain" />
  );
}

function GameTile({ emoji }: { emoji: string }) {
  return (
    <View style={{ width: TILE_SZ, height: TILE_SZ, borderRadius: 7, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 17 }}>{emoji}</Text>
    </View>
  );
}

const PLUS = <Text style={{ color: 'rgba(255,250,240,0.3)', fontSize: 13, marginHorizontal: 4 }}>+</Text>;
const EQ   = <Text style={{ color: 'rgba(255,250,240,0.3)', fontSize: 13, marginHorizontal: 6 }}>=</Text>;
const ARR  = <Text style={{ color: 'rgba(255,250,240,0.3)', fontSize: 13, marginHorizontal: 6 }}>→</Text>;

export function WinTypeKey() {
  return (
    <View style={{ gap: 12, paddingVertical: 6 }}>

      {/* ── Legendary ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ImgTile src={POLLY} />
        {PLUS}
        <ImgTile src={PS_EMOJI} />
        {PLUS}
        <ImgTile src={HIDDEN_SON} />
        {EQ}
        <Text style={{ fontSize: 12, fontWeight: '900', color: '#ffd76b', letterSpacing: 0.4 }}>✨ LEGENDARY</Text>
      </View>

      <View style={{ height: 1, backgroundColor: 'rgba(255,216,107,0.08)' }} />

      {/* ── Epic ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ImgTile src={PHOENIX} />
        {PLUS}
        <ImgTile src={PHOENIX} />
        {PLUS}
        <ImgTile src={PHOENIX} />
        {EQ}
        <Text style={{ fontSize: 12, fontWeight: '900', color: '#c77dff', letterSpacing: 0.4 }}>⚡ EPIC WIN</Text>
      </View>

      <View style={{ height: 1, backgroundColor: 'rgba(255,216,107,0.08)' }} />

      {/* ── Standard ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <GameTile emoji="⭐" />
        <View style={{ width: 3 }} />
        <GameTile emoji="⭐" />
        <View style={{ width: 3 }} />
        <GameTile emoji="⭐" />
        <View style={{ width: 3 }} />
        <GameTile emoji="⭐" />
        {ARR}
        <Text style={{ fontSize: 12, fontWeight: '900', color: '#60a5fa', letterSpacing: 0.4 }}>STANDARD WIN</Text>
      </View>

    </View>
  );
}
