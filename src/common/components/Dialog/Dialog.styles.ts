import { StyleSheet } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// A bottom sheet over a dimmed backdrop, as in the prototype's .modal-overlay / .modal-sheet.
export const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    backgroundColor: theme.colors.overlay.modal,
  },
  keyboardAvoider: {
    justifyContent: 'flex-end' as const,
  },
  sheet: {
    width: '100%',
    maxWidth: theme.metrics.contentMaxWidth.narrow,
    maxHeight: '88%',
    alignSelf: 'center' as const,
    backgroundColor: theme.colors.background.modal,
    borderTopLeftRadius: hs(22),
    borderTopRightRadius: hs(22),
  },
  sheetContent: {
    paddingTop: vs(18),
    paddingHorizontal: hs(18),
    paddingBottom: vs(22),
  },
  head: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: vs(14),
  },
  title: {
    flex: 1,
    fontSize: rf(18),
    color: theme.colors.text.primary,
  },
  close: {
    padding: hs(4),
  },
  closeGlyph: {
    fontSize: rf(20),
    color: theme.colors.text.secondary,
  },
  message: {
    color: theme.colors.text.secondary,
    fontSize: rf(13.5),
    lineHeight: rf(13.5 * 1.55),
    marginBottom: vs(14),
  },
  actions: {
    flexDirection: 'row' as const,
    gap: hs(8),
    marginTop: vs(14),
  },
  action: {
    flex: 1,
  },
}));
