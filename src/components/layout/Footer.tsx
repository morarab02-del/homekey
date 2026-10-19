import { Link } from "react-router-dom";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { site } from "@/config/site";
import { whatsappLink, generalEnquiryMessage, mailtoLink, telLink } from "@/lib/formatting";
import { properties } from "@/data/properties";
import { citiesIn } from "@/lib/filtering";

const GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "All rentals", to: "/" },
      { label: "Homes for rent", to: "/?rentType=monthly" },
      { label: "Nightly stays", to: "/?rentType=nightly" },
      { label: "Saved homes", to: "/saved" },
      { label: "How it works", to: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About HomeKey", to: "/about" },
      { label: `Meet ${site.landlord.name}`, to: "/about" },
      { label: "Contact us", to: "/contact" },
      { label: "Testimonials", to: "/#testimonials" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of use", to: "/terms" },
      { label: "Privacy policy", to: "/privacy" },
      { label: "Fair housing", to: "/terms" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const cities = citiesIn(properties);

  return (
    <footer className="mt-8 bg-brand-900 text-white">
      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <Logo variant="dark" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200">
              {site.tagline}. Every listing is inspected, photographed, and ownership-verified.
              All properties are managed by a single landlord — {site.landlord.name}.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappLink(generalEnquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-md w-fit"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat on WhatsApp
              </a>
              <a href={telLink()} className="group flex items-center gap-3 text-sm text-brand-100 hover:text-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                {site.whatsappDisplay}
              </a>
              <a
                href={mailtoLink("HomeKey enquiry", generalEnquiryMessage())}
                className="group flex items-center gap-3 text-sm text-brand-100 hover:text-white"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                {site.email}
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link
                        to={link.to}
                        className="text-sm text-brand-100 transition-colors hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300">
                Service areas
              </h3>
              <ul className="mt-4 space-y-2.5">
                {cities.map((city) => (
                  <li key={city}>
                    <Link
                      to={`/?city=${encodeURIComponent(city)}`}
                      className="text-sm text-brand-100 transition-colors hover:text-white hover:underline"
                    >
                      Rentals in {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Fair housing notice */}
        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-xl2 border border-white/10 bg-white/5 p-4">
          <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-white" aria-label="Equal Housing Opportunity">
            <path
              fill="currentColor"
              d="M12 2L2 9v13h7v-6h6v6h7V9L12 2zm0 2.6l7 5.3V20h-2v-6H9v6H7V9.9l5-3.3z"
            />
            <path fill="currentColor" d="M10 9h4v5h-4z" />
          </svg>
          <p className="max-w-3xl text-xs leading-relaxed text-brand-200">
            <strong className="text-white">Equal Housing Opportunity.</strong> {site.brand} does not
            discriminate on the basis of race, colour, religion, sex, handicap, familial status or
            national origin, in accordance with the federal Fair Housing Act and Texas fair-housing
            law. All listings are offered to qualified applicants without regard to any protected
            class.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.legal.company}. {site.legal.address}. {site.landlord.license}.
          </p>
          <p>
            Not affiliated with any MLS
          </p>
        </div>
      </div>
    </footer>
  );
}
