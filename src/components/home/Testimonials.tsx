import { MapPin, Quote } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { testimonials } from "@/data/testimonials";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function Testimonials() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="testimonials" ref={ref} className={`border-y border-sand-border bg-surface-subtle transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="shell section">
        <div className="mx-auto max-w-2xl text-center">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.16em] text-brass-accent transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Renter reviews
          </span>
          <h2 className={`mt-3 h-section font-serif font-bold text-ink-primary transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            What renters say about HomeKey
          </h2>
          <p className={`mt-3 text-sm leading-relaxed text-ink-muted sm:text-base transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Genuine feedback from people who rented through HomeKey.
          </p>
        </div>

        <ul className={`mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {testimonials.map((t, index) => (
            <li key={t.name} className={`surface flex h-full flex-col p-5 sm:p-6 transition-all duration-300 hover:shadow-lift hover:-translate-y-1 stagger-${(index % 6) + 1} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <Quote
                className="h-7 w-7 shrink-0 text-brass-accent/30"
                aria-hidden="true"
              />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                "{t.quote}"
              </blockquote>

              <footer className="mt-5 flex items-center gap-3 border-t border-sand-border pt-4">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brass-light text-sm font-bold text-brass-accent"
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-primary">{t.name}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {t.role} · {t.city}
                  </p>
                </div>
              </footer>

              <div className="mt-3 flex items-center justify-between gap-3">
                <StarRating rating={t.rating} size={13} />
                <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-subtle">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.city}, TX
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}