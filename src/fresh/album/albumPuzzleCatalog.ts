import type { AlbumPuzzleDefinition, AlbumPuzzleId, AlbumPuzzlePieceDefinition } from './album.types';

type PuzzleSource = {
  id: AlbumPuzzleId;
  title: string;
  shortTitle: string;
  completedPageSource: AlbumPuzzleDefinition['completedPageSource'];
  downloadableEmojiSource: AlbumPuzzleDefinition['downloadableEmojiSource'];
  pieces: AlbumPuzzleDefinition['pieces'];
};

function buildPieces(
  puzzleId: AlbumPuzzleId,
  sources: AlbumPuzzlePieceDefinition['imageSource'][],
): AlbumPuzzlePieceDefinition[] {
  return sources.map((imageSource, index) => ({
    id: `${puzzleId}-piece-${index + 1}`,
    pieceNumber: index + 1,
    imageSource,
  }));
}

const PUZZLES: PuzzleSource[] = [
  {
    id: 'hiddenSon',
    title: 'Hidden Son',
    shortTitle: 'Hidden',
    completedPageSource: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/completed_pages/puzzle_page_left1.png'),
    downloadableEmojiSource: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/emojis_to_downlaod/thehiddenson.png'),
    pieces: buildPieces('hiddenSon', [
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_1.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_2.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_3.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_4.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_5.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_6.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_7.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_8.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_9.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/hidden_son_puzzle_pieces/hidden_son_irregualr_pieces/irregular_piece_10.png'),
    ]),
  },
  {
    id: 'goldenPhoenix',
    title: 'Golden Phoenix',
    shortTitle: 'Phoenix',
    completedPageSource: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/completed_pages/puzzle_page_right2.png'),
    downloadableEmojiSource: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/emojis_to_downlaod/psemoji.png'),
    pieces: buildPieces('goldenPhoenix', [
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_1.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_2.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_3.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_4.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_5.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_6.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_7.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_8.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_9.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/phoenix_puzzle_pieces/phoenix_irr/irregular_piece_10.png'),
    ]),
  },
  {
    id: 'fireDragon',
    title: 'Unknown',
    shortTitle: 'Unknown',
    completedPageSource: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/completed_pages/dragon_left_side_done.png'),
    downloadableEmojiSource: require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/emojis_to_downlaod/firedragon_bronze.png'),
    pieces: buildPieces('fireDragon', [
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_1.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_2.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_3.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_4.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_5.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_6.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_7.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_8.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_9.png'),
      require('../../../assets/albumgeneralstuff/albumbooks/open_book_pages/bronze_puzzle_pages/puzzle_pieces/bronze_puzzle/dragon_puzzle_pieces/dragon_irr/irregular_piece_10.png'),
    ]),
  },
];

export const BRONZE_PUZZLE_CATALOG: AlbumPuzzleDefinition[] = PUZZLES.map((puzzle) => ({
  ...puzzle,
  eraId: 'bronze',
  pieceCount: puzzle.pieces.length,
}));

export const BRONZE_PUZZLE_TOTAL_PIECES = BRONZE_PUZZLE_CATALOG.reduce(
  (total, puzzle) => total + puzzle.pieceCount,
  0,
);

export function getBronzePuzzle(puzzleId: AlbumPuzzleId) {
  return BRONZE_PUZZLE_CATALOG.find((puzzle) => puzzle.id === puzzleId) ?? null;
}
