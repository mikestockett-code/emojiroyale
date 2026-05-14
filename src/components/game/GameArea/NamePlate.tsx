import React from 'react';
import { Text } from 'react-native';
import { topPanelStyles } from './TopGameArea.styles';
import type { TopPanelLayout } from './topPanelLayout';

type Props = {
  width: number;
  height: number;
  layout: TopPanelLayout;
  namePlateText?: string;
  stageText?: string;
  namePlateOffsetY?: number;
  namePlateScale?: number;
};

export function NamePlate({ width, height, layout, namePlateText, stageText, namePlateOffsetY = 0, namePlateScale = 1 }: Props) {
  const baseTop = layout.panelTop + layout.panelHeight * 0.514 + height * 0.03 + height * namePlateOffsetY;

  return (
    <>
      {namePlateText ? (
        <Text style={[topPanelStyles.namePlateText, { top: baseTop, left: width * 0.156, width: width * 0.7, fontSize: 11.48 * namePlateScale }]}>
          {namePlateText}
        </Text>
      ) : null}
      {stageText ? (
        <Text style={[topPanelStyles.namePlateText, { top: baseTop + 18, left: width * 0.156, width: width * 0.7, fontSize: 17.23 * namePlateScale }]}>
          {stageText}
        </Text>
      ) : null}
    </>
  );
}
