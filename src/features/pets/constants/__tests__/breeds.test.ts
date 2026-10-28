import { BREEDS, findPresetBreed } from '../breeds';

describe('findPresetBreed', () => {
  it('matches a preset ignoring case and surrounding spaces', () => {
    expect(findPresetBreed('dog', ' labrador retriever ')).toBe('Labrador Retriever');
  });

  it('returns undefined for a breed that is not a preset of that species', () => {
    expect(findPresetBreed('dog', 'Persian')).toBeUndefined();
    expect(findPresetBreed('other', 'Anything')).toBeUndefined();
  });
});

describe('BREEDS', () => {
  it('has no duplicates within a species', () => {
    for (const list of Object.values(BREEDS)) {
      const lower = list.map((breed) => breed.toLowerCase());
      expect(new Set(lower).size).toBe(lower.length);
    }
  });
});
