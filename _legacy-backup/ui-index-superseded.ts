import { clsx } from "clsx";
import { useEffect, useRef, type ReactNode } from "react";

export { Input } from "./Input";
export { Select } from "./Select";
export { Slider } from "./Slider";
export { Modal } from "./Modal";
export { SmartImage } from "./SmartImage";

/** Small layout helper used by the secondary pages. */
export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl dark:text-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-ink-600 sm:text-base dark:text-muted-500">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Reusable disclosure/accordion row. */
export function Accordion({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <details ref={ref} open={defaultOpen} className="group surface-flat overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink-900 marker:content-none dark:text-white">
        {question}
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition-transform duration-200 group-open:rotate-45 dark:bg-brand-700/25 dark:text-brand-200">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <p className="border-t border-muted-200 px-5 py-4 text-sm leading-relaxed text-ink-600 dark:border-white/10 dark:text-muted-500">
        {answer}
      </p>
    </details>
  );
}

/** Image with shimmer skeleton until loaded and a local SVG fallback on error. */
export function useImageLoaded(src: string) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) img.dataset.loaded = "true";
  }, [src]);
  return ref;
}
