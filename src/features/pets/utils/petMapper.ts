import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';
import type { CreatePetData, Pet, StudTermsType, UpdatePetData } from '../types';

type PetRow = Tables<'pets'>;

const STUD_TYPE_FROM_DB: Record<PetRow['stud_fee_type'], StudTermsType> = {
  fee: 'fixedFee',
  pick_of_litter: 'pickOfLitter',
  free: 'free',
  negotiable: 'negotiable',
};

const STUD_TYPE_TO_DB: Record<StudTermsType, PetRow['stud_fee_type']> = {
  fixedFee: 'fee',
  pickOfLitter: 'pick_of_litter',
  free: 'free',
  negotiable: 'negotiable',
};

export function mapPetRow(row: PetRow): Pet {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.pet_name,
    species: row.species,
    breed: row.breed,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    vaccinationUpToDate: row.vaccination_up_to_date,
    pedigreeCertified: row.pedigree_certified,
    registrationNumber: row.registration_number ?? undefined,
    description: row.description ?? '',
    studTerms: {
      type: STUD_TYPE_FROM_DB[row.stud_fee_type],
      feeAmount: row.stud_fee ?? undefined,
    },
    city: row.city ?? '',
    photos: row.photos,
    lastVetCheckup: row.last_vet_checkup ?? undefined,
    hipScore: row.hip_score ?? undefined,
    certificatePath: row.certificate_url ?? undefined,
    litterRef: row.litter_ref ?? undefined,
    ownerAttestsBreedingReady: row.owner_attests_breeding_ready,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    verified: row.verified,
    approved: row.approved,
    hidden: row.hidden,
    availableForMatching: row.breeding_status === 'available',
    createdAt: row.created_at.slice(0, 10),
  };
}

/** PostGIS accepts EWKT text for a `geography` column. Longitude comes first. */
function toLocation(location: { lat: number; lng: number }): string {
  return `SRID=4326;POINT(${location.lng} ${location.lat})`;
}

function mapShared(data: UpdatePetData): TablesUpdate<'pets'> {
  const update: TablesUpdate<'pets'> = {};
  if (data.name !== undefined) update.pet_name = data.name;
  if (data.species !== undefined) update.species = data.species;
  if (data.breed !== undefined) update.breed = data.breed;
  if (data.gender !== undefined) update.gender = data.gender;
  if (data.dateOfBirth !== undefined) update.date_of_birth = data.dateOfBirth;
  if (data.vaccinationUpToDate !== undefined) {
    update.vaccination_up_to_date = data.vaccinationUpToDate;
  }
  if (data.pedigreeCertified !== undefined) update.pedigree_certified = data.pedigreeCertified;
  if ('registrationNumber' in data) update.registration_number = data.registrationNumber ?? null;
  if (data.description !== undefined) update.description = data.description || null;
  if (data.studTerms !== undefined) {
    update.stud_fee_type = STUD_TYPE_TO_DB[data.studTerms.type];
    update.stud_fee =
      data.studTerms.type === 'fixedFee' ? (data.studTerms.feeAmount ?? null) : null;
  }
  if (data.city !== undefined) update.city = data.city;
  if (data.photos !== undefined) update.photos = data.photos;
  if ('lastVetCheckup' in data) update.last_vet_checkup = data.lastVetCheckup ?? null;
  if ('hipScore' in data) update.hip_score = data.hipScore ?? null;
  if ('certificatePath' in data) update.certificate_url = data.certificatePath ?? null;
  if ('litterRef' in data) update.litter_ref = data.litterRef ?? null;
  if (data.ownerAttestsBreedingReady !== undefined) {
    update.owner_attests_breeding_ready = data.ownerAttestsBreedingReady;
  }
  if (data.availableForMatching !== undefined) {
    update.breeding_status = data.availableForMatching ? 'available' : 'not_available';
  }
  if (data.location !== undefined) update.location = toLocation(data.location);
  return update;
}

export function toPetUpdate(data: UpdatePetData): TablesUpdate<'pets'> {
  return mapShared(data);
}

export function toPetInsert(data: CreatePetData): TablesInsert<'pets'> {
  const shared = mapShared(data);
  return {
    ...shared,
    pet_name: data.name,
    breed: data.breed,
    gender: data.gender,
    date_of_birth: data.dateOfBirth,
    location: toLocation(data.location),
  };
}
