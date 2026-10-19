export type RentType = "monthly" | "nightly";

export type PropertyType =
  | "house"
  | "apartment"
  | "townhouse"
  | "condo"
  | "duplex"
  | "studio";

export type Availability = "available-now" | "available-later" | "leased";

export interface PropertyAddress {
  street: string;
  unit?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

export interface PropertyFees {
  securityDeposit: number;
  applicationFee: number;
  petsAllowed: boolean;
  petFee?: number;
}

export interface PropertyFeatures {
  cooling: string;
  heating: string;
  appliances: string[];
  utilitiesIncluded: string[];
}

export interface Landlord {
  name: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  responseTime: string;
  license: string;
}

export interface PropertyPhoto {
  /** Path served from `public/`, e.g. "/photos/hk-001/01.jpg". */
  src: string;
  alt: string;
  /** Which room the photo shows, e.g. "Living room", "Primary bedroom". */
  room: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  rentType: RentType;

  /** Monthly listings only. */
  priceMonthly?: number;
  /** Nightly listings only. */
  priceNightly?: number;

  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  parking: number;
  furnished: boolean;
  minNights?: number;

  address: PropertyAddress;
  location: { lat: number; lng: number };

  availability: {
    status: Availability;
    /** Used when status is "available-later", e.g. "Mar 1, 2026". */
    availableFrom?: string;
  };

  fees: PropertyFees;
  amenities: string[];
  features: PropertyFeatures;
  description: string;
  neighborhoodInfo: string;
  walkScore: number;
  transitScore: number;

  photos: PropertyPhoto[];
  landlord: Landlord;

  rating: number;
  reviewsCount: number;
  featured: boolean;
}

/* ── Display helpers (narrow contracts so UI only needs these) ── */

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  townhouse: "Townhouse",
  condo: "Condo",
  duplex: "Duplex",
  studio: "Studio",
};

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  "available-now": "Available now",
  "available-later": "Available later",
  leased: "Leased",
};
