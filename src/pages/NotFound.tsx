import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { site } from "@/config/site";
import { generalEnquiryMessage, whatsappLink } from "@/lib/formatting";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found | HomeKey";
  }, []);

  const waHref = whatsappLink(generalEnquiryMessage());

  return (
    <div className="section">
      <div className="shell">
        <div className="mx-auto max-w-lg py-6 text-center sm:py-12">
          {/* Decorative house + magnifier */}
          <svg viewBox="0 0 200 160" className="mx-auto h-40 w-64" aria-hidden="true">
            <ellipse cx="100" cy="150" rx="70" ry="8" className="fill-muted-100 dark:fill-white/5" />
            <path
              d="M55 82 L100 48 L145 82 V140 H55 Z"
              className="fill-brand-50 stroke-brand-100 dark:fill-brand-900/40 dark:stroke-brand-700/40"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M44 84 L100 40 L156 84"
              className="stroke-brand-700 dark:stroke-brand-400"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="90" y="108" width="20" height="32" rx="3" className="fill-brand-600 dark:fill-brand-500" />
            <circle cx="146" cy="118" r="20" className="fill-white dark:fill-[#0B1220]" />
            <g className="stroke-brand-700 dark:stroke-brand-300" strokeWidth="4" fill="none">
              <circle cx="146" cy="118" r="20" />
              <line x1="160" y1="132" x2="176" y2="148" strokeLinecap="round" />
            </g>
          </svg>

          <p className="mt-6 text-5xl font-bold tracking-tight text-brand-700 sm:text-6xl dark:text-brand-300">
            404
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl dark:text-white">
            We couldn&apos;t find that page
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-600 sm:text-base dark:text-muted-500">
            The page you were looking for may have moved, been removed, or never existed. Let&apos;s get you
            back to browsing {site.brand} homes.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn btn-primary btn-md">
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
            <LinkButton href={waHref} variant="wa" external>
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
