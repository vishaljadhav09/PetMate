import { Text } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { Avatar } from '@/common/components';
import type { AvatarSize } from '@/common/components';
import { identityColor } from '@/utils/identityColor';
import { SPECIES_EMOJI } from '../../constants/species';
import type { PetSpecies } from '../../types/pet.types';
import { styles } from './PetAvatar.styles';

export interface PetAvatarProps {
  petId: string;
  species: PetSpecies;
  size?: AvatarSize;
}

const EMOJI_SCALE: Record<AvatarSize, number> = { xs: 12, sm: 16, md: 20, lg: 28, xl: 40 };
/** Hex alpha suffix (~13%) that turns the identity color into a soft tint. */
const TINT_ALPHA = '22';

/** Species emoji on a soft tint of the pet's identity color. */
export function PetAvatar({ petId, species, size = 'lg' }: PetAvatarProps) {
  const { theme } = useUnistyles();
  const color = identityColor(theme.colors.avatar, petId);

  return (
    <Avatar
      size={size}
      color={`${color}${TINT_ALPHA}`}
      icon={<Text style={styles.emoji(EMOJI_SCALE[size])}>{SPECIES_EMOJI[species]}</Text>}
    />
  );
}
