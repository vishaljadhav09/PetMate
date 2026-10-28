import { Image } from 'expo-image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Icon, Text } from '@/common/components';
import { pickImage, uploadPetPhoto } from '../../services/photoService';
import { styles } from './PhotoPicker.styles';

export const MAX_PET_PHOTOS = 4;

export interface PhotoPickerProps {
  value: string[];
  onChange: (photos: string[]) => void;
}

/** Grid of uploaded photo thumbnails with an add tile. Uploads to Cloudinary on pick. */
export function PhotoPicker({ value, onChange }: PhotoPickerProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);

  const handleAdd = async () => {
    const uri = await pickImage();
    if (!uri) return;

    setIsUploading(true);
    try {
      const url = await uploadPetPhoto(uri);
      onChange([...value, url]);
    } catch {
      Toast.show({ type: 'error', text1: t('petForm.photoUploadFailed') });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (url: string) => onChange(value.filter((item) => item !== url));

  return (
    <View className="gap-1.5">
      <Text variant="label" color="secondary">
        {t('petForm.photosLabel', { count: value.length, max: MAX_PET_PHOTOS })}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {value.map((url) => (
          <View key={url} style={styles.thumb}>
            <Image source={{ uri: url }} style={styles.image} contentFit="cover" />
            <View style={styles.removeBadge}>
              <Pressable
                onPress={() => handleRemove(url)}
                accessibilityRole="button"
                accessibilityLabel={t('petForm.removePhoto')}
              >
                <Icon name="close" size={14} />
              </Pressable>
            </View>
          </View>
        ))}
        {value.length < MAX_PET_PHOTOS && (
          <Pressable
            onPress={handleAdd}
            disabled={isUploading}
            accessibilityRole="button"
            accessibilityLabel={t('petForm.addPhoto')}
          >
            <View style={styles.addTile}>
              {isUploading ? <ActivityIndicator /> : <Icon name="add" variant="secondary" />}
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}
