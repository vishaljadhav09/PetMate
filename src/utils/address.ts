/** Indian PIN code: six digits, first digit 1-9. Matches the `pincode` check constraints. */
export const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export interface AddressParts {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

/**
 * Geocoding queries for an address, most precise first. Device geocoders often cannot resolve a
 * street address, so callers try each in turn and use the first match.
 */
export function addressQueries({ addressLine, city, state, pincode }: AddressParts): string[] {
  const clean = (value: string) => value.trim();
  const area = [clean(city), `${clean(state)} ${clean(pincode)}`.trim()].filter(Boolean).join(', ');
  const queries = [
    [clean(addressLine), area, 'India'].filter(Boolean).join(', '),
    [area, 'India'].filter(Boolean).join(', '),
    clean(pincode) ? `${clean(pincode)}, India` : '',
  ];
  return queries.filter((query, index) => query !== '' && queries.indexOf(query) === index);
}
