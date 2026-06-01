export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  division: string;
  district: string;
  area: string;
  streetAddress: string;
  postalCode?: string;
  addressLabel?: string; // e.g., 'Home', 'Office'
  isDefault: boolean;
}
