import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/Button";
import { properties } from "@/data/properties";
import { useFavorites } from "@/context/FavoritesContext";

function EmptyState() {
  return (
    <div className="surface-flat flex flex-col items-center px-6 py-16 text-center sm:py-20">
      {/* House + heart illustration */}
      <svg viewBox="0 0 220 170" className="h-40 w-full max-w-xs" aria-hidden="true">
        <ellipse cx="110" cy="152" rx="86" ry="10" className="fill-muted-100 dark:fill-white/5" />
        <path
          d="M52 84 L110 40 L168 84 V148 H52 Z"
          className="fill-brand-50 stroke-brand-100 dark:fill-brand-900/40 dark:stroke-brand-700/40"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M40 86 L110 34 L180 86"
          className="stroke-brand-700 dark:stroke-brand-400"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <rect x="66" y="96" width="26" height="26" rx="3" className="fill-white stroke-brand-200 dark:fill-white/10 dark:stroke-brand-700/50" strokeWidth="2" />
        <rect x="128" y="96" width="26" height="26" rx="3" className="fill-white stroke-brand-200 dark:fill-white/10 dark:stroke-brand-700/50" strokeWidth="2" />
        <rect x="98" y="112" width="24" height="36" rx="3" className="fill-brand-600 dark:fill-brand-500" />
        <circle cx="164" cy="60" r="22" className="fill-white dark:fill-[#0B1220]" />
        <path
          transform="translate(152 48)"
          d="M12 20.7l-1.1-1C6.1 15.4 3 12.6 3 9.2 3 6.6 5 4.6 7.6 4.6c1.5 0 2.9.7 3.8 1.8l.6.8.6-.8c.9-1.1 2.3-1.8 3.8-1.8C19 4.6 21 6.6 21 9.2c0 3.4-3.1 6.2-7.9 10.5l-1.1 1z"
          className="fill-brand-700 dark:fill-brand-400"
        />
      </svg>

      <h2 className="mt-6 text-xl font-bold text-ink-900 dark:text-white">No saved homes yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600 dark:text-muted-500">
        Tap the heart on any listing to save it here. Your shortlist stays on this device so you can
        compare homes, prices and neighbourhoods side by side before you reach out.
      </p>
      <Link to="/" className="btn btn-primary btn-md mt-6">
        <Heart className="h-4 w-4" aria-hidden="true" />
        Browse homes
      </Link>
    </div>
  );
}

export default function Saved() {
  const { ids, clearFavorites } = useFavorites();

  useEffect(() => {
    document.title = "Saved homes | HomeKey";
  }, []);

  const saved = useMemo(() => properties.filter((p) => ids.includes(p.id)), [ids]);

  return (
    <div className="section">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">
            Your shortlist
          </span>
          <h1 className="mt-3 h-section text-ink-900 dark:text-white">Your saved homes</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base dark:text-muted-500">
            Everything you have hearted, ready when you are.
          </p>
        </div>

        {saved.length > 0 ? (
          <>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-muted-200 pb-4 dark:border-white/10">
              <p className="text-sm font-semibold text-ink-700 dark:text-muted-300">
                {saved.length} saved {saved.length === 1 ? "home" : "homes"}
              </p>
              <Button type="button" variant="ghost" size="sm" onClick={clearFavorites}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear all
              </Button>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((property, index) => (
                <PropertyCard key={property.id} property={property} priority={index < 3} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
}
