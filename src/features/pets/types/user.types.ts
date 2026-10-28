export interface PetOwner {
  id: string;
  name: string;
  /** Only revealed after a request is accepted; empty for other owners until then. */
  phone: string;
  city: string;
  verifiedOwner: boolean;
}
