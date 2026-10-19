import { CalendarCheck, MessageCircle, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { site } from "@/config/site";
import { generalEnquiryMessage, whatsappLink } from "@/lib/formatting";
import { LinkButton } from "@/components/ui/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Search",
    body: "Filter by city, rent type, price, bedrooms, and availability across Texas.",
    Icon: Search,
  },
  {
    title: "View the property",
    body: "Review photos, floor plans, fees, utilities, and neighborhood details for each listing.",
    Icon: CalendarCheck,
  },
  {
    title: "Contact the owner",
    body: `Message ${site.landlord.name} directly on WhatsApp with your questions or to arrange a viewing.`,
    Icon: MessageCircle,
  },
];

export function HowItWorks() {
  const waHref = whatsappLink(generalEnquiryMessage());
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className={`section bg-surface-main transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.16em] text-brass-accent transition-transform duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            How it works
          </span>
          <h2 className={`mt-3 h-section font-serif font-bold text-ink-primary transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Rent a HomeKey property in three steps
          </h2>
          <p className={`mt-3 text-sm leading-relaxed text-ink-muted sm:text-base transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            No account required to browse or inquire.
          </p>
        </div>

        <ol className={`relative mt-10 grid gap-6 sm:mt-12 lg:grid-cols-3 lg:gap-8 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Connector line between steps on large screens */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-sand-border to-transparent lg:block"
          />
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex flex-col items-center text-center">
              <span className={`relative z-10 grid h-16 w-16 place-items-center rounded-full border border-sand-border bg-surface-card text-brass-accent shadow-card transition-all duration-300 hover:scale-110 hover:border-brass-accent stagger-${index + 1} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <step.Icon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brass-accent text-xs font-bold text-white">
                  {index + 1}
                </span>
              </span>
              <h3 className={`mt-5 text-base font-bold text-ink-primary transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {step.title}
              </h3>
              <p className={`mt-2 max-w-xs text-sm leading-relaxed text-ink-muted transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className={`mt-10 flex justify-center transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <LinkButton href={waHref} variant="wa" external>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Message on WhatsApp
          </LinkButton>
        </div>
      </div>
    </section>
  );
}