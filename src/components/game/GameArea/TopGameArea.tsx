import React from 'react';
import { Image } from 'react-native';
import { SOLO_TOP } from './constants';
import { getTopPanelLayout } from './topPanelLayout';
import { TimerDisplay } from './TimerDisplay';
import { RightBadge } from './RightBadge';
import { ScoreDisplay } from './ScoreDisplay';
import { ProfileNameDisplay } from './ProfileNameDisplay';
import { NamePlate } from './NamePlate';

type WagerSubProfile = { name: string; avatar: string; colorHex: string };

type Props = {
  width: number;
  height: number;
  topLeftImage?: any;
  topLeftChalkLabel?: string;
  topLeftWagerEmoji?: string | null;
  topLeftSubProfile?: WagerSubProfile | null;
  topRightImage?: any;
  topRightChalkLabel?: string;
  topRightWagerEmoji?: string | null;
  topRightWagerEmojiName?: string | null;
  topRightSubProfile?: WagerSubProfile | null;
  centerImage?: any;
  namePlateText?: string;
  timerText?: string;
  isTimerFrozen?: boolean;
  isTimerStealing?: boolean;
  topRightImageScale?: number;
  topRightImageOffsetX?: number;
  topRightImageOffsetY?: number;
  topRightThoughtText?: string | null;
  centerImageOffsetY?: number;
  namePlateOffsetY?: number;
  namePlateScale?: number;
  topScoreValue?: number;
  topSubLabel?: string;
  topSubValue?: number;
  stageText?: string;
  topRightSubLabel?: string;
  topRightSubValue?: number;
  profileName?: string;
};

export function TopGameArea({
  width,
  height,
  topLeftImage,
  topLeftChalkLabel,
  topLeftWagerEmoji,
  topLeftSubProfile,
  topRightImage,
  topRightChalkLabel,
  topRightWagerEmoji,
  topRightWagerEmojiName,
  topRightSubProfile,
  centerImage,
  namePlateText,
  timerText,
  isTimerFrozen = false,
  isTimerStealing = false,
  topRightImageScale = 1,
  topRightImageOffsetX = 0,
  topRightImageOffsetY = 0,
  topRightThoughtText = null,
  centerImageOffsetY = 0,
  namePlateOffsetY = 0,
  namePlateScale = 1,
  topScoreValue,
  topSubLabel,
  topSubValue,
  stageText,
  topRightSubLabel,
  topRightSubValue,
  profileName,
}: Props) {
  const layout = getTopPanelLayout(width, height);

  return (
    <>
      <Image
        source={SOLO_TOP}
        resizeMode="stretch"
        style={{ position: 'absolute', top: layout.panelTop, left: (width - layout.panelWidth) / 2, width: layout.panelWidth, height: layout.panelHeight }}
      />

      <ProfileNameDisplay width={width} height={height} layout={layout} profileName={profileName} />

      <TimerDisplay
        width={width} height={height} layout={layout}
        timerText={timerText} centerImage={centerImage} centerImageOffsetY={centerImageOffsetY}
        isTimerFrozen={isTimerFrozen} isTimerStealing={isTimerStealing}
      />

      <RightBadge
        width={width} height={height} layout={layout}
        topRightImage={topRightImage}
        topRightChalkLabel={topRightChalkLabel}
        topRightWagerEmoji={topRightWagerEmoji}
        topRightWagerEmojiName={topRightWagerEmojiName}
        topRightSubProfile={topRightSubProfile}
        topRightImageScale={topRightImageScale}
        topRightImageOffsetX={topRightImageOffsetX}
        topRightImageOffsetY={topRightImageOffsetY}
        topRightThoughtText={topRightThoughtText}
        topRightSubLabel={topRightSubLabel}
        topRightSubValue={topRightSubValue}
      />

      <ScoreDisplay
        width={width} height={height} layout={layout}
        topScoreValue={topScoreValue}
        topSubLabel={topSubLabel}
        topSubValue={topSubValue}
        topLeftImage={topLeftImage}
        topLeftChalkLabel={topLeftChalkLabel}
        topLeftWagerEmoji={topLeftWagerEmoji}
        topLeftSubProfile={topLeftSubProfile}
      />

      <NamePlate
        width={width} height={height} layout={layout}
        namePlateText={namePlateText} stageText={stageText}
        namePlateOffsetY={namePlateOffsetY} namePlateScale={namePlateScale}
      />
    </>
  );
}
