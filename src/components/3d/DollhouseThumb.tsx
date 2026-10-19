import { lazy, Suspense, useState } from "react";
import { clsx } from "clsx";

export interface DollhouseThumbProps {
  glb: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<DollhouseThumbProps["size"]>, string> = {
  sm: "h-24 w-24",
  md: "h-32 w-32",
  lg: "h-48 w-48",
};

const ThumbScene = lazy(async () => {
  const mod = await import("./ThumbScene");
  return { default: mod.ThumbScene };
});

export function DollhouseThumb({ glb, alt, className, size = "md" }: DollhouseThumbProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={clsx("canvas-stage relative overflow-hidden", SIZE[size], className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`3D preview of ${alt}`}
    >
      <Suspense
        fallback={<div className="absolute inset-0 animate-shimmer bg-brass-100 dark:bg-white/5" />}
      >
        <ThumbScene glb={glb} autorotate={hovered} />
      </Suspense>
      <span className="absolute left-2 top-2 z-10 rounded-full bg-cream-50/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brass-700 shadow-sm backdrop-blur-sm dark:bg-ink-900/70 dark:text-brass-200">
        3D
      </span>
    </div>
  );
}

export default DollhouseThumb;