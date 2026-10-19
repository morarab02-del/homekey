import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import type { Property } from "@/types/property";

/** Breadcrumb trail: HomeKey → Homes for rent → {city}, TX. */
export function Nav({ property }: { property: Property }) {
  const { city, state } = property.address;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-600 dark:text-muted-500">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded font-medium text-muted-600 transition-colors hover:text-brand-700 dark:text-muted-500 dark:hover:text-brand-300"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            HomeKey
          </Link>
        </li>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-300 dark:text-muted-700" aria-hidden="true" />
        <li>
          <Link
            to="/#results"
            className="rounded font-medium text-muted-600 transition-colors hover:text-brand-700 dark:text-muted-500 dark:hover:text-brand-300"
          >
            Homes for rent
          </Link>
        </li>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-300 dark:text-muted-700" aria-hidden="true" />
        <li className="font-semibold text-ink-700 dark:text-muted-300" aria-current="page">
          {city}, {state}
        </li>
      </ol>
    </nav>
  );
}

export default Nav;
