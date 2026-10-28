import { addressQueries, PINCODE_PATTERN } from '../address';

describe('PINCODE_PATTERN', () => {
  it('accepts six digits not starting with 0', () => {
    expect(PINCODE_PATTERN.test('411001')).toBe(true);
    expect(PINCODE_PATTERN.test('416001')).toBe(true);
  });

  it('rejects wrong length, leading zero and non-digits', () => {
    expect(PINCODE_PATTERN.test('41100')).toBe(false);
    expect(PINCODE_PATTERN.test('4110011')).toBe(false);
    expect(PINCODE_PATTERN.test('011001')).toBe(false);
    expect(PINCODE_PATTERN.test('41100a')).toBe(false);
  });
});

describe('addressQueries', () => {
  const parts = {
    addressLine: ' 12 MG Road ',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
  };

  it('orders queries from the full address down to the pincode alone', () => {
    expect(addressQueries(parts)).toEqual([
      '12 MG Road, Pune, Maharashtra 411001, India',
      'Pune, Maharashtra 411001, India',
      '411001, India',
    ]);
  });

  it('drops empty and duplicate queries', () => {
    expect(addressQueries({ addressLine: '', city: 'Pune', state: '', pincode: '' })).toEqual([
      'Pune, India',
    ]);
  });
});
