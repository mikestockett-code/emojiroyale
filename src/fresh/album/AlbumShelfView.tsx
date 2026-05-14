import React, { useMemo } from 'react';
import { Image, Pressable, View } from 'react-native';
import type { AlbumBookConfig, AlbumBookId, AlbumEraId, AlbumPuzzlePieceCounts } from './album.types';
import albumStyles from './albumStyles';
import { theme } from '../shared/luxuryTheme';
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
    <View style={{ flex: 1 }}>
      <GoldenPhoenixTrophyBadge
        size="shelf"
        holderName={goldenPhoenixHolderName}
        style={albumStyles.shelfGoldenPhoenixTrophy}
      />
      {books.map((book) => {
        const isActiveEra = ALBUM_ERAS.includes(book.id as AlbumEraId) && book.id === activeEraId;
        return (
          <Pressable
            key={book.id}
            onPress={() => onOpenBook(book.id)}
            style={({ pressed }) => [{ position: 'absolute' }, getShelfBookPosition(book.id), pressed && theme.pressed]}
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
    case 'favorite':  return albumStyles.shelfFavorite;
    case 'bronze':    return albumStyles.shelfBronze;
    case 'silver':    return albumStyles.shelfSilver;
    case 'gold':      return albumStyles.shelfGold;
    case 'platinum':  return albumStyles.shelfPlatinum;
    case 'diamond':   return albumStyles.shelfDiamond;
    case 'doodle':    return albumStyles.shelfDoodle;
    case 'battleMode': return albumStyles.shelfBattleMode;
    case 'easterEggs': return albumStyles.shelfEasterEggs;
  }
}

function getShelfBookCoverStyle(bookId: AlbumBookId) {
  switch (bookId) {
    case 'favorite':  return albumStyles.favoriteBookCover;
    case 'bronze':    return albumStyles.bronzeBookCover;
    case 'silver':    return albumStyles.silverBookCover;
    case 'gold':      return albumStyles.goldBookCover;
    case 'platinum':  return albumStyles.platinumBookCover;
    case 'diamond':   return albumStyles.diamondBookCover;
    case 'doodle':    return albumStyles.doodleBookCover;
    case 'battleMode': return albumStyles.battleModeBookCover;
    case 'easterEggs': return albumStyles.easterEggsBookCover;
  }
}
