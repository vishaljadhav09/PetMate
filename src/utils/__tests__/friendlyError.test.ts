import { describe, expect, it } from '@jest/globals';
import { friendlyError } from '../friendlyError';

const t = (key: never) => `t:${key as string}`;

describe('friendlyError', () => {
  it('maps a duplicate request to a readable message', () => {
    expect(friendlyError({ code: '23505', message: 'duplicate key' }, t)).toBe(
      't:errors.duplicate'
    );
  });

  it('maps a permission error', () => {
    expect(friendlyError({ code: '42501', message: 'denied' }, t)).toBe('t:errors.permission');
  });

  it('maps an expired session', () => {
    expect(friendlyError({ code: 'PGRST301', message: 'x' }, t)).toBe('t:errors.sessionExpired');
    expect(friendlyError({ message: 'JWT expired' }, t)).toBe('t:errors.sessionExpired');
  });

  it('shows database rule messages as written', () => {
    expect(friendlyError({ code: 'P0001', message: 'Species must match' }, t)).toBe(
      'Species must match'
    );
  });

  it('maps a network failure', () => {
    expect(friendlyError(new Error('Network request failed'), t)).toBe('t:errors.network');
  });

  it('falls back to the generic message', () => {
    expect(friendlyError(new Error('boom'), t)).toBe('t:errors.generic');
    expect(friendlyError('nope', t)).toBe('t:errors.generic');
    expect(friendlyError(null, t)).toBe('t:errors.generic');
  });
});
