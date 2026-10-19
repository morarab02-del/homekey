import { BadgeCheck, Clock, IdCard, Mail, MessageCircle, Phone } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/ui/Badge";
import { site } from "@/config/site";
import { generalEnquiryMessage, mailtoLink, telLink, whatsappLink } from "@/lib/formatting";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const waHref = whatsappLink(generalEnquiryMessage());
const mailHref = mailtoLink("HomeKey enquiry", generalEnquiryMessage());
const telHref = telLink();

export function LandlordBand() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className={`section bg-surface-main transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-xl3 bg-surface-card border border-sand-border shadow-card transition-all duration-300 hover:shadow-lift">
          {/* Subtle accent line */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brass-accent to-brass-light" />

          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brass-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-accent ring-1 ring-inset ring-sand-border">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Your landlord
              </span>

              <div className="mt-5 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brass-light text-xl font-bold text-brass-accent ring-1 ring-inset ring-sand-border"
                >
                  GM
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight font-serif text-ink-primary sm:text-3xl">
                    {site.landlord.name}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Owner & licensed Texas real estate agent · Rents every HomeKey listing directly
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {site.landlord.verified ? <VerifiedBadge className="shadow-sm backdrop-blur-sm" /> : null}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brass-light px-2.5 py-1 text-xs font-semibold text-brass-accent ring-1 ring-inset ring-sand-border">
                  <IdCard className="h-3.5 w-3.5" aria-hidden="true" />
                  {site.landlord.license}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brass-light px-2.5 py-1 text-xs font-semibold text-brass-accent ring-1 ring-inset ring-sand-border">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Replies within 30 minutes during business hours
                </span>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
                One person owns the entire portfolio. You deal with the same landlord from your first message to the day you get your keys. Questions about a listing, a fee, or a viewing — ask directly.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 lg:w-72 lg:mt-0">
              <LinkButton
                href={waHref}
                external
                variant="wa"
                size="lg"
                block
                className="transition-all duration-200 hover:scale-[1.01]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat on WhatsApp
              </LinkButton>
              <LinkButton href={telHref} variant="secondary" block className="transition-all duration-200 hover:scale-[1.01]">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {site.whatsappDisplay}
              </LinkButton>
              <LinkButton href={mailHref} variant="secondary" block className="transition-all duration-200 hover:scale-[1.01]">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {site.email}
              </LinkButton>
              <Button
                type="button"
                variant="ghost"
                block
                onClick={() => {
                  document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="transition-all duration-200 hover:bg-surface-subtle"
              >
                Back to listings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}