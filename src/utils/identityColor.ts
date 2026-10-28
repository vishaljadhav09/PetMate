/**
 * Picks a stable color from a palette for a given id, so the same owner or pet
 * always gets the same avatar color across screens and sessions.
 */
export function identityColor(palette: readonly string[], id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 997;
  }
  return palette[hash % palette.length] ?? palette[0] ?? '';
}
