import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui";
import { site } from "@/config/site";
import { properties } from "@/data/properties";
import { marketStats } from "@/lib/filtering";
import { generalEnquiryMessage, mailtoLink, telLink, whatsappLink } from "@/lib/formatting";

const VALUES: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Verified listings",
    body: "Every home is inspected in person and rented directly by one licensed landlord — never a faceless middleman.",
    Icon: ShieldCheck,
  },
  {
    title: "Real photos",
    body: "Each listing is photographed on site, so what you see online is exactly what you tour.",
    Icon: Camera,
  },
  {
    title: "No hidden fees",
    body: "Rent, deposits and application fees are stated up front. The total you see is the total you pay.",
    Icon: Wallet,
  },
  {
    title: "Fast replies",
    body: `${site.landlord.name} answers personally — ${site.landlord.responseTime.toLowerCase()}.`,
    Icon: Zap,
  },
];

const STEPS: { title: string; body: string }[] = [
  {
    title: "In-person inspection",
    body: "George walks every property before it goes live — condition, safety and finish.",
  },
  {
    title: "Real photography",
    body: "Photographers shoot each home on site so the gallery reflects the real space.",
  },
  {
    title: "Pricing & fee check",
    body: "Rent, deposit, application and pet fees are confirmed against the lease before listing.",
  },
  {
    title: "Licensed & verified",
    body: "Every listing carries George's Texas real estate licence and a verified badge.",
  },
];

export default function About() {
  useEffect(() => {
    document.title = "About HomeKey | HomeKey";
  }, []);

  const waHref = whatsappLink(generalEnquiryMessage());
  const mailHref = mailtoLink("HomeKey enquiry", generalEnquiryMessage());
  const telHref = telLink();

  const stats = marketStats(properties);
  const heroStats = [
    { value: String(stats.homes), label: "Verified listings" },
    { value: String(stats.cities), label: "Texas cities" },
    { value: "1", label: "Accountable landlord" },
  ];

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="section pb-0">
        <div className="shell">
          <div className="relative isolate overflow-hidden rounded-xl3 bg-gradient-to-br from-brand-50 via-white to-brand-100 px-6 py-12 sm:px-10 sm:py-16 dark:from-brand-900/40 dark:via-[#0B1220] dark:to-brand-800/30">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
            </div>
            <div className="relative max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">
                About HomeKey
              </span>
              <h1 className="mt-3 h-section text-ink-900 dark:text-white">
                Renting a Texas home, without the guesswork
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg dark:text-muted-500">
                One accountable landlord, verified homes and honest pricing — across five Texas cities.
              </p>
            </div>

            <div className="relative mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="surface-flat px-5 py-4 text-center">
                  <p className="text-3xl font-bold text-brand-700 dark:text-brand-300">{stat.value}</p>
                  <p className="mt-1 text-sm text-ink-600 dark:text-muted-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <SectionHeading title="Our story" subtitle="Why HomeKey exists and the promise behind every listing." />
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div className="space-y-4 text-sm leading-relaxed text-ink-700 sm:text-base dark:text-muted-500">
              <p>
                HomeKey is run by <strong className="font-semibold text-ink-900 dark:text-white">{site.landlord.name}</strong>,
                a licensed Texas real estate agent who owns and manages every home on this site. After years of
                watching renters chase stale listings, surprise fees and agents who vanished mid-conversation,
                George set out to build the rental experience he wanted for his own family.
              </p>
              <p>
                That means a single, accountable point of contact from your first message to the day you get your
                keys. No call centres, no third-party hand-offs and no pressure tactics — just clear answers,
                real photos and homes that are exactly as described.
              </p>
              <p>
                It is also a demonstration project: the listings here are sample data, not affiliated with any MLS.
                The platform shows what a transparent, single-landlord rental marketplace can look like.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((value) => (
                <div key={value.title} className="surface p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-200">
                    <value.Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-white">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-muted-500">{value.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service areas ──────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <SectionHeading title="Where we rent" subtitle="Homes across five major Texas metros." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.serviceAreas.map((city) => {
              const count = properties.filter((p) => p.address.city === city).length;
              return (
                <Link
                  key={city}
                  to={`/?city=${encodeURIComponent(city)}`}
                  className="surface-flat group flex items-center justify-between gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-200">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-base font-bold text-ink-900 dark:text-white">{city}</span>
                      <span className="block text-sm text-ink-600 dark:text-muted-500">
                        {count} {count === 1 ? "listing" : "listings"}
                      </span>
                    </span>
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-muted-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-700 dark:text-muted-300 dark:group-hover:text-brand-200"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Verification process ───────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <div className="surface-flat p-6 sm:p-10">
            <h2 className="h-section text-ink-900 dark:text-white">How we verify every home</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base dark:text-muted-500">
              Four checks before any home goes live — so you can rent with confidence.
            </p>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white dark:bg-brand-600">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-ink-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-muted-500">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── CTA band ───────────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <div className="relative isolate overflow-hidden rounded-xl3 bg-brand-900 px-6 py-10 sm:px-10 sm:py-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
            </div>
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Ready to find your next home?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-100 sm:text-base dark:text-brand-100">
                  Message {site.landlord.name} directly. {site.landlord.responseTime}.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto">
                <LinkButton href={waHref} variant="wa" external>
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp {site.whatsappDisplay}
                </LinkButton>
                <LinkButton
                  href={telHref}
                  variant="secondary"
                  className="!border-white/25 !bg-white/10 !text-white hover:!bg-white/20 dark:!border-white/20 dark:!bg-white/10 dark:!text-white dark:hover:!bg-white/20"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {site.phone}
                </LinkButton>
                <LinkButton
                  href={mailHref}
                  variant="secondary"
                  className="!border-white/25 !bg-white/10 !text-white hover:!bg-white/20 dark:!border-white/20 dark:!bg-white/10 dark:!text-white dark:hover:!bg-white/20"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {site.email}
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
