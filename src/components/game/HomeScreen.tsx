import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { FreshProfile } from '../../fresh/profile/types';
import { ProfileHud } from '../../fresh/shared/ProfileHud';
import { useAudioContext } from '../../fresh/audio/AudioContext';
import { HomeEmojiSky } from './HomeEmojiSky';
import { GoldenPhoenixTrophyBadge } from '../../fresh/shared/GoldenPhoenixTrophyBadge';
import { useGoldenPhoenixHolder } from '../../hooks/useGoldenPhoenixHolder';

const MENU_BACKGROUND = require('../../../assets/backgrounds/emojihome.png');
const MIDDLE_LOGO     = require('../../../assets/images/logomiddle.png');

const BTN_SOLO       = require('../../../assets/buttons/SoloButton.png');
const BTN_PASS_PLAY  = require('../../../assets/buttons/PassandPlay.png');
const BTN_BATTLE     = require('../../../assets/buttons/BattleButton.png');
const BTN_MY_ALBUM   = require('../../../assets/buttons/MyAlbum.png');
const BTN_HOW_TO     = require('../../../assets/buttons/Golden_How_to_Play_button.png');
const BTN_CTA        = require('../../../assets/buttons/Cta.png');

type Props = {
  onGoToSolo: () => void;
  onGoToPassPlay: () => void;
  onGoToBattle: () => void;
  onGoToAlbum: () => void;
  onGoToHowToPlay: () => void;
  onGoToCTA: () => void;
  onToggleMute: () => void;
  onOpenProfiles: () => void;
  activeProfile?: FreshProfile | null;
};

export default function HomeScreen({
  onGoToSolo,
  onGoToPassPlay,
  onGoToBattle,
  onGoToAlbum,
  onGoToHowToPlay,
  onGoToCTA,
  onToggleMute,
  onOpenProfiles,
  activeProfile = null,
}: Props) {
  const { playSound, isMuted } = useAudioContext();
  const { width, height } = useWindowDimensions();
  const goldenPhoenixHolderName = useGoldenPhoenixHolder();

  return (
    <View style={ss.root}>
      <ImageBackground
        source={MENU_BACKGROUND}
        resizeMode="cover"
        style={ss.stage}
      >
        <HomeEmojiSky width={width} height={height} />
                <GoldenPhoenixTrophyBadge holderName={goldenPhoenixHolderName} />
        <Image source={MIDDLE_LOGO} style={ss.logo} resizeMode="contain" />

        <View style={ss.overlay}>
          {/* ── Primary buttons ── */}
          <View style={ss.primaryRow}>
            {/* SOLO — ACTIVE */}
            <TouchableOpacity onPress={() => { playSound('button'); onGoToSolo(); }} activeOpacity={0.8} style={ss.btnSlot}>
              <Image source={BTN_SOLO} style={ss.btnImg} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { playSound('button'); onGoToPassPlay(); }} activeOpacity={0.8} style={ss.btnSlot}>
              <Image source={BTN_PASS_PLAY} style={ss.btnImg} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { playSound('button'); onGoToBattle(); }} activeOpacity={0.8} style={ss.btnSlot}>
              <Image source={BTN_BATTLE} style={ss.btnImg} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {/* ── Secondary buttons ── */}
          <View style={ss.secondaryRow}>
            <TouchableOpacity onPress={() => { playSound('button'); onGoToAlbum(); }} activeOpacity={0.8} style={ss.btnSlotSm}>
              <Image source={BTN_MY_ALBUM} style={ss.btnImgSm} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { playSound('button'); onGoToHowToPlay(); }} activeOpacity={0.8} style={ss.btnSlotSm}>
              <Image source={BTN_HOW_TO} style={ss.btnImgSm} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {/* ── Bottom: CTA + Sound + Profile ── */}
          <View style={ss.bottomRow}>
            <View style={ss.bottomSideSlot}>
              <CircleBtn
                icon={<MaterialIcons name={isMuted ? 'volume-off' : 'volume-up'} size={24} color={isMuted ? 'rgba(255,227,163,0.4)' : '#ffe3b0'} />}
                label="SOUND"
                onPress={onToggleMute}
              />
            </View>

            <View style={ss.bottomCenterSlot}>
              <TouchableOpacity onPress={() => { playSound('button'); onGoToCTA(); }} activeOpacity={0.8} style={ss.ctaSlot}>
                <Image source={BTN_CTA} style={ss.ctaImg} resizeMode="stretch" />
              </TouchableOpacity>
            </View>

            <View style={[ss.bottomSideSlot, ss.bottomSideSlotRight]}>
              <ProfileHud
                name={activeProfile?.name ?? 'Profile'}
                avatar={activeProfile?.avatar ?? '🙂'}
                color={activeProfile?.color ?? 'sunset'}
                onPress={onOpenProfiles}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function CircleBtn({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={ss.circleBtn}>
      <View style={ss.circleIconShell}>{icon}</View>
      <Text style={ss.circleLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const ss = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#000' },
  stage:         { flex: 1, alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' },
  logo:          { width: '91.2%', height: '26.6%', marginTop: '12%', zIndex: 3 },
  overlay:       { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 22, gap: 14, zIndex: 4 },
  primaryRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 16 },
  secondaryRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  bottomRow:     { flexDirection: 'row', alignItems: 'flex-end', width: '100%', paddingHorizontal: 12 },
  bottomSideSlot:{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end', paddingHorizontal: 2 },
  bottomCenterSlot:{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bottomSideSlotRight:{ alignItems: 'flex-end', paddingHorizontal: 2 },
  btnSlot:       { flex: 1, maxWidth: 180, alignItems: 'center' },
  btnImg:        {
    width: '100%',
    height: 80,
    transform: [{ perspective: 400 }, { rotateX: '35deg' }],
  },
  btnSlotSm:     { flex: 1, maxWidth: 200, alignItems: 'center' },
  btnImgSm:      {
    width: '100%',
    height: 75,
    transform: [{ perspective: 400 }, { rotateX: '35deg' }],
  },
  ctaSlot:       { maxWidth: 208, alignItems: 'center', justifyContent: 'flex-end', transform: [{ translateX: -2 }] },
  ctaImg:        {
    width: 230,
    height: 91,
    transform: [{ perspective: 400 }, { rotateX: '35deg' }],
  },
  circleBtn:     { alignItems: 'center', justifyContent: 'center', gap: 4 },
  circleIconShell: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(30, 18, 8, 0.86)',
    borderWidth: 2,
    borderColor: '#e8b968',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLabel:   { color: '#ffe3b0', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});
