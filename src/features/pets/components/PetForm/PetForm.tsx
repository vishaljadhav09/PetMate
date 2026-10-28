import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  Button,
  FormField,
  Input,
  Notice,
  SegmentedControl,
  Select,
  Switch,
  Text,
  TextArea,
} from '@/common/components';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { translateDynamicKey } from '@/i18n/translateKey';
import { useAuthStore } from '@/providers/auth/authStore';
import { friendlyError } from '@/utils/friendlyError';
import { useCreatePet, useUpdatePet } from '../../hooks/usePets';
import { petSchema } from '../../schemas/petSchema';
import type { PetFormData } from '../../schemas/petSchema';
import { pickImage, uploadCertificate } from '../../services/photoService';
import type { CreatePetData, PetGender, PetSpecies, StudTermsType } from '../../types';
import { PhotoPicker } from '../PhotoPicker';

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
  photos: [],
  lastVetCheckup: '',
  hipScore: '',
  litterRef: '',
  ownerAttestsBreedingReady: false,
  availableForMatching: true,
};

export interface PetFormProps {
  mode: 'create' | 'edit';
  petId?: string;
  defaultValues?: Partial<PetFormData>;
  /** True when a certificate is already stored for this pet (edit mode). */
  hasCertificate?: boolean;
  onSuccess: () => void;
}

export function PetForm({
  mode,
  petId,
  defaultValues,
  hasCertificate = false,
  onSuccess,
}: PetFormProps) {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const location = useCurrentLocation();
  const [certificateUri, setCertificateUri] = useState<string | null>(null);
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
  const availableForMatching = watch('availableForMatching');
  const isSaving = createPet.isPending || updatePet.isPending;

  const handlePickCertificate = async () => {
    const uri = await pickImage();
    if (uri) setCertificateUri(uri);
  };

  const onSubmit = handleSubmit(async (values) => {
    // Edit mode keeps the stored location unless the owner refreshed it.
    const coordinates =
      location.coordinates ?? (mode === 'create' ? await location.request() : null);
    if (mode === 'create' && !coordinates) {
      Toast.show({ type: 'error', text1: t('petForm.locationRequired') });
      return;
    }

    const data: Omit<CreatePetData, 'location'> = {
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
      photos: values.photos,
      lastVetCheckup: values.lastVetCheckup || undefined,
      hipScore: values.hipScore?.trim() || undefined,
      litterRef: values.litterRef?.trim() || undefined,
      ownerAttestsBreedingReady: values.ownerAttestsBreedingReady,
      availableForMatching: values.availableForMatching,
    };

    try {
      let savedPetId = petId;
      if (mode === 'create' && coordinates) {
        const created = await createPet.mutateAsync({ ...data, location: coordinates });
        savedPetId = created.id;
      } else if (petId) {
        await updatePet.mutateAsync({
          id: petId,
          data: coordinates ? { ...data, location: coordinates } : data,
        });
      }

      if (certificateUri && userId && savedPetId) {
        try {
          const certificatePath = await uploadCertificate(userId, savedPetId, certificateUri);
          await updatePet.mutateAsync({ id: savedPetId, data: { certificatePath } });
        } catch {
          Toast.show({ type: 'error', text1: t('petForm.certificateUploadFailed') });
        }
      }

      Toast.show({
        type: 'success',
        text1: mode === 'create' ? t('petForm.createSuccess') : t('petForm.updateSuccess'),
      });
      onSuccess();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: friendlyError(error, t),
      });
    }
  });

  return (
    <View className="gap-4">
      <Controller
        name="photos"
        control={control}
        render={({ field: { value, onChange } }) => (
          <PhotoPicker value={value} onChange={onChange} />
        )}
      />

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

      <FormField name="lastVetCheckup" control={control} label={t('petForm.lastVetCheckupLabel')}>
        <Input placeholder={t('petForm.dobPlaceholder')} helperText={t('petForm.dobHelperText')} />
      </FormField>

      <FormField name="hipScore" control={control} label={t('petForm.hipScoreLabel')}>
        <Input placeholder={t('petForm.hipScorePlaceholder')} />
      </FormField>

      <FormField name="litterRef" control={control} label={t('petForm.litterRefLabel')}>
        <Input
          placeholder={t('petForm.litterRefPlaceholder')}
          helperText={t('petForm.litterRefHelp')}
        />
      </FormField>

      <View className="gap-2">
        <Text variant="label">{t('petForm.certificateLabel')}</Text>
        <Text variant="caption" color="secondary">
          {t('petForm.certificateHelp')}
        </Text>
        <Button
          title={
            certificateUri || hasCertificate
              ? t('petForm.certificateReplace')
              : t('petForm.certificateAdd')
          }
          variant="outline"
          onPress={handlePickCertificate}
        />
        {certificateUri && <Notice message={t('petForm.certificateSelected')} tone="success" />}
      </View>

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

      <View className="gap-2">
        <Text variant="label">{t('petForm.locationLabel')}</Text>
        <Text variant="caption" color="secondary">
          {t('petForm.locationHelp')}
        </Text>
        <Button
          title={
            location.status === 'granted'
              ? t('petForm.locationCaptured')
              : t('petForm.locationUseCurrent')
          }
          variant="outline"
          loading={location.status === 'loading'}
          onPress={() => location.request()}
        />
        {location.status === 'denied' && (
          <Notice message={t('petForm.locationDenied')} tone="warning" />
        )}
      </View>

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

      {availableForMatching && (
        <Controller
          name="ownerAttestsBreedingReady"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View className="gap-1">
              <Switch label={t('petForm.attestLabel')} value={value} onValueChange={onChange} />
              {error?.message && (
                <Notice tone="error" message={translateDynamicKey(t, error.message)} />
              )}
            </View>
          )}
        />
      )}

      <Button
        title={mode === 'create' ? t('petForm.submit') : t('petForm.submitEdit')}
        onPress={onSubmit}
        loading={isSaving}
        fullWidth
      />
    </View>
  );
}
