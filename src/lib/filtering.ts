import type { Property, PropertyType, Availability } from "@/types/property";
import { PROPERTY_TYPE_LABEL, AVAILABILITY_LABEL } from "@/types/property";

/* ── Query shape (mirrors the URL search params) ──────────────────────── */

export interface FilterState {
  q: string;
  rentType: "all" | "monthly" | "nightly";
  minPrice: number | null;
  maxPrice: number | null;
  beds: number | null;
  baths: number | null;
  type: PropertyType | null;
  city: string | null;
  availability: Availability | null;
  sort: SortKey;
}

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "beds"
  | "sqft";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest listed" },
  { value: "beds", label: "Most bedrooms" },
  { value: "sqft", label: "Most square feet" },
];

export const defaultFilters: FilterState = {
  q: "",
  rentType: "all",
  minPrice: null,
  maxPrice: null,
  beds: null,
  baths: null,
  type: null,
  city: null,
  availability: null,
  sort: "featured",
};

/* ── Price of a listing regardless of rent type ───────────────────────── */

export function priceOf(p: Property): number {
  return p.rentType === "monthly" ? (p.priceMonthly ?? 0) : (p.priceNightly ?? 0);
}

export function priceLabel(p: Property): string {
  const value = priceOf(p);
  return p.rentType === "monthly"
    ? `$${value.toLocaleString("en-US")}/month`
    : `$${value.toLocaleString("en-US")}/night`;
}

/* ── Matching ─────────────────────────────────────────────────────────── */

function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesQuery(p: Property, q: string): boolean {
  if (!q) return true;
  const needle = normalise(q);
  if (!needle) return true;
  const hay = normalise(
    [
      p.id,
      p.title,
      p.type,
      p.address.street,
      p.address.unit ?? "",
      p.address.neighborhood,
      p.address.city,
      p.address.state,
      p.address.zip,
      ...p.amenities,
    ].join(" "),
  );
  return needle.split(" ").every((word) => hay.includes(word));
}

export function filterProperties(list: Property[], f: FilterState): Property[] {
  const items = list.filter((p) => {
    if (f.rentType !== "all" && p.rentType !== f.rentType) return false;
    if (!matchesQuery(p, f.q)) return false;

    const price = priceOf(p);
    if (f.minPrice !== null && price < f.minPrice) return false;
    if (f.maxPrice !== null && price > f.maxPrice) return false;

    if (f.beds !== null && p.bedrooms < f.beds) return false;
    if (f.baths !== null && p.bathrooms < f.baths) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.city && p.address.city !== f.city) return false;
    if (f.availability && p.availability.status !== f.availability) return false;
    return true;
  });

  return sortProperties(items, f.sort);
}

export function sortProperties(list: Property[], sort: SortKey): Property[] {
  const items = [...list];
  switch (sort) {
    case "price-asc":
      return items.sort((a, b) => priceOf(a) - priceOf(b));
    case "price-desc":
      return items.sort((a, b) => priceOf(b) - priceOf(a));
    case "newest":
      return items.sort((a, b) => a.id.localeCompare(b.id));
    case "beds":
      return items.sort((a, b) => b.bedrooms - a.bedrooms);
    case "sqft":
      return items.sort((a, b) => b.sqft - a.sqft);
    case "featured":
    default:
      return items.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id),
      );
  }
}

/* ── Counts for the filter UI ─────────────────────────────────────────── */

export function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.q) n++;
  if (f.rentType !== "all") n++;
  if (f.minPrice !== null || f.maxPrice !== null) n++;
  if (f.beds !== null) n++;
  if (f.baths !== null) n++;
  if (f.type) n++;
  if (f.city) n++;
  if (f.availability) n++;
  return n;
}

export function clearFilters(f: FilterState): FilterState {
  return { ...defaultFilters, sort: f.sort };
}

/* ── Similar listings for the detail page ─────────────────────────────── */

export function similarProperties(p: Property, list: Property[], limit = 3): Property[] {
  return list
    .filter((o) => o.id !== p.id)
    .sort((a, b) => {
      const score = (o: Property) =>
        (o.address.city === p.address.city ? 2 : 0) +
        (o.rentType === p.rentType ? 1 : 0) +
        (o.type === p.type ? 1 : 0);
      return score(b) - score(a) || a.id.localeCompare(b.id);
    })
    .slice(0, limit);
}

/* ── Fallback search with relevance ranking ───────────────────────────── */

export interface FallbackResult {
  property: Property;
  score: number;
  matchedCriteria: string[];
}

/**
 * Computes relevance score for a property against the original search filters.
 * Higher score = more relevant.
 * Only considers available properties (excludes leased).
 */
