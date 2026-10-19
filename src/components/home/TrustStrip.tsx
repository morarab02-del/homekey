import { ShieldCheck, KeyRound, Receipt, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Inspected and photographed",
    body: "Every home is visited in person before it's listed. Photos reflect the actual condition of the property.",
    Icon: ShieldCheck,
  },
  {
    title: "Verified ownership",
    body: "Property ownership is confirmed through official records. You're dealing with the actual owner, not a middleman.",
    Icon: KeyRound,
  },
  {
    title: "Transparent fees",
    body: "Security deposits, application fees, pet fees, and cleaning charges are shown up front on every listing.",
    Icon: Receipt,
  },
  {
    title: "Direct communication",
    body: "Message the owner, George Mark, on WhatsApp. Replies within 30 minutes during business hours.",
    Icon: Zap,
  },
];

export function TrustStrip() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1, rootMargin: "0px 0px -100px 0px" });

  return (
    <section ref={ref} className={`section border-b border-sand-border bg-surface-subtle transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="shell py-10 sm:py-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {BENEFITS.map(({ title, body, Icon }, index) => (
            <li
              key={title}
              className={`surface flex h-full flex-col gap-3 p-5 transition-all duration-500 hover:shadow-lift hover:-translate-y-1 animate-enter stagger-${index + 1} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl bg-brass-light text-brass-accent transition-transform duration-500 hover:scale-110 animate-enter stagger-${index + 1} delay-${(index + 1) * 100} ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-bold text-ink-primary">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}