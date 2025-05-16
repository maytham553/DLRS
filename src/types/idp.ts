export type Duration = "1 YEAR - $50" | "3 YEAR - $70" | "5 YEAR - $115" | "10 YEAR - $200";
export type Gender = "Male" | "Female";
export type LicenseClass = "A" | "B" | "C" | "D" | "E";
export type RequestIdCard = "Yes" | "No";
export type StatusType = "approved" | "canceled" | "expired";

export interface IDPFormData {
  id: string;
  name: string;
  familyName: string;
  countryCode: string;
  phoneNumber: string;
  gender: Gender;
  birthDate: string;
  birthPlace: string;
  licenseNumber: string;
  licenseClass: string[]; // Changed from LicenseClass to string[] for multiple selections
  issuerCountry: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  residenceCountry: string;
  duration: Duration;
  requestIdCard: RequestIdCard;
  status?: StatusType;
  createdAt?: { seconds: number; nanoseconds: number };
  expiryDate?: { seconds: number; nanoseconds: number };

  personalPhoto?: string;
  licenseFrontPhoto?: string;
  licenseBackPhoto?: string;
}

export interface IDPFormInput
  extends Omit<
    IDPFormData,
    "personalPhoto" | "licenseFrontPhoto" | "licenseBackPhoto"
  > {
  personalPhoto: File | null;
  licenseFrontPhoto: File | null;
  licenseBackPhoto: File | null;
}
