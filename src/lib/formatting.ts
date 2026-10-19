import { site } from "@/config/site";

/* ── Currency & numbers ───────────────────────────────────────────────── */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatMoney(value: number): string {
  return usd.format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** "$2,150/month" or "$189/night" */
export function formatPrice(
  price: number,
  rentType: "monthly" | "nightly",
): string {
  return `${formatMoney(price)}${rentType === "monthly" ? "/month" : "/night"}`;
}

export function formatBeds(bedrooms: number): string {
  return bedrooms === 0 ? "Studio" : `${bedrooms} bd`;
}

export function formatBaths(bathrooms: number): string {
  return `${bathrooms}${Number.isInteger(bathrooms) ? "" : ""} ba`;
}

export function formatAvailabilityDate(iso?: string): string {
  return iso ?? "";
}

/* ── Address formatting ───────────────────────────────────────────────── */

export function fullAddress(address: {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
}): string {
  const street = address.unit ? `${address.street}, ${address.unit}` : address.street;
  return `${street}, ${address.city}, ${address.state} ${address.zip}`;
}

export function neighborhoodAddress(address: {
  street: string;
  unit?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}): string {
  const street = address.unit ? `${address.street}, ${address.unit}` : address.street;
  return `${street}, ${address.neighborhood}, ${address.city}, ${address.state} ${address.zip}`;
}

export function oneLineAddress(address: {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
}): string {
  return `${address.street}${address.unit ? `, ${address.unit}` : ""} · ${address.city}, ${address.state} ${address.zip}`;
}

/* ── Contact links ────────────────────────────────────────────────────── */

export function whatsappLink(message: string, number: string = site.whatsappNumber): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function telLink(): string {
  return `tel:${site.phone.replace(/[^\d+]/g, "")}`;
}

/* ── Property enquiry message ─────────────────────────────────────────── */

export function propertyEnquiryMessage(input: {
  title: string;
  address: string;
  priceLabel: string;
  beds: string;
  baths: string;
}): string {
  return [
    `Hello ${site.brand}, I'm interested in *${input.title}* at *${input.address}* listed at *${input.priceLabel}* (${input.beds} / ${input.baths}).`,
    "Is it still available?",
  ].join(" ");
}

export function generalEnquiryMessage(): string {
  return `Hello ${site.brand}, I'd like to know more about your homes for rent in Texas.`;
}

/* ── Property URL ─────────────────────────────────────────────────────── */

export function propertyUrl(id: string): string {
  return `/homes/${id}`;
}
