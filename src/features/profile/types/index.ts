export interface MyProfile {
  id: string;
  name: string;
  city: string;
  phone: string;
  verifiedOwner: boolean;
  ratingAvg: number;
  ratingCount: number;
}

export interface UpdateProfileData {
  name: string;
  city: string;
  phone: string;
}
