import type { Rating } from '../types';
import { delay, generateId, mockRatings, MOCK_CURRENT_USER_ID } from './mockDb';

export interface CreateRatingData {
  matchRequestId: string;
  ratedUserId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export async function fetchRatingsForUser(userId: string): Promise<Rating[]> {
  return delay(mockRatings.filter((rating) => rating.ratedUserId === userId));
}

export async function fetchRatingsForMatchRequest(matchRequestId: string): Promise<Rating[]> {
  return delay(mockRatings.filter((rating) => rating.matchRequestId === matchRequestId));
}

export async function createRating(data: CreateRatingData): Promise<Rating> {
  const rating: Rating = {
    id: generateId('rating'),
    matchRequestId: data.matchRequestId,
    raterUserId: MOCK_CURRENT_USER_ID,
    ratedUserId: data.ratedUserId,
    stars: data.stars,
    comment: data.comment,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  mockRatings.push(rating);
  return delay(rating);
}
