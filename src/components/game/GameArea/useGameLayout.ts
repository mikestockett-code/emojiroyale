import { useWindowDimensions } from 'react-native';

export function useGameLayout(layoutScale = 1, verticalOffset = 0) {
  const { width, height } = useWindowDimensions();

  const imgWidth          = width * 0.930 * layoutScale;
  const imgRenderedHeight = imgWidth * 1.0;
  const imgTop            = height * 0.395 + height * verticalOffset;
  const imgLeft           = -(imgWidth - width) / 2;
  const anchorX           = imgLeft + imgWidth * 0.490;
  const anchorY           = imgTop  + imgRenderedHeight * 0.455;
  const cellSpacing       = imgWidth * 0.136;
  const cellSize          = cellSpacing * 1.030;
  const rackPadTop        = imgTop + imgRenderedHeight * 0.870;

  const colXOffsets = [0, 0, 0, 0, 0];
  const rowYOffsets = [0, 0, 0, 0, 0];

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
