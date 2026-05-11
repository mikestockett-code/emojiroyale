import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { getBronzePuzzle } from './albumPuzzleCatalog';
import { getCollectedPuzzlePieces, getPuzzleCollectedCount } from './albumPuzzleProgress';
import { albumBookStyles as styles } from '../shared/albumBookStyles';
import type { AlbumPuzzleId, AlbumPuzzlePieceCounts } from './album.types';

type Props = {
  puzzleId: AlbumPuzzleId;
  side: 'left' | 'right';
  albumPuzzlePieces?: AlbumPuzzlePieceCounts;
};

export function AlbumPuzzlePageView({ puzzleId, side, albumPuzzlePieces = {} }: Props) {
  const [isCompletePromptDismissed, setIsCompletePromptDismissed] = useState(false);
  const puzzle = getBronzePuzzle(puzzleId);
  if (!puzzle) return null;

  const collectedPieces = getCollectedPuzzlePieces(puzzle.id, albumPuzzlePieces);
  const collectedCount = getPuzzleCollectedCount(puzzle, albumPuzzlePieces);
  const isComplete = collectedCount >= puzzle.pieceCount;
  const showCompletePrompt = isComplete && puzzle.id === 'fireDragon' && !isCompletePromptDismissed;

  return (
    <View style={[styles.root, side === 'left' ? styles.leftPage : styles.rightPage]}>
      {isComplete ? (
        <>
          <Image source={puzzle.completedPageSource} style={styles.completedImage} resizeMode="contain" />
          {showCompletePrompt && (
            <View style={styles.completePrompt}>
              <View style={styles.completePromptTextWrap}>
                <Text style={styles.completePromptTitle}>CUSTOM PROFILE UNLOCKED</Text>
                <Text style={styles.completePromptCopy}>Give this emoji a name, story, and lore.</Text>
              </View>
              <Pressable onPress={() => setIsCompletePromptDismissed(true)} style={styles.completePromptClose}>
                <Text style={styles.completePromptCloseText}>X</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.completeBadge}>
            <Text style={styles.completeText}>COMPLETE</Text>
          </View>
        </>
      ) : (
        <View style={styles.lockedFrame}>
          <View style={styles.header}>
            <Text style={styles.title}>{puzzle.shortTitle}</Text>
            <Text style={styles.count}>{collectedCount}/{puzzle.pieceCount}</Text>
          </View>

          <View style={styles.hiddenPanel}>
            <Text style={styles.hiddenTitle}>LOCKED PROFILE</Text>
            <Text style={styles.hiddenCopy}>Collect all puzzle pieces to reveal this page.</Text>
          </View>

          <View style={styles.pieceGrid}>
            {puzzle.pieces.map((piece) => {
              const isCollected = (collectedPieces[piece.id] ?? 0) > 0;
              return (
                <View key={piece.id} style={[styles.pieceSlot, !isCollected && styles.pieceSlotEmpty]}>
                  {isCollected ? (
                    <Image source={piece.imageSource} style={styles.pieceImage} resizeMode="contain" />
                  ) : (
                    <View style={styles.emptyPieceMark} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
