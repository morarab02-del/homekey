import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface GlassTileProps {
  to: string;
  bg: string;
  label: string;
  count?: number;
  description?: string;
  className?: string;
}

export function GlassTile({ to, bg, label, count, description, className }: GlassTileProps) {
  return (
    <Link
      to={to}
      className={clsx(
        "glass group relative block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glass",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06]"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-cream-900/35 backdrop-blur-[2px] dark:bg-ink-900/55" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-bold leading-tight text-cream-50 drop-shadow-sm">
            {label}
          </h3>
          {count != null ? (
            <span className="shrink-0 rounded-full bg-brass-400/90 px-2.5 py-1 text-[11px] font-bold text-brass-900">
              {count}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-cream-50/90">
          Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </div>
        {description ? (
          <p className="text-xs text-cream-50/70">{description}</p>
        ) : null}
      </div>
    </Link>
  );
}

export default GlassTile;