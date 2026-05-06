import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NewSoloRecapCard } from '../NewSoloRecapCard';
import { Confetti } from './Confetti';
import { GildedButton } from './GildedButton';
import { RewardTrophy, CornerDots } from './RewardTrophy';
import { TIER } from './constants';
import type { ResultTier } from './constants';
import type { StickerId } from '../../../types';
import type { FreshProfile } from '../../../fresh/profile/types';
import type { AlbumEraId } from '../../../fresh/album/album.types';
import type { ImageSourcePropType } from 'react-native';

type Props = {
  visible: boolean;
  resultTitle?: string;
  resultSubtitle?: string;
  resultTier?: ResultTier;
  rewardStickerId?: StickerId | null;
  rewardStickerCount?: number;
  rewardStickerLabel?: string;
  rewardStickerKind?: string;
  rewardImageSource?: ImageSourcePropType;
  continueLabel?: string;
  backLabel?: string;
  restartLabel?: string;
  roundScore?: number;
  activeProfile?: FreshProfile | null;
  activeEraId?: AlbumEraId;
  onSetFavoriteSticker?: (stickerId: string | null) => void;
  onContinue?: () => void;
  onBack?: () => void;
  onRestart?: () => void;
};

export default function SoloResultOverlay({
  visible,
  resultTitle    = 'You Win!',
  resultSubtitle = '',
  resultTier     = 'common',
  rewardStickerId    = null,
  rewardStickerCount = 0,
  rewardStickerLabel = '',
  rewardStickerKind,
  rewardImageSource,
  continueLabel = 'NEXT ROUND',
  backLabel     = 'DONE',
  restartLabel  = 'RESTART',
  roundScore = 0,
  activeProfile,
  activeEraId = 'bronze',
  onSetFavoriteSticker,
  onContinue,
  onBack,
  onRestart,
}: Props) {
  const [recapOpen, setRecapOpen] = useState(false);
  if (!visible) return null;

  const cfg = TIER[resultTier];
  const isLoss = resultTitle.toLowerCase().includes('cpu') ||
                 resultTitle.toLowerCase().includes('defeat') ||
                 resultTitle.toLowerCase().includes('lost');

  return (
    <>
      <View style={styles.backdrop}>
        <Confetti tier={resultTier} />

        <LinearGradient
          colors={['#ffd86b', cfg.ring, '#5a3300']}
          style={[styles.cardRing, { shadowColor: cfg.shadowColor }]}
        >
          <LinearGradient colors={['#1a0a06', '#2a1408', '#1a0a06']} style={styles.cardInner}>
            <CornerDots />

            <Text style={[styles.kicker, { color: cfg.ring }]}>{cfg.kicker}</Text>
            <Text style={styles.title}>{resultTitle}</Text>
            {resultSubtitle ? <Text style={styles.subtitle}>{resultSubtitle}</Text> : null}

            {rewardStickerId || rewardImageSource ? (
              <View style={styles.trophyWrap}>
                <RewardTrophy
                  stickerId={rewardStickerId}
                  count={rewardStickerCount}
                  label={rewardStickerLabel}
                  kind={rewardStickerKind}
                  imageSource={rewardImageSource}
                  ring={cfg.ring}
                  shadowColor={cfg.shadowColor}
                />
              </View>
            ) : null}

            <View style={styles.btnStack}>
              {isLoss
                ? <GildedButton label={restartLabel} icon="▶" primary onPress={() => onRestart?.()} />
                : <GildedButton label={continueLabel} icon="▶" primary onPress={() => onContinue?.()} />
              }
              {isLoss && <GildedButton label="RECAP" icon="📊" onPress={() => setRecapOpen(true)} />}
              <GildedButton label={backLabel} onPress={() => onBack?.()} />
            </View>
          </LinearGradient>
        </LinearGradient>
      </View>

      <NewSoloRecapCard
        visible={recapOpen}
        resultTitle={resultTitle}
        roundScore={roundScore}
        rewardStickerId={rewardStickerId}
        rewardStickerCount={rewardStickerCount}
        rewardStickerLabel={rewardStickerLabel}
        rewardImageSource={rewardImageSource}
        activeProfile={activeProfile}
        activeEraId={activeEraId}
        onSetFavoriteSticker={onSetFavoriteSticker}
        onPlayAgain={() => { setRecapOpen(false); onContinue?.(); }}
        onMenu={() => { setRecapOpen(false); onBack?.(); }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(5,2,2,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  cardRing: {
    width: '88%',
    maxWidth: 360,
    borderRadius: 22,
    padding: 3,
    shadowOpacity: 0.7,
    shadowRadius: 38,
    shadowOffset: { width: 0, height: 14 },
    elevation: 20,
    zIndex: 12,
  },
  cardInner: {
    borderRadius: 19,
    padding: 16,
    overflow: 'hidden',
    alignItems: 'center',
    gap: 8,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffd86b',
    textShadowColor: '#3a1a00',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
  },
  trophyWrap: { width: '100%' },
  btnStack: { width: '100%', gap: 8 },
});
