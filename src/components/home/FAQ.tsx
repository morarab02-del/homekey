import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { faqs } from "@/data/faqs";
import { generalEnquiryMessage, whatsappLink } from "@/lib/formatting";
import { LinkButton } from "@/components/ui/Button";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function FAQ() {
  const waHref = whatsappLink(generalEnquiryMessage());
  const [ref, isVisible] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className={`border-t border-sand-border bg-surface-subtle transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="shell section">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className={`inline-block text-xs font-semibold uppercase tracking-[0.16em] text-brass-accent transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Good to know
            </span>
            <h2 className={`mt-3 h-section font-serif font-bold text-ink-primary transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Frequently asked questions
            </h2>
            <p className={`mt-3 text-sm leading-relaxed text-ink-muted sm:text-base transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Everything about deposits, pets, utilities and viewings. Still unsure? Ask George Mark
              directly.
            </p>
            <LinkButton href={waHref} variant="wa" external className="mt-5">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Ask on WhatsApp
            </LinkButton>
          </div>

          <ul className={`space-y-3 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {faqs.map((faq, index) => (
              <li key={faq.question} className="surface overflow-hidden transition-all duration-300">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 p-5 text-left focus-ring"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="text-sm font-semibold text-ink-primary pr-8">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-ink-muted shrink-0 transition-transform duration-200" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-ink-muted shrink-0 transition-transform duration-200" aria-hidden="true" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed text-ink-muted">
                    {faq.answer}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}