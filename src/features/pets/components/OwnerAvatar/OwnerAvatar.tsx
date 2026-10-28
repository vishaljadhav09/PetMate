import { useUnistyles } from 'react-native-unistyles';
import { Avatar } from '@/common/components';
import type { AvatarSize } from '@/common/components';
import { identityColor } from '@/utils/identityColor';

export interface OwnerAvatarProps {
  ownerId: string;
  name: string;
  size?: AvatarSize;
}

/** Owner initials on their stable identity color. */
export function OwnerAvatar({ ownerId, name, size = 'md' }: OwnerAvatarProps) {
  const { theme } = useUnistyles();

  return (
    <Avatar
      size={size}
      initials={name.slice(0, 2).toUpperCase()}
      color={identityColor(theme.colors.avatar, ownerId)}
    />
  );
}
