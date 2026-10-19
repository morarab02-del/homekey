import { useEffect, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { SmartImage } from "@/components/ui/SmartImage";
import { StarRating } from "@/components/ui/StarRating";
import { useFavorites } from "@/context/FavoritesContext";
import {
  formatBaths,
  formatBeds,
  formatNumber,
  formatPrice,
  propertyUrl,
} from "@/lib/formatting";
import { priceOf } from "@/lib/filtering";
import {
  AVAILABILITY_LABEL,
  type Availability,
  type Property,
} from "@/types/property";

const AVAILABILITY_TONE: Record<Availability, "ok" | "soon" | "muted"> = {
  "available-now": "ok",
  "available-later": "soon",
  leased: "muted",
};

const RENT_TYPE_TAG: Record<Property["rentType"], string> = {
  monthly: "Long-term rental",
  nightly: "Short stay",
};

const RENT_TERM_SUFFIX: Record<Property["rentType"], string> = {
  monthly: "/ month",
  nightly: "/ night",
};

function FavoriteButton({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(property.id);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${property.title} from saved homes` : `Save ${property.title}`}
      title={saved ? "Saved" : "Save this home"}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(property.id);
      }}
      className={clsx(
        "grid h-9 w-9 place-items-center rounded-full shadow-sm ring-1 ring-inset transition-all duration-200 hover:scale-110",
        saved
          ? "bg-brand-700 text-white ring-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:ring-brand-500"
          : "bg-white/90 text-ink-600 ring-white/70 hover:bg-white hover:text-brand-700 dark:bg-ink-900/70 dark:text-white dark:ring-white/20 dark:hover:text-brand-200",
      )}
    >
      <Heart className={clsx("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
    </button>
  );
}

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  matchedCriteria?: string[];
}

export function PropertyCard({
  property,
  priority = false,
  matchedCriteria = [],
}: PropertyCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    setPhotoIndex(0);
  }, [property.id]);

  const photos = property.photos;
  const count = photos.length;
  const activeIndex = count > 0 ? Math.min(photoIndex, count - 1) : 0;
  const current = count > 0 ? photos[activeIndex] : undefined;
  const leased = property.availability.status === "leased";
  const locationLine = `${property.address.neighborhood}, ${property.address.city}`;

  const stopAnd = (action: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  const go = (direction: 1 | -1) => () =>
    setPhotoIndex((i) => (count > 0 ? (i + direction + count) % count : 0));

  return (
    <Link
      to={propertyUrl(property.id)}
      className="group surface flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1 focus-visible:shadow-lift"
    >
      {/* ── Media ─────────────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted-100 dark:bg-white/5">
        {current ? (
          <SmartImage
            src={current.src}
            alt={current.alt}
            eager={priority}
            className="h-full w-full transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}

        {/* Availability (+ available-from date) */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          <Badge tone={AVAILABILITY_TONE[property.availability.status]}>
            {AVAILABILITY_LABEL[property.availability.status]}
          </Badge>
          {property.availability.status === "available-later" && property.availability.availableFrom ? (
            <span className="pill pill-muted shadow-sm">
              From {property.availability.availableFrom}
            </span>
          ) : null}
        </div>

        {/* Verified landlord + favorite toggle */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          {property.landlord.verified ? (
            <VerifiedBadge className="shadow-sm backdrop-blur-sm" />
          ) : null}
          <FavoriteButton property={property} />
        </div>

        {leased ? (
          <div className="pointer-events-none absolute inset-0 z-[5] grid place-items-center bg-ink-900/55 backdrop-blur-[1px]">
            <span className="pill pill-muted !bg-white !text-ink-900 text-sm shadow-pop dark:!bg-ink-900 dark:!text-white">
              Leased
            </span>
          </div>
        ) : null}

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={stopAnd(go(-1))}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-md transition-all duration-200 hover:bg-white hover:scale-110 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 dark:bg-ink-900/80 dark:text-white dark:hover:bg-ink-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={stopAnd(go(1))}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-md transition-all duration-200 hover:bg-white hover:scale-110 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 dark:bg-ink-900/80 dark:text-white dark:hover:bg-ink-900"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {photos.map((photo, i) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={stopAnd(() => setPhotoIndex(i))}
                  aria-label={`Show photo ${i + 1} of ${count}`}
                  aria-current={i === activeIndex}
                  className={clsx(
                    "pointer-events-auto h-1.5 rounded-full transition-all duration-200",
                    i === activeIndex
                      ? "w-5 bg-white shadow"
                      : "w-1.5 bg-white/60 hover:bg-white/90 hover:scale-150",
                  )}
                />
              ))}
            </div>

            <span className="absolute bottom-3 right-3 rounded-full bg-ink-900/70 px-2 py-0.5 text-[11px] font-semibold text-white">
              {activeIndex + 1}/{count}
            </span>
          </>
        ) : null}
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5 space-y-3 animate-enter stagger-1 delay-100">
        <p className="text-xs text-ink-subtle uppercase tracking-wider font-semibold">
          {locationLine}
        </p>

        <h3 className="font-serif text-xl font-bold text-ink-primary group-hover:text-brand-700 transition-colors duration-200">
          {property.title}
        </h3>

        <div className="flex flex-wrap gap-3 text-xs text-ink-muted animate-enter stagger-2 delay-150">
          <span>{formatBeds(property.bedrooms)}</span>
          <span>{formatBaths(property.bathrooms)}</span>
          <span>{formatNumber(property.sqft)} sqft</span>
        </div>

        {matchedCriteria.length > 0 && (
          <div className="flex flex-wrap gap-1.5 animate-enter stagger-3 delay-200" aria-label="Why this property was recommended">
            {matchedCriteria.map((criterion, i) => (
              <Badge key={i} tone="plain" className="bg-brass-50 text-brass-800 dark:bg-brass-900/30 dark:text-brass-200 border border-brass-200 dark:border-brass-700">
                {criterion}
              </Badge>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-sand-border flex items-baseline justify-between animate-enter stagger-4 delay-250">
          <div>
            <span className="font-sans text-xl font-bold text-ink-primary">
              {formatPrice(priceOf(property), property.rentType)}
            </span>
            <span className="text-xs text-ink-muted">
              {RENT_TERM_SUFFIX[property.rentType]}
            </span>
          </div>
          <span className="text-xs text-ink-subtle">
            {RENT_TYPE_TAG[property.rentType]}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 animate-enter stagger-5 delay-300">
          <StarRating rating={property.rating} reviews={property.reviewsCount} size={13} />
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-300 transition-transform duration-200 group-hover:translate-x-1">
            View property
            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}