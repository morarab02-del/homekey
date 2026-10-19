import {
  AirVent,
  Bike,
  Blocks,
  Car,
  Check,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Gamepad2,
  Home,
  ShieldCheck,
  Shirt,
  Snowflake,
  Sofa,
  Sparkles,
  Sun,
  Trees,
  Tv,
  Utensils,
  UtensilsCrossed,
  Waves,
  Wifi,
  WashingMachine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Property } from "@/types/property";

/** Keyword → icon, first match wins. Anything unmatched falls back to a check. */
const AMENITY_ICONS: [RegExp, LucideIcon][] = [
  [/laundry|washer|dryer/, WashingMachine],
  [/central air|air.condition/, AirVent],
  [/dishwasher/, Utensils],
  [/kitchen|chef/, UtensilsCrossed],
  [/closet/, Shirt],
  [/balcony|patio|porch|terrace|deck|courtyard/, Sun],
  [/pool/, Waves],
  [/gym|fitness/, Dumbbell],
  [/wifi|internet/, Wifi],
  [/smart tv|television|^tv$/, Tv],
  [/furnished/, Sofa],
  [/yard|garden|oaks|trees|fence/, Trees],
  [/hardwood|oak floors|floors/, Sparkles],
  [/sprinkler|shower/, Droplets],
  [/secured|security|entry|doorman/, ShieldCheck],
  [/garage|parking|gated drive|driveway/, Car],
  [/ev charging|charging/, Zap],
  [/bike/, Bike],
  [/brick/, Blocks],
  [/game room/, Gamepad2],
  [/trail/, Footprints],
  [/solar/, Sun],
  [/studio|detached/, Home],
];

function iconFor(amenity: string): LucideIcon {
  const lower = amenity.toLowerCase();
  for (const [pattern, Icon] of AMENITY_ICONS) {
    if (pattern.test(lower)) return Icon;
  }
  return Check;
}

/** Amenity icon grid plus the building-features breakdown. */
export function Amenities({ property }: { property: Property }) {
  const { cooling, heating, appliances, utilitiesIncluded } = property.features;

  return (
    <section className="surface p-5 sm:p-6" aria-labelledby="amenities-heading">
      <h2 id="amenities-heading" className="text-lg font-bold text-ink-900 dark:text-white">
        Amenities
      </h2>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {property.amenities.map((amenity) => {
          const Icon = iconFor(amenity);
          return (
            <li
              key={amenity}
              className="flex items-center gap-3 rounded-xl border border-muted-200 bg-white p-3 dark:border-white/10 dark:bg-white/[.03]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-200">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-ink-800 dark:text-muted-100">
                {amenity}
              </span>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-ink-700 dark:text-muted-300">
        Features
      </h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-muted-200 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
            <Snowflake className="h-3.5 w-3.5" aria-hidden="true" />
            Cooling
          </p>
          <p className="mt-1.5 text-sm font-semibold text-ink-900 dark:text-white">{cooling}</p>
        </div>
        <div className="rounded-xl border border-muted-200 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            Heating
          </p>
          <p className="mt-1.5 text-sm font-semibold text-ink-900 dark:text-white">{heating}</p>
        </div>
        <div className="rounded-xl border border-muted-200 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
            Appliances
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {appliances.map((item) => (
              <span key={item} className="pill pill-brand">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-muted-200 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
            Utilities included
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {utilitiesIncluded.length > 0 ? (
              utilitiesIncluded.map((item) => (
                <span key={item} className="pill pill-ok">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm font-medium text-muted-600 dark:text-muted-500">
                None — all utilities in the tenant&rsquo;s name
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Amenities;
