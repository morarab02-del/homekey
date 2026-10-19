/**
 * HomeKey site configuration — single source of truth.
 * Change the WhatsApp number, landlord details or palette values here only.
 */

export const site = {
  brand: "HomeKey",
  tagline: "Homes for rent across Texas",

  /** WhatsApp — digits only, with country code, no + or spaces (required by wa.me). */
  whatsappNumber: "254714030732",
  /** Human-readable form shown on the page. */
  whatsappDisplay: "+254 714 030 732",

  email: "homekey@gmail.com",
  phone: "+254 714 030 732",

  landlord: {
    name: "George Mark",
    email: "homekey@gmail.com",
    phone: "+254 714 030 732",
    verified: true,
    responseTime: "Usually replies within 30 minutes",
    license: "TX Real Estate License #701234",
  },

  serviceAreas: ["Dallas", "Houston", "Austin", "San Antonio", "Fort Worth"],

  /** Pricing model used by the nightly booking calculator. */
  booking: {
    cleaningFee: 75,
    serviceFeePercent: 8,
    defaultMinNights: 2,
  },

  legal: {
    company: "HomeKey Properties",
    address: "Dallas, Texas, United States",
  },
} as const;

export type Site = typeof site;
