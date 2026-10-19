import { useEffect, useMemo, useRef, useState } from "react";
import { SearchX, Info } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FilterPanel, MobileFilterDrawer } from "@/components/home/FilterPanel";
import { MapView } from "@/components/home/MapView";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { FAQ } from "@/components/home/FAQ";
import { LandlordBand } from "@/components/home/LandlordBand";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { SectionHeading } from "@/components/ui";
import { useFilters } from "@/hooks/useFilters";
import { SORT_OPTIONS, countActiveFilters, type SortKey } from "@/lib/filtering";
import type { Property } from "@/types/property";

export default function Home() {
  const { filters, update, reset, results, total, fallbackResults, isShowingFallback } = useFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeCount = countActiveFilters(filters);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Create a map of fallback property IDs to their matched criteria for easy lookup
  const fallbackCriteriaMap = useMemo(
    () => new Map(fallbackResults.map((r) => [r.property.id, r.matchedCriteria])),
    [fallbackResults]
  );
  
  const displayResults: Property[] = results.length > 0 ? results : fallbackResults.map((r) => r.property);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  return (
    <>
      <Hero
        filters={filters}
        update={update}
        onOpenFilters={() => setFiltersOpen(true)}
        isFiltersOpen={filtersOpen}
      />

      <TrustStrip />

      <section ref={resultsRef} id="results" className="section scroll-mt-28 bg-surface-main">
        <div className="shell">
          <SectionHeading
            title="Homes for rent in Texas"
            subtitle={
              results.length > 0
                ? `${results.length} of ${total} listings available — every home rented directly by the owner.`
                : isShowingFallback
                ? `No exact matches — showing ${fallbackResults.length} available alternative${fallbackResults.length !== 1 ? "s" : ""} instead.`
                : `No available homes match those filters.`
            }
            action={
              <div className="flex items-center gap-2">
                <label
                  htmlFor="home-sort"
                  className="hidden text-xs font-semibold uppercase tracking-wide text-muted-600 sm:block dark:text-muted-500"
                >
                  Sort
                </label>
                <Select
                  id="home-sort"
                  aria-label="Sort results"
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value as SortKey })}
                  className="w-full sm:w-48"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            }
          />

          <div className="flex gap-8">
            {/* Sticky filter rail (desktop) */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-24">
                <FilterPanel filters={filters} update={update} reset={reset} />
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              {displayResults.length > 0 ? (
                <>
                  {isShowingFallback && (
                    <div className="mb-6 rounded-xl border border-brass-200 bg-brass-50 p-4 dark:border-brass-800 dark:bg-brass-900/30 animate-enter">
                      <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brass-700 dark:text-brass-300" aria-hidden="true" />
                        <div className="text-sm text-ink-700 dark:text-muted-300">
                          <p className="font-semibold">No exact matches found</p>
                          <p className="mt-1">
                            Your search for <strong>{filters.q || "all locations"}</strong>{filters.city ? ` in <strong>${filters.city}</strong>` : ""}{filters.rentType !== "all" ? ` (<strong>${filters.rentType === "monthly" ? "monthly" : "nightly"}</strong> rentals)` : ""}{filters.beds ? ` with <strong>${filters.beds}+ bed${filters.beds > 1 ? "s" : ""}</strong>` : ""}{filters.maxPrice ? ` under <strong>$${filters.maxPrice.toLocaleString()}</strong>` : ""} returned no exact results.
                          </p>
                          <p className="mt-2">
                            Showing the best available alternatives below. Each listing shows its actual location, price, bedrooms, bathrooms, and rental type so you can compare.
                          </p>
                          <p className="mt-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => reset()}>
                              Clear all filters{activeCount > 0 ? ` (${activeCount})` : ""} to see all listings
                            </Button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {displayResults.map((property, index) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        priority={index < 6}
                        matchedCriteria={isShowingFallback ? fallbackCriteriaMap.get(property.id) ?? [] : []}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="surface-flat p-8 text-center sm:p-12">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted-100 text-muted-500 dark:bg-white/5 dark:text-muted-300">
                    <SearchX className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-white">
                    {isShowingFallback ? "No available alternatives" : "No homes match those filters"}
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600 dark:text-muted-500">
                    {isShowingFallback
                      ? "There are currently no available homes in the inventory. Check back soon or join the waitlist for leased properties."
                      : "Try widening the price range or clearing a filter — new listings are added regularly."}
                  </p>
                  <Button type="button" className="mt-5" onClick={() => reset()}>
                    Clear all filters{activeCount > 0 ? ` (${activeCount})` : ""}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer (prototype style) */}
      {filtersOpen ? (
        <MobileFilterDrawer
          filters={filters}
          update={update}
          reset={reset}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}

      <MapView items={displayResults} />
      <HowItWorks />
      <Testimonials />
      <PartnerLogos />
      <FAQ />
      <LandlordBand />
    </>
  );
}