import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { site } from "@/config/site";

/**
 * HomeKey logo - the house-formed "H" with the key as the right stem,
 * exactly as in the supplied brand sheet: navy #0F172A + sky blue #0284C7.
 */
export function Logo({
  className,
  showText = true,
  variant = "light",
}: {
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark";
}) {
  const textColor = variant === "dark" ? "text-white" : "text-ink-900";

  return (
    <Link
      to="/"
      className={clsx("group inline-flex items-center gap-2.5", className)}
      aria-label={`${site.brand} — home`}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-9 w-9 shrink-0 transition-transform duration-200 group-hover:scale-105"
        role="img"
        aria-label={`${site.brand} logo`}
      >
        {/* roof */}
        <path
          d="M5 26 L32 5 L59 26"
          fill="none"
          stroke="#0F172A"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* H - left stem (navy) */}
        <rect x="11" y="24" width="9.5" height="35" fill="#0F172A" />
        {/* H - crossbar (navy) */}
        <rect x="11" y="37.5" width="41" height="7.5" fill="#0F172A" />
        {/* window in the left stem */}
        <rect x="14.2" y="27.5" width="3.2" height="3.2" fill="#0284C7" />
        {/* key - right stem doubles as the H's right stroke (sky blue) */}
        <rect x="43" y="24" width="8" height="35" fill="#0284C7" />
        {/* key - bow */}
        <circle
          cx="47"
          cy="15"
          r="8.5"
          fill="none"
          stroke="#0284C7"
          strokeWidth="5"
        />
        {/* key - teeth */}
        <rect x="43" y="44" width="9" height="4" fill="#0284C7" />
        <rect x="43" y="51" width="6.5" height="4" fill="#0284C7" />
      </svg>
      {showText ? (
        <span className={clsx("text-[22px] font-extrabold tracking-tight", textColor)}>
          HOME<span className="text-brand-600">KEY</span>
        </span>
      ) : null}
    </Link>
  );
}
