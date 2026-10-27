import type { Rating } from '../types/rating.types';

export interface RatingSummary {
  average: number;
  count: number;
}

export function getRatingSummary(ratings: Rating[]): RatingSummary {
  if (ratings.length === 0) return { average: 0, count: 0 };
  const total = ratings.reduce((sum, rating) => sum + rating.stars, 0);
  return { average: total / ratings.length, count: ratings.length };
}
