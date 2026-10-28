import { describe, expect, it } from '@jest/globals';
import type { Tables } from '@/types/database';
import type { CreatePetData } from '../../types';
import { mapPetRow, toPetInsert, toPetUpdate } from '../petMapper';

const row: Tables<'pets'> = {
  id: 'p1',
  owner_id: 'u1',
  pet_name: 'Simba',
  species: 'dog',
  breed: 'Beagle',
  gender: 'male',
  date_of_birth: '2022-01-01',
  photos: ['https://example.com/a.jpg'],
  description: null,
  pedigree_certified: false,
  registration_number: null,
  vaccination_up_to_date: true,
  last_vet_checkup: null,
  hip_score: null,
  certificate_url: null,
  litter_ref: null,
  owner_attests_breeding_ready: true,
  breeding_status: 'available',
  stud_fee_type: 'pick_of_litter',
  stud_fee: null,
  location: null,
  lat: 18.52,
  lng: 73.855,
  city: 'Pune',
  verified: false,
  approved: true,
  hidden: false,
  status: 'active',
  created_at: '2026-10-28T10:00:00Z',
  updated_at: '2026-10-28T10:00:00Z',
};

describe('mapPetRow', () => {
  it('maps database columns to the app model', () => {
    const pet = mapPetRow(row);
    expect(pet.name).toBe('Simba');
    expect(pet.studTerms.type).toBe('pickOfLitter');
    expect(pet.availableForMatching).toBe(true);
    expect(pet.description).toBe('');
    expect(pet.lat).toBe(18.52);
    expect(pet.createdAt).toBe('2026-10-28');
  });

  it('treats any status other than available as not open to matching', () => {
    expect(mapPetRow({ ...row, breeding_status: 'resting' }).availableForMatching).toBe(false);
  });
});

describe('toPetInsert', () => {
  const data: CreatePetData = {
    name: 'Bella',
    species: 'dog',
    breed: 'Beagle',
    gender: 'female',
    dateOfBirth: '2022-01-01',
    vaccinationUpToDate: true,
    pedigreeCertified: false,
    description: '',
    studTerms: { type: 'fixedFee', feeAmount: 5000 },
    city: 'Pune',
    photos: [],
    ownerAttestsBreedingReady: true,
    availableForMatching: true,
    location: { lat: 18.52, lng: 73.85 },
  };

  it('writes longitude first in the location and maps stud terms', () => {
    const insert = toPetInsert(data);
    expect(insert.location).toBe('SRID=4326;POINT(73.85 18.52)');
    expect(insert.stud_fee_type).toBe('fee');
    expect(insert.stud_fee).toBe(5000);
    expect(insert.breeding_status).toBe('available');
  });

  it('drops the fee when the stud terms are not a fixed fee', () => {
    const insert = toPetInsert({ ...data, studTerms: { type: 'free', feeAmount: 5000 } });
    expect(insert.stud_fee).toBeNull();
  });
});

describe('toPetUpdate', () => {
  it('only includes fields that were provided', () => {
    expect(toPetUpdate({ name: 'New' })).toEqual({ pet_name: 'New' });
  });

  it('clears optional fields when explicitly set to undefined', () => {
    expect(toPetUpdate({ hipScore: undefined })).toEqual({ hip_score: null });
  });
});
