import type { MatchRequest, Rating, Report } from '../types';

/**
 * TEMPORARY mock "database" — module-level mutable state, resets on every
 * reload. There is no real backend yet. Delete this file (and swap the
 * `*Service.ts` function bodies for real `api` calls) once one exists — the
 * hooks and components that consume those services do not need to change.
 */

export const MOCK_CURRENT_USER_ID = 'user-1';

export const mockMatchRequests: MatchRequest[] = [];
export const mockRatings: Rating[] = [];
export const mockReports: Report[] = [];

let idSequence = 100;
export function generateId(prefix: string): string {
  idSequence += 1;
  return `${prefix}-${idSequence}`;
}

const MOCK_LATENCY_MS = 300;

/** Wraps a value in a resolved promise after a short delay, to mimic real network latency. */
export function delay<T>(value: T, ms: number = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
