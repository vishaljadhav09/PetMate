import { useUnistyles } from 'react-native-unistyles';
import { Avatar } from '@/common/components';
import type { AvatarSize } from '@/common/components';
import { identityColor } from '@/utils/identityColor';

export interface OwnerAvatarProps {
  ownerId: string;
  name: string;
  size?: AvatarSize;
}

/** First letters of the first two words, e.g. "Raj Patel" → "RP". */
function nameInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Owner initials on their stable identity color. */
export function OwnerAvatar({ ownerId, name, size = 'md' }: OwnerAvatarProps) {
  const { theme } = useUnistyles();

  return (
    <Avatar
      size={size}
      initials={nameInitials(name)}
      color={identityColor(theme.colors.avatar, ownerId)}
    />
  );
}
