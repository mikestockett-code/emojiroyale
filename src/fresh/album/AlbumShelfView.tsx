import React, { useMemo } from 'react';
import { Image, Pressable, View } from 'react-native';
import type { AlbumBookConfig, AlbumBookId, AlbumEraId, AlbumPuzzlePieceCounts } from './album.types';
import { shelfStyles } from '../screens/albumShelfStyles';
import { albumBookStyles } from '../shared/albumBookStyles';
import { AlbumTierBadge } from '../shared/AlbumTierBadge';
import { GoldenPhoenixTrophyBadge } from '../shared/GoldenPhoenixTrophyBadge';
import { useGoldenPhoenixHolder } from '../../hooks/useGoldenPhoenixHolder';
import { getProfileAlbumProgress } from './albumProfileProgress';
import { ALBUM_ERAS } from './album.constants';

type Props = {
  books: AlbumBookConfig[];
  albumCounts?: Record<string, number>;
  albumPuzzlePieces?: AlbumPuzzlePieceCounts;
  activeEraId?: AlbumEraId;
  onOpenBook: (bookId: AlbumBookId) => void;
};

export function AlbumShelfView({
  books,
  albumCounts = {},
  albumPuzzlePieces = {},
  activeEraId = 'bronze',
  onOpenBook,
}: Props) {
  const goldenPhoenixHolderName = useGoldenPhoenixHolder();
  const eraProgress = useMemo(
    () => getProfileAlbumProgress(albumCounts, activeEraId, albumPuzzlePieces),
    [albumCounts, activeEraId, albumPuzzlePieces],
  );

  return (
    <View style={shelfStyles.shelfGrid}>
      <GoldenPhoenixTrophyBadge
        size="shelf"
        holderName={goldenPhoenixHolderName}
        style={shelfStyles.shelfGoldenPhoenixTrophy}
      />
      {books.map((book) => {
        const isActiveEra = ALBUM_ERAS.includes(book.id as AlbumEraId) && book.id === activeEraId;
        return (
          <Pressable
            key={book.id}
            onPress={() => onOpenBook(book.id)}
            style={({ pressed }) => [shelfStyles.shelfBookButton, getShelfBookPosition(book.id), pressed && albumBookStyles.pressedBook]}
          >
            <Image source={book.cover} style={getShelfBookCoverStyle(book.id)} resizeMode="contain" />
            {isActiveEra && (
              <View style={{ position: 'absolute', top: '5%', alignSelf: 'center' }}>
                <AlbumTierBadge
                  eraId={eraProgress.eraId}
                  uniqueCollected={eraProgress.uniqueCollected}
                  totalUniqueStickers={eraProgress.totalUniqueStickers}
                  percentComplete={eraProgress.percentComplete}
                  compact
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

function getShelfBookPosition(bookId: AlbumBookId) {
  switch (bookId) {
    case 'favorite':  return shelfStyles.shelfFavorite;
    case 'bronze':    return shelfStyles.shelfBronze;
    case 'silver':    return shelfStyles.shelfSilver;
    case 'gold':      return shelfStyles.shelfGold;
    case 'platinum':  return shelfStyles.shelfPlatinum;
    case 'diamond':   return shelfStyles.shelfDiamond;
    case 'doodle':    return shelfStyles.shelfDoodle;
    case 'battleMode': return shelfStyles.shelfBattleMode;
    case 'easterEggs': return shelfStyles.shelfEasterEggs;
  }
}

function getShelfBookCoverStyle(bookId: AlbumBookId) {
  switch (bookId) {
    case 'favorite':  return shelfStyles.favoriteBookCover;
    case 'bronze':    return shelfStyles.bronzeBookCover;
    case 'silver':    return shelfStyles.silverBookCover;
    case 'gold':      return shelfStyles.goldBookCover;
    case 'platinum':  return shelfStyles.platinumBookCover;
    case 'diamond':   return shelfStyles.diamondBookCover;
    case 'doodle':    return shelfStyles.doodleBookCover;
    case 'battleMode': return shelfStyles.battleModeBookCover;
    case 'easterEggs': return shelfStyles.easterEggsBookCover;
  }
}
