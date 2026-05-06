import { StyleSheet } from 'react-native';

export const animStyles = StyleSheet.create({
  pageFlipperContent: {
    backgroundColor: 'transparent',
  },
  pageHalfFullImage: {
    flex: 1,
  },
  pageHalfContainer: {
    height: 425,
    overflow: 'hidden',
  },
  pageHalfBookImage: {
    position: 'absolute',
    top: 0,
    width: 283,
    height: 425,
  },
});
