import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { countActiveFilters } from "@/lib/filtering";
import type { FilterState } from "@/lib/filtering";

export function SearchBar({
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
  const [draft, setDraft] = useState(filters.q);
  const [timer, setTimer] = useState<number | null | undefined>(null);
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    setDraft(filters.q);
  }, [filters.q]);

  useEffect(
    () => () => {
      if (timer !== null) window.clearTimeout(timer);
    },
    [timer],
  );

  const onQueryChange = (value: string) => {
    setDraft(value);
    if (timer !== null) window.clearTimeout(timer);
    setTimer(
      window.setTimeout(() => {
        update({ q: value });
        setTimer(null);
      }, 200),
    );
  };

  const scrollToResults = () => {
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          scrollToResults();
        }}
        aria-label="Search homes"
        className="bg-white/10 border border-white/20 rounded-2xl p-3 shadow-xl flex flex-col md:flex-row items-stretch gap-3 backdrop-blur-sm"
      >
        <label htmlFor="searchInput" className="sr-only">
          Search homes
        </label>
        <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-white/20">
          <Search
            className="w-5 h-5 text-white/60"
            aria-hidden="true"
          />
          <Input
            id="searchInput"
            type="search"
            value={draft}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search location or property term"
            aria-label="Search location or property term"
            className="w-full bg-transparent text-sm placeholder-white/40 text-white"
          />
        </div>

        <div className="flex items-center gap-2 px-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-expanded={isFiltersOpen === true}
            aria-controls="mobile-filters"
            onClick={onOpenFilters}
            disabled={!onOpenFilters}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-brass-accent" aria-hidden="true" />
            Filters
            {activeCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-brass-accent text-white text-[10px] font-bold">
                {activeCount}
              </span>
            ) : null}
          </Button>

          <Button type="submit" size="md" className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-ink-primary text-surface-main text-sm font-medium hover:bg-ink-900 transition-colors">
            <Search className="w-4 h-4" aria-hidden="true" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}