function computeRelevanceScore(property: Property, filters: FilterState): { score: number; matched: string[] } {
  let score = 0;
  const matched: string[] = [];

  // Strict requirements: rentType and availability must match
  // (These are handled by the caller filtering available properties first)

  // 1. City/Location match (highest weight)
  if (filters.city && property.address.city === filters.city) {
    score += 50;
    matched.push(`City: ${filters.city}`);
  } else if (filters.q) {
    // Check if query matches city, neighborhood, or street
    const queryLower = filters.q.toLowerCase();
    const cityLower = property.address.city.toLowerCase();
    const neighborhoodLower = property.address.neighborhood.toLowerCase();
    const streetLower = property.address.street.toLowerCase();

    if (cityLower.includes(queryLower) || neighborhoodLower.includes(queryLower) || streetLower.includes(queryLower)) {
      score += 30;
      matched.push(`Location: ${property.address.neighborhood}, ${property.address.city}`);
    }
  }

  // 2. Rental type match (strict in exact search, but for fallback we rank by it)
  if (filters.rentType !== "all" && property.rentType === filters.rentType) {
    score += 25;
    matched.push(`Type: ${filters.rentType === "monthly" ? "Monthly" : "Nightly"}`);
  }

  // 3. Price proximity (budget)
  const price = priceOf(property);
  if (filters.maxPrice !== null) {
    if (price <= filters.maxPrice) {
      // Within budget - higher score for closer to max (better value)
      const ratio = price / filters.maxPrice;
      score += 20 * (1 - ratio * 0.5); // 10-20 points
      matched.push(`Rent: ${priceLabel(property)}`);
    } else {
      // Over budget - penalty based on how much over
      const overRatio = (price - filters.maxPrice) / filters.maxPrice;
      score -= Math.min(30, overRatio * 50); // Up to -30 points
    }
  } else if (filters.minPrice !== null) {
    if (price >= filters.minPrice) {
      score += 10;
      matched.push(`Rent: ${priceLabel(property)}`);
    } else {
      score -= 10;
    }
  }

  // 4. Bedrooms match
  if (filters.beds !== null) {
    if (property.bedrooms >= filters.beds) {
      score += 15;
      matched.push(`${property.bedrooms} bed${property.bedrooms !== 1 ? "s" : ""}`);
    } else {
      // Penalty for fewer bedrooms than requested
      score -= (filters.beds - property.bedrooms) * 10;
    }
  }

  // 5. Bathrooms match
  if (filters.baths !== null) {
    if (property.bathrooms >= filters.baths) {
      score += 10;
      matched.push(`${property.bathrooms} bath${property.bathrooms !== 1 ? "s" : ""}`);
    } else {
      score -= (filters.baths - property.bathrooms) * 5;
    }
  }

  // 6. Property type match
  if (filters.type && property.type === filters.type) {
    score += 10;
    matched.push(PROPERTY_TYPE_LABEL[property.type]);
  }

  // 7. Availability match (available-now preferred over available-later)
  if (filters.availability) {
    if (property.availability.status === filters.availability) {
      score += 10;
      matched.push(AVAILABILITY_LABEL[property.availability.status]);
    }
  } else {
    // Prefer available-now
    if (property.availability.status === "available-now") {
      score += 5;
      matched.push("Available now");
    }
  }

  // 8. Query text match (amenities, features) - removed generic "Amenities" badge
  if (filters.q) {
    const queryLower = filters.q.toLowerCase();
    const amenityText = property.amenities.join(" ").toLowerCase();
    if (amenityText.includes(queryLower)) {
      score += 5;
      // Do not add a generic "Amenities" badge; cannot identify which amenity matched
    }
  }

  // 9. Featured properties get a small boost
  if (property.featured) {
    score += 3;
  }

  return { score, matched };
}

/**
 * Finds fallback results when exact search returns no matches.
 * Excludes leased properties. Ranks available properties by relevance to original filters.
 * Returns properties with their relevance scores and matched criteria for transparency.
 */
export function findFallbackResults(
  allProperties: Property[],
  filters: FilterState,
  exactResults: Property[],
  limit = 20
): FallbackResult[] {
  // If we have exact results, no fallback needed
  if (exactResults.length > 0) {
    return [];
  }

  // Get available properties (exclude leased)
  const availableProperties = allProperties.filter(
    (p) => p.availability.status !== "leased"
  );

  if (availableProperties.length === 0) {
    return [];
  }

  // Score and rank all available properties
  const scored = availableProperties.map((property) => {
    const { score, matched } = computeRelevanceScore(property, filters);
    return { property, score, matchedCriteria: matched };
  });

  // Sort by score descending, then by featured, then by ID for determinism
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.property.featured !== a.property.featured) return Number(b.property.featured) - Number(a.property.featured);
    return a.property.id.localeCompare(b.property.id);
  });

  // Return top results with positive scores (or top N if all negative)
  const positiveResults = scored.filter((r) => r.score > 0);
  const results = positiveResults.length > 0 ? positiveResults : scored;
  return results.slice(0, limit);
}

/* ── Range bounds for a given list ────────────────────────────────────── */

export function priceBounds(list: Property[]): { min: number; max: number } {
  if (!list.length) return { min: 0, max: 0 };
  const prices = list.map(priceOf);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function citiesIn(list: Property[]): string[] {
  return Array.from(new Set(list.map((p) => p.address.city))).sort();
}

/* ── Stats used in the hero strip ─────────────────────────────────────── */

export function marketStats(list: Property[]) {
  const available = list.filter((p) => p.availability.status !== "leased");
  const monthly = available.filter((p) => p.rentType === "monthly");
  const { min } = priceBounds(monthly);
  return {
    homes: available.length,
    cities: citiesIn(available).length,
    from: min,
  };
}
