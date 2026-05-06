import { BRONZE_PUZZLE_CATALOG } from './albumPuzzleCatalog';

export function getBronzePuzzlePageSpreads() {
  const puzzles = BRONZE_PUZZLE_CATALOG;
  return [
    {
      id: 'bronze-puzzle-1',
      sectionId: 'puzzle' as const,
      chapterTitle: 'Puzzle',
      leftSlots: [],
      rightSlots: [],
      leftPuzzleId: puzzles[0]?.id,
      rightPuzzleId: puzzles[1]?.id,
    },
    {
      id: 'bronze-puzzle-2',
      sectionId: 'puzzle' as const,
      chapterTitle: 'Puzzle',
      leftSlots: [],
      rightSlots: [],
      leftPuzzleId: puzzles[2]?.id,
      rightPuzzleId: undefined,
    },
  ].filter((spread) => spread.leftPuzzleId || spread.rightPuzzleId);
}
