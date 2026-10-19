import { useEffect, useState, useRef } from "react";

/**
 * Hook for scroll-triggered animations using IntersectionObserver.
 * Respects prefers-reduced-motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isVisible] as const;
}

/**
 * Hook for parallax effect on scroll.
 * Returns a style object with transform based on scroll position.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Element is in viewport
      if (rect.bottom >= 0 && rect.top <= viewportHeight) {
        const scrolled = -rect.top;
        setOffset(scrolled * speed);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return [elementRef, { transform: `translateY(${offset}px)` }] as const;
}