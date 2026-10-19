import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clsx } from "clsx";
import { ArrowLeft, Heart, MapPin, SearchX, Share2 } from "lucide-react";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { AvailabilityPanel, AVAILABILITY_TONE } from "@/components/property/AvailabilityPanel";
import { Amenities } from "@/components/property/Amenities";
import { BookingPanel } from "@/components/property/BookingPanel";
import { FactsBar } from "@/components/property/FactsBar";
import { Gallery } from "@/components/property/Gallery";
import { LandlordCard } from "@/components/property/LandlordCard";
import { MiniMap } from "@/components/property/MiniMap";
import { Nav } from "@/components/property/Nav";
import { SimilarHomes } from "@/components/property/SimilarHomes";
import { ModelViewer } from "@/components/3d/ModelViewer";
import { modelFor } from "@/components/3d/modelData";
import { site } from "@/config/site";
import { useFavorites } from "@/context/FavoritesContext";
import { properties, propertyById, propertyBySlug } from "@/data/properties";
import { nightlyQuote } from "@/lib/booking";
import {
  formatBaths,
  formatBeds,
  formatMoney,
  formatNumber,
  fullAddress,
  neighborhoodAddress,
} from "@/lib/formatting";
import { priceLabel } from "@/lib/filtering";
import { AVAILABILITY_LABEL, PROPERTY_TYPE_LABEL, type Property } from "@/types/property";

