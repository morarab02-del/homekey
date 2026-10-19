import { site } from "@/config/site";
import type { Property } from "@/types/property";
import { priceLabel } from "@/lib/filtering";
import { whatsappLink, mailtoLink } from "@/lib/formatting";

/* ── Nightly booking totals ───────────────────────────────────────────── */

export interface NightlyQuote {
  nights: number;
  rent: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
}

export function nightsBetween(checkIn: Date | null, checkOut: Date | null): number {
  if (!checkIn || !checkOut) return 0;
  const ms = checkOut.getTime() - checkIn.getTime();
  if (ms <= 0) return 0;
  return Math.round(ms / 86_400_000);
}

export function nightlyQuote(
  property: Property,
  checkIn: Date | null,
  checkOut: Date | null,
): NightlyQuote {
  const nights = nightsBetween(checkIn, checkOut);
  const rate = property.priceNightly ?? 0;
  const rent = rate * nights;
  const cleaningFee = nights > 0 ? site.booking.cleaningFee : 0;
  const serviceFee = Math.round((rent + cleaningFee) * (site.booking.serviceFeePercent / 100));

  return {
    nights,
    rent,
    cleaningFee,
    serviceFee,
    total: rent + cleaningFee + serviceFee,
  };
}

export function canBookNightly(
  property: Property,
  checkIn: Date | null,
  checkOut: Date | null,
): boolean {
  const minNights = property.minNights ?? site.booking.defaultMinNights;
  const nights = nightsBetween(checkIn, checkOut);
  return nights >= minNights && nights > 0;
}

/* ── Enquiry payloads (ready for a future API) ────────────────────────── */

export interface TourRequest {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  message: string;
}

export interface BookingRequest extends TourRequest {
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateTourRequest(r: TourRequest): Partial<Record<keyof TourRequest, string>> {
  const errors: Partial<Record<keyof TourRequest, string>> = {};
  if (!r.name.trim()) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(r.email.trim())) errors.email = "Please enter a valid email address.";
  if (!r.phone.trim() || r.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a contact number.";
  if (!r.moveInDate) errors.moveInDate = "Choose a move-in date.";
  return errors;
}

export function validateBookingRequest(
  r: BookingRequest,
): Partial<Record<keyof BookingRequest, string>> {
  const errors: Partial<Record<keyof BookingRequest, string>> = validateTourRequest(r);
  if (r.nights <= 0) errors.checkIn = "Select a check-in and check-out date.";
  return errors;
}

/** Human-readable summary pasted into WhatsApp / used by the success screen. */
export function requestSummary(property: Property, fields: {
  name: string;
  email: string;
  phone: string;
  date: string;
  note?: string;
}): string {
  const label = property.rentType === "monthly" ? "Requested move-in date" : "Check-in date";
  return [
    `Property: ${property.title} — ${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
    `Rent: ${priceLabel(property)}`,
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `${label}: ${fields.date}`,
    fields.note ? `Note: ${fields.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** WhatsApp message for a submitted request. */
export function requestWhatsappLink(property: Property, fields: {
  name: string;
  email: string;
  phone: string;
  date: string;
  note?: string;
}): string {
  return whatsappLink(
    [
      `Hello ${site.brand}, I'd like to ${property.rentType === "monthly" ? "book a viewing" : "book a stay"} at ${property.title}.`,
      requestSummary(property, fields),
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

export function requestMailtoLink(
  property: Property,
  fields: {
    name: string;
    email: string;
    phone: string;
    date: string;
    note?: string;
  },
): string {
  return mailtoLink(`Enquiry — ${property.title}`, requestSummary(property, fields));
}
