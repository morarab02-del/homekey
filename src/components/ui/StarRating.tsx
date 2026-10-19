import { clsx } from "clsx";
import { Star } from "lucide-react";
import { site } from "@/config/site";

/** Star rating with the numeric value and review count. */
export function StarRating({
  rating,
  reviews,
  className,
  size = 14,
}: {
  rating: number;
  reviews?: number;
  className?: string;
  size?: number;
}) {
  const rounded = Math.round(rating * 2) / 2;
  const label = `Rated ${rating} out of 5${reviews ? ` from ${reviews} reviews` : ""}`;

  return (
    <span className={clsx("inline-flex items-center gap-1", className)}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={clsx(
              i <= rounded
                ? "fill-amber-400 text-amber-400"
                : rounded === i - 0.5
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-muted-200 text-muted-200 dark:fill-white/15 dark:text-white/15",
            )}
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-ink-600 dark:text-muted-500">
        {rating.toFixed(1)}
        {reviews ? <span className="font-normal"> ({reviews})</span> : null}
      </span>
      <span className="sr-only" aria-label={label}>
        {label}
      </span>
      <span className="sr-only">{site.brand} listing rating</span>
    </span>
  );
}
