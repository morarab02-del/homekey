import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/ui/Badge";
import { site } from "@/config/site";
import {
  formatBaths,
  formatBeds,
  fullAddress,
  mailtoLink,
  propertyEnquiryMessage,
  telLink,
  whatsappLink,
} from "@/lib/formatting";
import { priceLabel } from "@/lib/filtering";
import type { Property } from "@/types/property";

/** Sticky landlord card — the single owner behind every HomeKey listing. */
export function LandlordCard({ property }: { property: Property }) {
  const enquiry = propertyEnquiryMessage({
    title: property.title,
    address: fullAddress(property.address),
    priceLabel: priceLabel(property),
    beds: formatBeds(property.bedrooms),
    baths: formatBaths(property.bathrooms),
  });

  const initials = site.landlord.name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("");

  return (
    <section
      className="surface p-5 sm:p-6"
      aria-labelledby="landlord-heading"
    >
      <h2 id="landlord-heading" className="text-lg font-bold text-ink-900 dark:text-white">
        Listed by
      </h2>

      <div className="mt-4 flex items-center gap-3.5">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-700 text-base font-bold text-white dark:bg-brand-600"
          aria-hidden="true"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-bold text-ink-900 dark:text-white">
              {site.landlord.name}
            </p>
            <VerifiedBadge />
          </div>
          <p className="mt-0.5 text-xs text-muted-600 dark:text-muted-500">
            {site.landlord.license}
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-muted-300">
        <Clock className="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
        {site.landlord.responseTime}
      </p>

      <div className="mt-5 space-y-2.5">
        <LinkButton
          href={whatsappLink(enquiry)}
          external
          variant="wa"
          size="lg"
          block
          aria-label={`Chat with ${site.landlord.name} about ${property.title} on WhatsApp`}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Chat on WhatsApp
        </LinkButton>

        <div className="grid grid-cols-2 gap-2.5">
          <LinkButton href={mailtoLink(`Enquiry — ${property.title}`, enquiry)} variant="secondary">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </LinkButton>
          <LinkButton href={telLink()} variant="secondary">
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call
          </LinkButton>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-600 dark:text-muted-500">
        Every HomeKey home is rented directly by {site.landlord.name} — no agency chain, one
        accountable contact from viewing to keys.
      </p>
    </section>
  );
}

export default LandlordCard;
