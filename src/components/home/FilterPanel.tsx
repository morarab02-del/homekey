import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SliderWithLabel } from "@/components/ui/Slider";
import { citiesIn, countActiveFilters, priceOf } from "@/lib/filtering";
import { properties } from "@/data/properties";
import {
  AVAILABILITY_LABEL,
  PROPERTY_TYPE_LABEL,
  type Availability,
  type PropertyType,
} from "@/types/property";
import { formatMoney } from "@/lib/formatting";
import type { FilterState } from "@/lib/filtering";

const PRICE_MAX = Math.ceil(Math.max(0, ...properties.map(priceOf)) / 500) * 500;
const CITIES = citiesIn(properties);
const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_LABEL) as PropertyType[];
const AVAILABILITIES: Availability[] = ["available-now", "available-later", "leased"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
        active
          ? "border-brass-accent bg-brass-light text-ink-primary shadow-sm"
          : "border-sand-border bg-surface-card text-ink-muted hover:border-brass-accent hover:text-ink-primary dark:border-white/10 dark:bg-white/5 dark:text-muted-300 dark:hover:border-brass-accent/50 dark:hover:text-brand-200",
      )}
    >
      {children}
    </button>
  );
}

function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T | null; label: string }[];
  value: T | null;
  onChange: (value: T | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option.label}
          active={value === option.value}
          onClick={() => onChange(value === option.value ? null : option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3 border-t border-sand-border pt-5 first:border-0 first:pt-0">
      <h3 className="text-sm font-bold text-ink-primary">{title}</h3>
      {children}
    </div>
  );
}

