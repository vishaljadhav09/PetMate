import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  Button,
  FormField,
  Input,
  SegmentedControl,
  Select,
  Switch,
  Text,
  TextArea,
} from '@/common/components';
import { translateDynamicKey } from '@/i18n/translateKey';
import { useCreatePet, useUpdatePet } from '../../hooks/usePets';
import { petSchema } from '../../schemas/petSchema';
import type { PetFormData } from '../../schemas/petSchema';
import type { CreatePetData, PetGender, PetSpecies, StudTermsType } from '../../types';

const SPECIES_OPTIONS: PetSpecies[] = ['dog', 'cat', 'bird', 'rabbit', 'horse', 'other'];
const STUD_TERMS_OPTIONS: StudTermsType[] = ['fixedFee', 'negotiable', 'pickOfLitter', 'free'];

const EMPTY_DEFAULTS: PetFormData = {
  name: '',
  species: 'dog',
  breed: '',
  gender: 'male',
  dateOfBirth: '',
  vaccinationUpToDate: true,
  pedigreeCertified: false,
  registrationNumber: '',
  description: '',
  studTermsType: 'negotiable',
  studFeeAmount: '',
  city: '',
  availableForMatching: true,
};

export interface PetFormProps {
  mode: 'create' | 'edit';
  petId?: string;
  defaultValues?: Partial<PetFormData>;
  onSuccess: () => void;
}

export function PetForm({ mode, petId, defaultValues, onSuccess }: PetFormProps) {
  const { t } = useTranslation();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  });

  const pedigreeCertified = watch('pedigreeCertified');
  const studTermsType = watch('studTermsType');
  const isSaving = createPet.isPending || updatePet.isPending;

  const onSubmit = handleSubmit(async (values) => {
    const data: CreatePetData = {
      name: values.name,
      species: values.species,
      breed: values.breed,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth,
      vaccinationUpToDate: values.vaccinationUpToDate,
      pedigreeCertified: values.pedigreeCertified,
      registrationNumber: values.pedigreeCertified
        ? values.registrationNumber?.trim() || undefined
        : undefined,
      description: values.description?.trim() ?? '',
      studTerms: {
        type: values.studTermsType,
        feeAmount: values.studTermsType === 'fixedFee' ? Number(values.studFeeAmount) : undefined,
      },
      city: values.city,
      availableForMatching: values.availableForMatching,
    };

    try {
      if (mode === 'create') {
        await createPet.mutateAsync(data);
        Toast.show({ type: 'success', text1: t('petForm.createSuccess') });
      } else if (petId) {
        await updatePet.mutateAsync({ id: petId, data });
        Toast.show({ type: 'success', text1: t('petForm.updateSuccess') });
      }
      onSuccess();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error instanceof Error ? error.message : t('errors.generic'),
      });
    }
  });

  return (
    <View className="gap-4">
      <FormField name="name" control={control} label={t('petForm.nameLabel')} required>
        <Input placeholder={t('petForm.namePlaceholder')} />
      </FormField>

      <View className="gap-2">
        <Text variant="label">{`${t('petForm.speciesLabel')} *`}</Text>
        <Controller
          name="species"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              onChange={(next) => onChange(next as PetSpecies)}
              options={SPECIES_OPTIONS.map((option) => ({
                label: t(`pets.species.${option}`),
                value: option,
              }))}
              error={
                errors.species?.message ? translateDynamicKey(t, errors.species.message) : undefined
              }
            />
          )}
        />
      </View>

      <FormField name="breed" control={control} label={t('petForm.breedLabel')} required>
        <Input placeholder={t('petForm.breedPlaceholder')} />
      </FormField>

      <View className="gap-2">
        <Text variant="label">{`${t('petForm.genderLabel')} *`}</Text>
        <Controller
          name="gender"
          control={control}
          render={({ field: { value, onChange } }) => (
            <SegmentedControl
              value={value}
              onChange={(next) => onChange(next as PetGender)}
              options={[
                { label: t('pets.gender.male'), value: 'male' },
                { label: t('pets.gender.female'), value: 'female' },
              ]}
            />
          )}
        />
      </View>

      <FormField name="dateOfBirth" control={control} label={t('petForm.dobLabel')} required>
        <Input placeholder={t('petForm.dobPlaceholder')} helperText={t('petForm.dobHelperText')} />
      </FormField>

      <Controller
        name="vaccinationUpToDate"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Switch label={t('petForm.vaccinationLabel')} value={value} onValueChange={onChange} />
        )}
      />

      <Controller
        name="pedigreeCertified"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Switch label={t('petForm.pedigreeLabel')} value={value} onValueChange={onChange} />
        )}
      />

      {pedigreeCertified && (
        <FormField
          name="registrationNumber"
          control={control}
          label={t('petForm.registrationNumberLabel')}
          required
        >
          <Input placeholder={t('petForm.registrationNumberPlaceholder')} />
        </FormField>
      )}

      <FormField name="description" control={control} label={t('petForm.descriptionLabel')}>
        <TextArea placeholder={t('petForm.descriptionPlaceholder')} />
      </FormField>

      <View className="gap-2">
        <Text variant="label">{`${t('petForm.studTermsTypeLabel')} *`}</Text>
        <Controller
          name="studTermsType"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              onChange={(next) => onChange(next as StudTermsType)}
              options={STUD_TERMS_OPTIONS.map((option) => ({
                label: t(`pets.studTerms.${option}`),
                value: option,
              }))}
            />
          )}
        />
      </View>

      {studTermsType === 'fixedFee' && (
        <FormField
          name="studFeeAmount"
          control={control}
          label={t('petForm.studFeeAmountLabel')}
          required
        >
          <Input placeholder={t('petForm.studFeeAmountPlaceholder')} keyboardType="numeric" />
        </FormField>
      )}

      <FormField name="city" control={control} label={t('petForm.cityLabel')} required>
        <Input placeholder={t('petForm.cityPlaceholder')} />
      </FormField>

      <Controller
        name="availableForMatching"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Switch
            label={t('petForm.availableForMatchingLabel')}
            value={value}
            onValueChange={onChange}
          />
        )}
      />

      <Button
        title={mode === 'create' ? t('petForm.submit') : t('petForm.submitEdit')}
        onPress={onSubmit}
        loading={isSaving}
        fullWidth
      />
    </View>
  );
}
