import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Clock,
  Ruler,
  Sofa,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/config/site";
import { formatBaths, formatBeds, formatNumber } from "@/lib/formatting";
import { PROPERTY_TYPE_LABEL, type Property } from "@/types/property";

interface Fact {
  icon: LucideIcon;
  label: string;
  value: string;
}

/** One-line strip of the facts buyers scan first. */
export function FactsBar({ property }: { property: Property }) {
  const facts: Fact[] = [
    { icon: BedDouble, label: "Bedrooms", value: formatBeds(property.bedrooms) },
    { icon: Bath, label: "Bathrooms", value: formatBaths(property.bathrooms) },
    { icon: Ruler, label: "Living area", value: `${formatNumber(property.sqft)} sqft` },
    { icon: CalendarDays, label: "Year built", value: String(property.yearBuilt) },
    { icon: Building2, label: "Property type", value: PROPERTY_TYPE_LABEL[property.type] },
    {
      icon: Car,
      label: "Parking",
      value:
        property.parking > 0
          ? `${property.parking} ${property.parking === 1 ? "space" : "spaces"}`
          : "Street parking only",
    },
    { icon: Sofa, label: "Furnished", value: property.furnished ? "Fully furnished" : "Unfurnished" },
  ];

  if (property.rentType === "nightly") {
    facts.push({
      icon: Clock,
      label: "Minimum stay",
      value: `${property.minNights ?? site.booking.defaultMinNights} nights`,
    });
  }

  return (
    <section aria-label="Property facts">
      <div className="surface grid grid-cols-2 gap-x-6 gap-y-5 p-5 sm:grid-cols-4 sm:p-6">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-200">
              <fact.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
                {fact.label}
              </p>
              <p className="mt-0.5 truncate text-sm font-bold text-ink-900 dark:text-white">
                {fact.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FactsBar;
