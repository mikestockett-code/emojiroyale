import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../luxuryTheme';
import { gameResultOverlayStyles as styles } from './GameResultOverlay.styles';
import { NewSoloRecapCard } from '../../../components/game/NewSoloRecapCard';
import { Confetti } from './Confetti';
import { GildedButton } from './GildedButton';
import { RewardTrophy, CornerDots } from './RewardTrophy';
import { TIER } from './constants';
import type { ResultTier } from './constants';
import type { StickerId } from '../../../types';
import type { FreshProfile } from '../../../fresh/profile/types';
import type { AlbumEraId } from '../../../fresh/album/album.types';
import type { FreshSoloRewardPreview } from '../../../lib/soloRewardRules';
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
  runRewardPreviews?: FreshSoloRewardPreview[];
  continueLabel?: string;
  backLabel?: string;
  restartLabel?: string;
  showRecapOnLoss?: boolean;
  roundScore?: number;
  activeProfile?: FreshProfile | null;
  activeEraId?: AlbumEraId;
  onSetFavoriteSticker?: (stickerId: string | null) => void;
  onContinue?: () => void;
  onBack?: () => void;
  onRestart?: () => void;
};

export default function GameResultOverlay({
  visible,
  resultTitle    = 'You Win!',
  resultSubtitle = '',
  resultTier     = 'common',
  rewardStickerId    = null,
  rewardStickerCount = 0,
  rewardStickerLabel = '',
  rewardStickerKind,
  rewardImageSource,
  runRewardPreviews = [],
  continueLabel = 'NEXT ROUND',
  backLabel     = 'DONE',
  restartLabel  = 'RESTART',
  showRecapOnLoss = true,
  roundScore = 0,
  activeProfile,
  activeEraId = 'bronze',
  onSetFavoriteSticker,
  onContinue,
  onBack,
  onRestart,
}: Props) {
  const [recapOpen, setRecapOpen] = useState(false);
  const entrance = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      entrance.setValue(0);
      glow.setValue(0);
      return;
    }

    Animated.spring(entrance, {
      toValue: 1,
      damping: 13,
      stiffness: 120,
      mass: 0.9,
      useNativeDriver: true,
    }).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, [entrance, glow, visible]);

  if (!visible) return null;

  const cfg = TIER[resultTier];
  const isLoss = resultTitle.toLowerCase().includes('cpu') ||
                 resultTitle.toLowerCase().includes('defeat') ||
                 resultTitle.toLowerCase().includes('lost');
  const cardScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] });
  const cardTranslateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [38, 0] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.08] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.26, 0.52] });

  return (
    <>
      <View style={styles.backdrop}>
        <Confetti tier={resultTier} />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.heroGlow,
            {
              backgroundColor: cfg.shadowColor,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.cardMotion,
            {
              opacity: entrance,
              transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
            },
          ]}
        >
          <LinearGradient
            colors={['#fff5ad', theme.gold, cfg.ring, theme.darkGold]}
            locations={[0, 0.22, 0.74, 1]}
            style={[styles.cardRing, { shadowColor: cfg.shadowColor }]}
          >
            <LinearGradient colors={['#241007', '#110604', theme.warmBrown]} style={styles.cardInner}>
              <View pointerEvents="none" style={[styles.shineLine, { backgroundColor: cfg.ring }]} />
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
                {showRecapOnLoss && isLoss && <GildedButton label="RECAP" icon="📊" onPress={() => setRecapOpen(true)} />}
                <GildedButton label={backLabel} onPress={() => onBack?.()} />
              </View>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>
      </View>

      <NewSoloRecapCard
        visible={recapOpen}
        resultTitle={resultTitle}
        roundScore={roundScore}
        rewardStickerId={rewardStickerId}
        rewardStickerCount={rewardStickerCount}
        rewardStickerLabel={rewardStickerLabel}
        rewardImageSource={rewardImageSource}
        runRewardPreviews={runRewardPreviews}
        activeProfile={activeProfile}
        activeEraId={activeEraId}
        onSetFavoriteSticker={onSetFavoriteSticker}
        onPlayAgain={() => { setRecapOpen(false); onContinue?.(); }}
        onMenu={() => { setRecapOpen(false); onBack?.(); }}
      />
    </>
  );
}
