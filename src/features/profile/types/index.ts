import type { Coordinates } from '@/hooks/useCurrentLocation';

export interface MyProfile {
  id: string;
  name: string;
  city: string;
  phone: string;
  /** Private home address. Never shown to other users. */
  addressLine: string;
  state: string;
  pincode: string;
  /** Where the home address geocodes to. Used as the default Discover search origin. */
  homeLocation?: Coordinates;
  verifiedOwner: boolean;
  ratingAvg: number;
  ratingCount: number;
}

export interface UpdateProfileData {
  name: string;
  city: string;
  phone: string;
  addressLine: string;
  state: string;
  pincode: string;
  /** Geocoded home address; `null` clears it, `undefined` leaves the stored value alone. */
  homeLocation?: Coordinates | null;
}
