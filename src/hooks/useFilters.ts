import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Availability, PropertyType } from "@/types/property";
import {
  defaultFilters,
  filterProperties,
  findFallbackResults,
  type FilterState,
  type SortKey,
} from "@/lib/filtering";
import { properties } from "@/data/properties";

/** Keeps the whole filter state in the URL so results are shareable. */
export function useFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<FilterState>(() => {
    const num = (key: string): number | null => {
      const raw = params.get(key);
      if (raw === null || raw === "") return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    };
    const rentType = params.get("rentType");
    const availability = params.get("availability") as Availability | null;
    const type = params.get("type") as PropertyType | null;

    return {
      q: params.get("q") ?? "",
      rentType: rentType === "monthly" || rentType === "nightly" ? rentType : "all",
      minPrice: num("minPrice"),
      maxPrice: num("maxPrice"),
      beds: num("beds"),
      baths: num("baths"),
      type: type ?? null,
      city: params.get("city"),
      availability: availability ?? null,
      sort: (params.get("sort") as SortKey | null) ?? "featured",
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<FilterState>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const set = (key: string, value: unknown) => {
            if (value === "" || value === null || value === undefined || value === "all") next.delete(key);
            else next.set(key, String(value));
          };
          for (const [key, value] of Object.entries(patch)) {
            set(key, value as unknown);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const reset = useCallback(
    (keepSort = true) => {
      const sort = keepSort ? params.get("sort") : null;
      setParams(sort ? new URLSearchParams({ sort }) : new URLSearchParams(), { replace: true });
    },
    [params, setParams],
  );

  const results = useMemo(() => filterProperties(properties, filters), [filters]);

  const fallbackResults = useMemo(() => findFallbackResults(properties, filters, results), [filters, results]);

  const isShowingFallback = results.length === 0 && fallbackResults.length > 0;

  return { filters, update, reset, results, total: properties.length, fallbackResults, isShowingFallback };
}

export { defaultFilters };
