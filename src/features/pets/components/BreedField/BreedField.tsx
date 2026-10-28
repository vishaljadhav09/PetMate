import { useState } from 'react';
import { useController } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Input, Select } from '@/common/components';
import { translateDynamicKey } from '@/i18n/translateKey';
import { BREEDS, findPresetBreed } from '../../constants/breeds';
import type { PetFormData } from '../../schemas/petSchema';
import type { PetSpecies } from '../../types';

/** Select value for the "Other" option; never stored as a breed. */
const OTHER_OPTION = '__other__';

export interface BreedFieldProps {
  control: Control<PetFormData>;
  species: PetSpecies;
}

/**
 * Breed picker: a dropdown of the species' preset breeds plus an "Other" option that reveals a
 * text box for breeds not in the list. Species with no presets get the text box only.
 * Render with `key={species}` so the mode resets when the species changes.
 */
export function BreedField({ control, species }: BreedFieldProps) {
  const { t } = useTranslation();
  const { field, fieldState } = useController({ name: 'breed', control });
  const presets = BREEDS[species];
  const [customChosen, setCustomChosen] = useState(
    field.value.trim() !== '' && !findPresetBreed(species, field.value)
  );

  const textOnly = presets.length === 0;
  const showText = textOnly || customChosen;
  const error = fieldState.error?.message
    ? translateDynamicKey(t, fieldState.error.message)
    : undefined;

  const handleSelect = (next: string) => {
    if (next === OTHER_OPTION) {
      setCustomChosen(true);
      field.onChange('');
      return;
    }
    setCustomChosen(false);
    field.onChange(next);
  };

  return (
    <View className="gap-3">
      {!textOnly && (
        <Select
          label={t('petForm.breedLabel')}
          value={showText ? OTHER_OPTION : (findPresetBreed(species, field.value) ?? '')}
          onChange={handleSelect}
          placeholder={t('petForm.breedSelectPlaceholder')}
          options={[
            ...presets.map((breed) => ({ label: breed, value: breed })),
            { label: t('petForm.breedOther'), value: OTHER_OPTION },
          ]}
          error={showText ? undefined : error}
        />
      )}
      {showText && (
        <Input
          label={textOnly ? t('petForm.breedLabel') : t('petForm.breedCustomLabel')}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          placeholder={t('petForm.breedPlaceholder')}
          autoCapitalize="words"
          error={error}
        />
      )}
    </View>
  );
}
