export interface Rating {
  id: string;
  matchRequestId: string;
  raterUserId: string;
  ratedUserId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}
