import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
  },
  // Cells carry the gutters (half each side) so a lone last-row item keeps
  // exactly the same width as its neighbours.
  cell: (columns: number) => ({
    flex: 1,
    maxWidth: `${100 / columns}%` as `${number}%`,
    paddingHorizontal: columns > 1 ? theme.metrics.spacing.p8 : 0,
    paddingBottom: theme.metrics.spacingV.p12,
  }),
  // Pulls the first/last gutters back so columns line up with the screen padding.
  gutterReset: {
    marginHorizontal: -theme.metrics.spacing.p8,
  },
  // The header is not a cell, so it gets back the gutter the list reset removed.
  headerGutter: {
    paddingHorizontal: theme.metrics.spacing.p8,
  },
}));
