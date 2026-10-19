import { clsx } from "clsx";
import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";

/** Range slider styled for the light/dark palette. */
export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  className,
  ariaLabel,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  ariaLabel?: string;
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      className={clsx(
        "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted-200 dark:bg-white/15",
        "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none",
        "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600",
        "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform",
        "[&::-webkit-slider-thumb]:hover:scale-110",
        "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full",
        "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-600",
        className,
      )}
      style={{
        background: `linear-gradient(to right, #1D6FD1 0%, #3B82F6 ${pct}%, var(--track, #E2E8F0) ${pct}%)`,
      }}
    />
  );
}

export function SliderWithLabel({
  label,
  value,
  display,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="field-label mb-0">{label}</span>
        <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">{display}</span>
      </div>
      <Slider min={min} max={max} value={value} onChange={onChange} ariaLabel={label} />
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
}) {
  const lastActiveElement = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousOverflowRef = useRef<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const prefersReducedMotion = useRef(false);

  // Check reduced motion preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Unified close function
  const closeModal = useCallback(() => {
    if (!isMounted) return;
    
    // Clear any existing close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setIsClosing(true);

    const exitDelay = prefersReducedMotion.current ? 0 : 250;
    
    closeTimerRef.current = setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
      onClose();
    }, exitDelay);
  }, [isMounted, onClose]);

  // Mount when open becomes true
  useEffect(() => {
    if (open) {
      // Clear any pending close timer from a previous close
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsMounted(true);
      setIsClosing(false);
    }
  }, [open]);

  // Handle closing animation - only runs when open becomes false while mounted
  useEffect(() => {
    if (!open && isMounted) {
      closeModal();
    }
  }, [open, isMounted, closeModal]);

  // Focus management, scroll lock, keyboard handling
  useEffect(() => {
    if (!isMounted) return;

    lastActiveElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const closeButton = document.querySelector<HTMLElement>("[data-modal-close]");
    closeButton?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflowRef.current;
      document.removeEventListener("keydown", handleKeyDown);
      lastActiveElement.current?.focus();
    };
  }, [isMounted, closeModal]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!isMounted) return null;

  const backdropClass = isClosing ? "modal-backdrop-exit" : "modal-backdrop-enter";
  const dialogClass = isClosing ? "modal-dialog-exit" : "modal-dialog-enter";

  return (
    <div
      className={clsx("fixed inset-0 z-[100] flex items-center justify-center p-4", backdropClass)}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={isClosing ? undefined : closeModal}
    >
      <div
        ref={dialogRef}
        className={clsx("relative max-h-[92vh] w-full max-w-5xl", dialogClass)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          data-modal-close
          onClick={closeModal}
          aria-label="Close dialog"
          className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