function PriceRangeInputs({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: {
  minPrice: number | null;
  maxPrice: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="mobile-min-price" className="field-label mb-1.5 block">
          Min price
        </label>
        <input
          id="mobile-min-price"
          type="number"
          min={0}
          max={PRICE_MAX}
          step={50}
          value={minPrice ?? ""}
          onChange={(e) => onMinChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-lg border border-sand-border bg-surface-card px-3 py-2 text-sm text-ink-primary placeholder-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-accent dark:border-white/10 dark:bg-white/5"
          placeholder="Any"
        />
      </div>
      <div>
        <label htmlFor="mobile-max-price" className="field-label mb-1.5 block">
          Max price
        </label>
        <input
          id="mobile-max-price"
          type="number"
          min={0}
          max={PRICE_MAX}
          step={50}
          value={maxPrice ?? ""}
          onChange={(e) => onMaxChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-lg border border-sand-border bg-surface-card px-3 py-2 text-sm text-ink-primary placeholder-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-accent dark:border-white/10 dark:bg-white/5"
          placeholder="Any"
        />
      </div>
    </div>
  );
}

/** Mobile filter modal drawer matching prototype */
export function MobileFilterDrawer({
  filters,
  update,
  reset,
  onClose,
}: {
  filters: FilterState;
  update: (patch: Partial<FilterState>) => void;
  reset: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [stagedFilters, setStagedFilters] = useState<Partial<FilterState>>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["rentalType", "features"]));

  // Sync staged filters with current filters when they change
  useEffect(() => {
    setStagedFilters({});
  }, [filters]);

  // Focus management and keyboard accessibility
  useEffect(() => {
    // Store the element that opened the drawer
    previousActiveElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Lock background scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the close button initially
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Focus close button on mount
    closeButtonRef.current?.focus();

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the element that opened the drawer
      previousActiveElement.current?.focus();
    };
  }, [onClose]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleStagedChange = (patch: Partial<FilterState>) => {
    setStagedFilters((prev) => ({ ...prev, ...patch }));
  };

  const applyStagedFilters = () => {
    if (Object.keys(stagedFilters).length > 0) {
      update(stagedFilters);
    }
    onClose();
  };

  const handleReset = () => {
    setStagedFilters({});
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-[50] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filterTitle"
    >
      <button
        type="button"
        className="overlay-backdrop absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close filter panel"
      />
      <div
        ref={panelRef}
        className="dialog-panel absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface-card border-l border-sand-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
        tabIndex={-1}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand-border pb-4">
            <h2 id="filterTitle" className="font-serif text-xl font-bold">Filter properties</h2>
            <button
              ref={closeButtonRef}
              type="button"
              id="filterModalCloseBtn"
              aria-label="Close filters"
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
              onClick={onClose}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <section aria-labelledby="rental-type-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 id="rental-type-heading" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Rental type</h3>
              <button
                type="button"
                aria-expanded={openSections.has("rentalType")}
                onClick={() => toggleSection("rentalType")}
                className="p-1 text-ink-muted hover:text-ink-primary transition-colors"
              >
                {openSections.has("rentalType") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-200 overflow-hidden ${openSections.has("rentalType") ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="flex gap-2 pt-2">
                <label className="flex-1 text-center py-2 border border-sand-border rounded-lg text-xs cursor-pointer has-[:checked]:bg-brass-light has-[:checked]:border-brass-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-accent">
                  <input
                    type="radio"
                    name="rentalType"
                    value="all"
                    className="sr-only filter-control"
                    checked={stagedFilters.rentType === "all" || (!stagedFilters.rentType && filters.rentType === "all")}
                    onChange={() => handleStagedChange({ rentType: "all" })}
                  />
                  Any rental type
                </label>
                <label className="flex-1 text-center py-2 border border-sand-border rounded-lg text-xs cursor-pointer has-[:checked]:bg-brass-light has-[:checked]:border-brass-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-accent">
                  <input
                    type="radio"
                    name="rentalType"
                    value="monthly"
                    className="sr-only filter-control"
                    checked={stagedFilters.rentType === "monthly" || (!stagedFilters.rentType && filters.rentType === "monthly")}
                    onChange={() => handleStagedChange({ rentType: "monthly" })}
                  />
                  Long-term
                </label>
                <label className="flex-1 text-center py-2 border border-sand-border rounded-lg text-xs cursor-pointer has-[:checked]:bg-brass-light has-[:checked]:border-brass-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-accent">
                  <input
                    type="radio"
                    name="rentalType"
                    value="nightly"
                    className="sr-only filter-control"
                    checked={stagedFilters.rentType === "nightly" || (!stagedFilters.rentType && filters.rentType === "nightly")}
                    onChange={() => handleStagedChange({ rentType: "nightly" })}
                  />
                  Short stay
                </label>
              </div>
            </div>
          </section>

          <section aria-labelledby="price-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 id="price-heading" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Price range</h3>
              <button
                type="button"
                aria-expanded={openSections.has("price")}
                onClick={() => toggleSection("price")}
                className="p-1 text-ink-muted hover:text-ink-primary transition-colors"
              >
                {openSections.has("price") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-200 overflow-hidden ${openSections.has("price") ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pt-2">
                <PriceRangeInputs
                  minPrice={stagedFilters.minPrice ?? filters.minPrice}
                  maxPrice={stagedFilters.maxPrice ?? filters.maxPrice}
                  onMinChange={(value) => handleStagedChange({ minPrice: value })}
                  onMaxChange={(value) => handleStagedChange({ maxPrice: value })}
                />
                <p className="mt-2 text-xs text-ink-muted">Monthly or nightly pricing</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="bedrooms-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 id="bedrooms-heading" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Bedrooms</h3>
              <button
                type="button"
                aria-expanded={openSections.has("bedrooms")}
                onClick={() => toggleSection("bedrooms")}
                className="p-1 text-ink-muted hover:text-ink-primary transition-colors"
              >
                {openSections.has("bedrooms") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-200 overflow-hidden ${openSections.has("bedrooms") ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pt-2">
                <ChipGroup
                  value={stagedFilters.beds ?? filters.beds}
                  onChange={(beds) => handleStagedChange({ beds })}
                  options={[
                    { value: null, label: "Any" },
                    { value: 1, label: "1+" },
                    { value: 2, label: "2+" },
                    { value: 3, label: "3+" },
                    { value: 4, label: "4+" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="bathrooms-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 id="bathrooms-heading" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Bathrooms</h3>
              <button
                type="button"
                aria-expanded={openSections.has("bathrooms")}
                onClick={() => toggleSection("bathrooms")}
                className="p-1 text-ink-muted hover:text-ink-primary transition-colors"
              >
                {openSections.has("bathrooms") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-200 overflow-hidden ${openSections.has("bathrooms") ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pt-2">
                <ChipGroup
                  value={stagedFilters.baths ?? filters.baths}
                  onChange={(baths) => handleStagedChange({ baths })}
                  options={[
                    { value: null, label: "Any" },
                    { value: 1, label: "1+" },
                    { value: 2, label: "2+" },
                    { value: 3, label: "3+" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="property-type-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 id="property-type-heading" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Property type</h3>
              <button
                type="button"
                aria-expanded={openSections.has("propertyType")}
                onClick={() => toggleSection("propertyType")}
                className="p-1 text-ink-muted hover:text-ink-primary transition-colors"
              >
                {openSections.has("propertyType") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-200 overflow-hidden ${openSections.has("propertyType") ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pt-2">
                <ChipGroup
                  value={stagedFilters.type ?? filters.type}
                  onChange={(type) => handleStagedChange({ type })}
                  options={[
                    { value: null, label: "Any" },
                    ...PROPERTY_TYPES.map((type) => ({ value: type, label: PROPERTY_TYPE_LABEL[type] })),
                  ]}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="city-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 id="city-heading" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">City</h3>
              <button
                type="button"
                aria-expanded={openSections.has("city")}
                onClick={() => toggleSection("city")}
                className="p-1 text-ink-muted hover:text-ink-primary transition-colors"
              >
                {openSections.has("city") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-200 overflow-hidden ${openSections.has("city") ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pt-2">
                <ChipGroup
                  value={stagedFilters.city ?? filters.city}
                  onChange={(city) => handleStagedChange({ city })}
                  options={[
                    { value: null, label: "All cities" },
                    ...CITIES.map((city) => ({ value: city, label: city })),
                  ]}
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="availability-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 id="availability-heading" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Availability</h3>
              <button
                type="button"
                aria-expanded={openSections.has("availability")}
                onClick={() => toggleSection("availability")}
                className="p-1 text-ink-muted hover:text-ink-primary transition-colors"
              >
                {openSections.has("availability") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-200 overflow-hidden ${openSections.has("availability") ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pt-2">
                <ChipGroup
                  value={stagedFilters.availability ?? filters.availability}
                  onChange={(availability) => handleStagedChange({ availability })}
                  options={[
                    { value: null, label: "Any" },
                    ...AVAILABILITIES.map((status) => ({
                      value: status,
                      label: AVAILABILITY_LABEL[status],
                    })),
                  ]}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="pt-6 border-t border-sand-border flex gap-3">
          <Button
            type="button"
            id="resetFiltersBtn"
            className="flex-1 py-2.5 rounded-lg border border-sand-border text-sm"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="button"
            id="applyFiltersBtn"
            className="flex-1 py-2.5 rounded-lg bg-ink-primary text-surface-main text-sm"
            onClick={applyStagedFilters}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FilterPanel({
  filters,
  update,
  reset,
}: {
  filters: FilterState;
  update: (patch: Partial<FilterState>) => void;
  reset: () => void;
}) {
  const activeCount = countActiveFilters(filters);
  const priceValue = filters.maxPrice ?? PRICE_MAX;

  return (
    <div className="surface p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-ink-primary">Filters</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={activeCount === 0}
          onClick={() => reset()}
          className="!px-2 text-xs"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Clear all{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </div>

      <div className="space-y-5">
        <Group title="Max price">
          <SliderWithLabel
            label="Monthly or nightly"
            min={0}
            max={PRICE_MAX}
            value={priceValue}
            display={priceValue >= PRICE_MAX ? `${formatMoney(priceValue)}+` : formatMoney(priceValue)}
            onChange={(value) => update({ maxPrice: value >= PRICE_MAX ? null : value })}
          />
        </Group>

        <Group title="Bedrooms">
          <ChipGroup
            value={filters.beds}
            onChange={(beds) => update({ beds })}
            options={[
              { value: null, label: "Any" },
              { value: 1, label: "1+" },
              { value: 2, label: "2+" },
              { value: 3, label: "3+" },
              { value: 4, label: "4+" },
            ]}
          />
        </Group>

        <Group title="Bathrooms">
          <ChipGroup
            value={filters.baths}
            onChange={(baths) => update({ baths })}
            options={[
              { value: null, label: "Any" },
              { value: 1, label: "1+" },
              { value: 2, label: "2+" },
              { value: 3, label: "3+" },
            ]}
          />
        </Group>

        <Group title="Property type">
          <ChipGroup
            value={filters.type}
            onChange={(type) => update({ type })}
            options={[
              { value: null, label: "Any" },
              ...PROPERTY_TYPES.map((type) => ({ value: type, label: PROPERTY_TYPE_LABEL[type] })),
            ]}
          />
        </Group>

        <Group title="City">
          <ChipGroup
            value={filters.city}
            onChange={(city) => update({ city })}
            options={[
              { value: null, label: "All cities" },
              ...CITIES.map((city) => ({ value: city, label: city })),
            ]}
          />
        </Group>

        <Group title="Availability">
          <ChipGroup
            value={filters.availability}
            onChange={(availability) => update({ availability })}
            options={[
              { value: null, label: "Any" },
              ...AVAILABILITIES.map((status) => ({
                value: status,
                label: AVAILABILITY_LABEL[status],
              })),
            ]}
          />
        </Group>
      </div>
    </div>
  );
}