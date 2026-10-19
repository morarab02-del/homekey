import { clsx } from "clsx";
import type { ReactNode } from "react";

type Tone = "brand" | "ok" | "soon" | "muted" | "plain";

const toneClass: Record<Tone, string> = {
  brand: "pill-brand",
  ok: "pill-ok",
  soon: "pill-soon",
  muted: "pill-muted",
  plain: "",
};

export function Badge({
  tone = "brand",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return <span className={clsx("pill", toneClass[tone], className)}>{children}</span>;
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge tone="brand" className={className}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M12 1.8l2.5 2.1 3.2-.4 1 3 3 1-.4 3.2 2.1 2.5-2.1 2.5.4 3.2-3 1-1 3-3.2-.4L12 24.2 9.5 22.1l-3.2.4-1-3-3-1 .4-3.2L.6 13l2.1-2.5L2.3 7.3l3-1 1-3 3.2.4L12 1.8z" />
        <path
          d="M10.6 15.4l-3-3 1.4-1.4 1.6 1.6 4.2-4.2 1.4 1.4-5.6 5.6z"
          fill="#fff"
        />
      </svg>
      Verified
    </Badge>
  );
}
