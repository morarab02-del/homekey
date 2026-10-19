import { House, MapPin, Tag } from "lucide-react";
import { properties } from "@/data/properties";
import { marketStats } from "@/lib/filtering";
import { formatMoney } from "@/lib/formatting";
import type { FilterState } from "@/lib/filtering";
import { SearchBar } from "./SearchBar";
import { useScrollReveal, useParallax } from "@/hooks/useScrollReveal";

export function Hero({
  filters,
  update,
  onOpenFilters,
  isFiltersOpen,
}: {
  filters: FilterState;
  update: (patch: Partial<FilterState>) => void;
  onOpenFilters?: () => void;
  isFiltersOpen?: boolean;
}) {
  const stats = marketStats(properties);
  const items = [
    { label: "Available homes", value: String(stats.homes), Icon: House },
    { label: "Texas cities", value: String(stats.cities), Icon: MapPin },
    { label: "Starting rent", value: `${formatMoney(stats.from)}/month`, Icon: Tag },
  ];

  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1, rootMargin: "0px 0px -100px 0px" });
  const [parallaxRef, parallaxStyle] = useParallax<HTMLDivElement>(0.15);

  return (
    <section ref={ref} className={`relative isolate overflow-hidden bg-surface-main transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      {/* Hero background with real property photo and subtle parallax */}
      <div ref={parallaxRef} aria-hidden="true" className="absolute inset-0 will-change-transform" style={parallaxStyle as React.CSSProperties}>
        <img
          src="/photos/hk-001/01.jpg"
          alt=""
          className="h-full w-full object-cover transition-transform duration-2000 ease-out group-hover:scale-105"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/50 to-ink-900/80" />
        {/* Subtle decorative pattern */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" fill="none">
          <defs>
            <pattern id="hero-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#A77C31" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

      <div className="shell relative py-16 sm:py-20 lg:py-24 xl:py-28">
        <div className={`transition-all duration-1000 ease-smooth ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-bold leading-[1.05] tracking-tight font-serif text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Find a rental home in Texas
          </h1>
        </div>

        <p className={`mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg transition-all duration-1000 ease-smooth delay-150 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Browse verified listings in Dallas, Houston, Austin, San Antonio, and Fort Worth.
          Every property is inspected, photographed, and rented directly by the owner.
        </p>

        <div className={`mt-8 max-w-4xl transition-all duration-1000 ease-smooth delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <SearchBar
            filters={filters}
            update={update}
            onOpenFilters={onOpenFilters}
            isFiltersOpen={isFiltersOpen}
          />
        </div>

        <dl className={`mt-10 grid max-w-4xl grid-cols-3 gap-3 sm:gap-4 transition-all duration-1000 ease-smooth delay-450 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {items.map(({ label, value, Icon }, index) => (
            <div
              key={label}
              className={`rounded-xl2 bg-white/10 p-3.5 ring-1 ring-inset ring-white/20 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 animate-enter stagger-${index + 1} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70 sm:text-xs">
                <Icon className="h-3.5 w-3.5 text-brass-accent" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 text-xl font-bold text-white sm:text-2xl">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}