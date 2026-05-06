import { useWindowDimensions } from 'react-native';

export function useGameLayout(layoutScale = 1, verticalOffset = 0) {
  const { width, height } = useWindowDimensions();

  const imgWidth          = width * 1.19 * layoutScale;
  const imgRenderedHeight = imgWidth * 1.5;
  const imgTop            = height * 0.12 + (height - imgRenderedHeight) / 2 + height * verticalOffset;
  const imgLeft           = -(imgWidth - width) / 2;
  const rackPadTop        = imgTop + imgRenderedHeight * 0.6746 - height * 0.012;
  const anchorX           = imgLeft + imgWidth * 0.508 - width * 0.01;
  const anchorY           = imgTop + imgRenderedHeight * 0.3696 + height * 0.015;
  const cellSpacing       = imgWidth * 0.122;
  const cellSize          = cellSpacing * 0.88;

  const colXOffsets = [width * 0.026, width * 0.01, 0, -width * 0.013, -width * 0.027];
  const rowYOffsets = [height * 0.018, height * 0.01, 0, -height * 0.005, -height * 0.012];

  const boardCells = Array.from({ length: 25 }, (_, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    return {
      x: anchorX + (col - 2) * cellSpacing + colXOffsets[col],
      y: anchorY + (row - 2) * cellSpacing + rowYOffsets[row],
    };
  });

  return {
    width, height,
    imgWidth, imgRenderedHeight, imgTop, imgLeft,
    rackPadTop,
    anchorX, anchorY, cellSize,
    boardCells,
  };
}
