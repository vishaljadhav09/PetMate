import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { rf } from '@/theme/metrics';
import { identityColor } from '@/utils/identityColor';
import { SPECIES_EMOJI } from '../../constants/species';
import type { PetSpecies } from '../../types/pet.types';
import { PET_AVATAR_SIZES, styles } from './PetAvatar.styles';

export interface PetAvatarProps {
  petId: string;
  species: PetSpecies;
  /** `lg` for list cards, `xl` for the detail hero. */
  size?: keyof typeof PET_AVATAR_SIZES;
  /** First pet photo. Replaces the species emoji when present. */
  photoUrl?: string;
}

/** Hex alpha suffix (~13%) that turns the identity color into a soft tint. */
const TINT_ALPHA = '22';

/** Species emoji on a soft tint of the pet's identity color, in a rounded square. */
export function PetAvatar({ petId, species, size = 'lg', photoUrl }: PetAvatarProps) {
  const { theme } = useUnistyles();
  const color = identityColor(theme.colors.avatar, petId);
  const dimensions = PET_AVATAR_SIZES[size];

  return (
    <View style={styles.box(dimensions.size, dimensions.radius, `${color}${TINT_ALPHA}`)}>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <Text style={styles.emoji(rf(dimensions.emoji))}>{SPECIES_EMOJI[species]}</Text>
      )}
    </View>
  );
}
