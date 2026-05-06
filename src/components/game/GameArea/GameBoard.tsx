import React, { useMemo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { StickerTile } from '../StickerTile';
import { DICE_IMAGE } from './constants';
import { WinningBoardTile } from './WinningBoardTile';
import type { BoardCell, Player } from '../../../types';

type Props = {
  board: BoardCell[];
  boardCells: { x: number; y: number }[];
  cellSize: number;
  lastMoveIndex: number | null;
  winningLineIndices?: number[];
  selectedRollIndex: number | null;
  isRollMode: boolean;
  rollPhase: string;
  playerColors: Record<Player, string>;
  tileColors: Record<Player, string>;
  onSquarePress?: (index: number) => void;
};

export function GameBoard({
  board,
  boardCells,
  cellSize,
  lastMoveIndex,
  winningLineIndices = [],
  selectedRollIndex,
  isRollMode,
  rollPhase,
  playerColors,
  tileColors,
  onSquarePress,
}: Props) {
  const winningLineKey = winningLineIndices.join('-');
  const winningLineSet = useMemo(() => new Set(winningLineIndices), [winningLineKey]);

  const renderPiece = (cell: BoardCell, index: number) => {
    if (!cell) return null;
    const ownerColor = playerColors[cell.player];
    const tileBg     = tileColors[cell.player];
    const isLastMove = lastMoveIndex === index && selectedRollIndex !== index;
    const isWinningTile = winningLineSet.has(index);
    const isGhost    = selectedRollIndex === index;
    const isRollTarget = isRollMode && rollPhase === 'selecting';
    const revealIndex = Math.max(0, winningLineIndices.indexOf(index));

    if (isGhost) {
      return (
        <View style={{
          width: cellSize, height: cellSize,
          borderRadius: cellSize / 2,
          borderWidth: 3, borderStyle: 'dashed',
          borderColor: ownerColor,
          backgroundColor: 'rgba(255,255,255,0.1)',
        }} />
      );
    }

    return (
      <>
        {(isLastMove || isWinningTile) && (
          <View style={{
            position: 'absolute',
            width: cellSize + (isWinningTile ? 14 : 10),
            height: cellSize + (isWinningTile ? 14 : 10),
            borderRadius: (cellSize + (isWinningTile ? 14 : 10)) / 2,
            borderWidth: isWinningTile ? 4 : 3,
            borderColor: isWinningTile ? '#ffe3a3' : ownerColor,
            shadowColor: isWinningTile ? '#ffe3a3' : ownerColor,
            shadowOpacity: 0.9,
            shadowRadius: isWinningTile ? 10 : 6,
            shadowOffset: { width: 0, height: 0 },
          }} />
        )}
        {isRollTarget && (
          <View style={{
            position: 'absolute',
            width: cellSize + 8, height: cellSize + 8,
            borderRadius: (cellSize + 8) / 2,
            borderWidth: 2, borderColor: ownerColor, borderStyle: 'dashed',
          }} />
        )}
        {isWinningTile ? (
          <WinningBoardTile cell={cell} cellSize={cellSize} tileBg={tileBg} revealIndex={revealIndex} />
        ) : (
          <View style={{ width: cellSize, height: cellSize, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={DICE_IMAGE} style={{ width: '92%', height: '92%' }} resizeMode="contain" />
            <View style={{
              position: 'absolute', width: '70%', aspectRatio: 1,
              borderRadius: 999, overflow: 'hidden',
              backgroundColor: tileBg, alignItems: 'center', justifyContent: 'center',
            }}>
              <StickerTile stickerId={cell.stickerId} backgroundColor={tileBg} isBoardTile variant="naked" />
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <>
      {boardCells.map((cell, i) => {
        const boardCell = board[i] ?? null;
        return (
          <Pressable
            key={i}
            onPress={() => onSquarePress?.(i)}
            style={({ pressed }) => ({
              position: 'absolute',
              left: cell.x - cellSize / 2,
              top: cell.y - cellSize / 2,
              width: cellSize, height: cellSize,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.75 : isRollMode && !boardCell ? 0.4 : 1,
            })}
          >
            {renderPiece(boardCell, i)}
          </Pressable>
        );
      })}
    </>
  );
}
