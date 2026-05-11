export type TopPanelLayout = ReturnType<typeof getTopPanelLayout>;

export function getTopPanelLayout(width: number, height: number) {
  const panelTop = height * 0.015 + height * 0.05;
  const panelWidth = width * 0.930 * 0.87;
  const panelHeight = panelWidth * 1.0;
  const timerCenterY = panelTop + panelHeight * 0.635 + height * 0.045;
  const timerSize = 72 * 0.735;
  const badgeWidth = 80 * 0.99 * 0.75;
  const badgeHeight = badgeWidth * 1.9214;
  const rightBadgeCenterX = width * 0.765;

  return {
    panelTop,
    panelWidth,
    panelHeight,
    timerCenterY,
    timerSize,
    badgeWidth,
    badgeHeight,
    rightBadgeCenterX,
  };
}