/** Small circular score indicator used for the walk / transit ratings. */
function ScoreRing({ label, score }: { label: string; score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex items-center gap-3.5">
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 48 48" className="h-14 w-14 -rotate-90" aria-hidden="true">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            strokeWidth="5"
            className="stroke-muted-200 dark:stroke-white/15"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            className="stroke-brand-600 dark:stroke-brand-500"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-bold text-ink-900 dark:text-white">
          {score}
        </span>
      </div>
      <div>
        <p className="text-sm font-bold text-ink-900 dark:text-white">{label}</p>
        <p className="text-xs text-muted-600 dark:text-muted-500">out of 100</p>
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  const property = id ? (propertyById(id) ?? propertyBySlug(id)) : undefined;

  /* Page title + meta description. A microtask delay lets this win against the
     route-level title effect in <Layout>, which also fires on this navigation. */
  useEffect(() => {
    if (property) window.scrollTo({ top: 0, behavior: "instant" });

    const timer = window.setTimeout(() => {
      if (!property) {
        document.title = "Listing not found | HomeKey";
        return;
      }

      const title = `${property.title} | ${site.brand}`;
      const summary = property.description.length > 140
        ? `${property.description.slice(0, 140).trim().replace(/\s+\S*$/, "")}…`
        : property.description;
      const description = `${summary} ${priceLabel(property)} · ${formatBeds(property.bedrooms)} · ${formatBaths(property.bathrooms)} · ${fullAddress(property.address)}. Rent direct from ${site.landlord.name} on HomeKey.`;

      document.title = title;
      const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (meta) meta.setAttribute("content", description);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [property]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!property) {
    return (
      <div className="shell section">
        <div className="surface-flat mx-auto max-w-lg p-8 text-center sm:p-12">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted-100 text-muted-500 dark:bg-white/5 dark:text-muted-300">
            <SearchX className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
            Listing not found
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600 dark:text-muted-500">
            This home may have been leased, the link may be mistyped, or the listing was removed.
            All 20 verified Texas homes are one click away.
          </p>
          <Link to="/" className="btn btn-primary btn-md mt-6">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all homes
          </Link>
        </div>
      </div>
    );
  }

  const saved = isFavorite(property.id);
  const nightly = property.rentType === "nightly";
  const minNights = property.minNights ?? site.booking.defaultMinNights;
  const { status, availableFrom } = property.availability;

  /* Cheapest possible stay for the nightly headline hint. */
  const minStayQuote = nightlyQuote(
    property,
    new Date(),
    new Date(Date.now() + minNights * 86_400_000),
  );

  const share = async () => {
    const url = window.location.href;
    const shareData = { title: property.title, text: `${property.title} — ${priceLabel(property)}`, url };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }
    } catch {
      /* share sheet dismissed or blocked — fall through to copy-link */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* clipboard unavailable (insecure context) — nothing else to do */
    }
  };

  return (
    <div className="shell py-8 sm:py-10">
      <Nav property={property} />

      <header className="mt-5">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={AVAILABILITY_TONE[status]}>{AVAILABILITY_LABEL[status]}</Badge>
              {status === "available-later" && availableFrom ? (
                <span className="pill pill-muted">From {availableFrom}</span>
              ) : null}
              <Badge tone="brand">{PROPERTY_TYPE_LABEL[property.type]}</Badge>
              {property.landlord.verified ? <VerifiedBadge /> : null}
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
              {property.title}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-2xl font-bold text-brand-700 sm:text-3xl dark:text-brand-300">
                {priceLabel(property)}
              </p>
              <p className="text-sm font-medium text-ink-700 dark:text-muted-300">
                {formatBeds(property.bedrooms)} · {formatBaths(property.bathrooms)} ·{" "}
                {formatNumber(property.sqft)} sqft
              </p>
              <StarRating rating={property.rating} reviews={property.reviewsCount} />
            </div>

            <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-600 dark:text-muted-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
              {neighborhoodAddress(property.address)}
            </p>

            {nightly ? (
              <p className="mt-1.5 text-sm text-ink-600 dark:text-muted-500">
                {minNights}-night minimum · {formatMoney(minStayQuote.total)} total for{" "}
                {minNights} nights including cleaning and service fees
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(property.id)}
              aria-pressed={saved}
              aria-label={
                saved
                  ? `Remove ${property.title} from saved homes`
                  : `Save ${property.title} to your saved homes`
              }
              title={saved ? "Saved" : "Save this home"}
              className={clsx(
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                saved
                  ? "border-brand-700 bg-brand-700 text-white hover:bg-brand-800 dark:border-brand-500 dark:bg-brand-600 dark:hover:bg-brand-500"
                  : "border-muted-200 bg-white text-ink-900 hover:bg-muted-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
              )}
            >
              <Heart className={clsx("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
              {saved ? "Saved" : "Save"}
            </button>

            <Button
              type="button"
              variant="secondary"
              onClick={share}
              aria-label={`Share ${property.title}`}
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share
            </Button>

            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to results
            </Button>

            {copied ? (
              <span
                role="status"
                className="pill pill-ok"
              >
                Link copied
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-7">
        <ModelHero property={property} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <FactsBar property={property} />
          <AvailabilityPanel property={property} />
          <Amenities property={property} />

          <section className="surface p-5 sm:p-6" aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-lg font-bold text-ink-900 dark:text-white">
              About this home
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base dark:text-muted-500">
              {property.description}
            </p>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-ink-700 dark:text-muted-300">
              The neighbourhood
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-muted-500">
              {property.neighborhoodInfo}
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-muted-200 bg-muted-50/60 p-4 dark:border-white/10 dark:bg-white/[.03]">
                <ScoreRing label="Walk score" score={property.walkScore} />
              </div>
              <div className="rounded-xl border border-muted-200 bg-muted-50/60 p-4 dark:border-white/10 dark:bg-white/[.03]">
                <ScoreRing label="Transit score" score={property.transitScore} />
              </div>
            </div>
          </section>

          <MiniMap property={property} />
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-28 space-y-6">
            <LandlordCard property={property} />
            <BookingPanel property={property} />
          </div>
        </aside>
      </div>

      <SimilarHomes property={property} list={properties} />
    </div>
  );
}

/** 3D walkthrough hero — falls back to the photo gallery when no model exists. */
function ModelHero({ property }: { property: Property }) {
  const m = modelFor(property.id);
  const rooms = m?.rooms ?? [];
  const fallback = <Gallery photos={property.photos} title={property.title} />;

  if (!m || rooms.length === 0) return fallback;

  return (
    <ModelViewer
      glb={m.glb}
      rooms={rooms}
      defaultRoom={rooms[0]?.id}
      watermark="HomeKey 3D"
      className="h-[58vh] min-h-[360px] lg:h-[60vh]"
    />
  );
}
