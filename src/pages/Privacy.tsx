import { useEffect } from "react";
import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { mailtoLink } from "@/lib/formatting";

const LAST_UPDATED = "October 9, 2026";

const para = "mt-4 leading-relaxed text-ink-700 dark:text-muted-500";
const h3 = "mt-6 text-lg font-bold text-ink-900 dark:text-white";

const TOC = [
  { id: "collect", label: "What we collect" },
  { id: "use", label: "How we use it" },
  { id: "basis", label: "Legal basis" },
  { id: "sharing", label: "Sharing" },
  { id: "retention", label: "Retention" },
  { id: "storage", label: "Cookies and local storage" },
  { id: "rights", label: "Your rights" },
  { id: "security", label: "Data security" },
  { id: "children", label: "Children's privacy" },
  { id: "transfers", label: "International transfers" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact" },
];

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy policy | HomeKey";
  }, []);

  const mailHref = mailtoLink(
    "Privacy request",
    `Hello ${site.brand}, I would like to make a request about my personal data.`,
  );

  return (
    <div className="section">
      <div className="shell">
        <article className="mx-auto max-w-3xl">
          <header>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">
              Legal
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
              Privacy policy
            </h1>
            <p className="mt-2 text-sm text-muted-500 dark:text-muted-300">Last updated: {LAST_UPDATED}</p>
            <p className="mt-4 leading-relaxed text-ink-600 dark:text-muted-500">
              This policy explains what {site.brand} collects, why, and the choices you have. We keep data
              collection minimal and we never sell your personal information.
            </p>
          </header>

          <nav aria-label="Table of contents" className="surface-flat mt-8 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-600 dark:text-muted-500">
              On this page
            </h2>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {TOC.map((item, index) => (
                <li key={item.id} className="text-sm">
                  <a href={`#${item.id}`} className="text-brand-700 hover:underline dark:text-brand-300">
                    <span className="text-muted-500 dark:text-muted-300">{index + 1}. </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 1 ── What we collect */}
          <section id="collect" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">1. </span>What we collect
            </h2>
            <p className={para}>
              We only collect the information you choose to give us. Through the enquiry and tour-request
              forms we may collect your <strong>name, email address, phone number, preferred dates and your
              message</strong>. We do not ask for government ID, payment details or anything else to browse
              the site.
            </p>
            <p className={para}>
              When you save a home, switch the theme or adjust filters, that preference is stored locally in
              your browser (see <a href="#storage" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">Cookies and local storage</a>).
            </p>
          </section>

          {/* 2 ── How we use it */}
          <section id="use" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">2. </span>How we use it
            </h2>
            <p className={para}>
              We use the details you provide to answer your enquiry, arrange a viewing or nightly booking, and
              follow up on the specific home you asked about. Saved homes, theme and filter settings are used
              only to remember your preferences on your device.
            </p>
          </section>

          {/* 3 ── Legal basis */}
          <section id="basis" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">3. </span>Legal basis
            </h2>
            <p className={para}>
              Where data-protection law applies, we rely on your consent when you submit a form, on performing
              a contract (responding to and setting up a viewing or booking), and on our legitimate interests
              in running and securing the website. You can withdraw consent at any time by contacting us.
            </p>
          </section>

          {/* 4 ── Sharing */}
          <section id="sharing" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">4. </span>Sharing
            </h2>
            <p className={para}>
              <strong>We never sell your personal information.</strong> Your enquiry is shared only with{" "}
              {site.landlord.name}, the single landlord who manages the listing, and with the delivery tools
              needed to answer you — for example your email provider or WhatsApp. We do not share your data
              with advertisers or data brokers.
            </p>
          </section>

          {/* 5 ── Retention */}
          <section id="retention" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">5. </span>Retention
            </h2>
            <p className={para}>
              We keep enquiry details only as long as needed to respond and, where relevant, for a reasonable
              period afterwards in case of follow-up questions. Locally stored preferences stay on your device
              until you clear them.
            </p>
          </section>

          {/* 6 ── Cookies & local storage */}
          <section id="storage" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">6. </span>Cookies and local storage
            </h2>
            <p className={para}>
              We avoid tracking cookies and third-party analytics. The site relies on your browser&apos;s
              local storage for a few small keys so the experience remembers you:
            </p>
            <h3 className={h3}>Saved homes (favourites)</h3>
            <p className={para}>
              The key <code className="rounded bg-muted-100 px-1.5 py-0.5 text-[13px] dark:bg-white/10">homekey:favorites</code>{" "}
              stores the listings you have hearted so your saved homes appear on the Saved page.
            </p>
            <h3 className={h3}>Theme preference</h3>
            <p className={para}>
              The key <code className="rounded bg-muted-100 px-1.5 py-0.5 text-[13px] dark:bg-white/10">homekey:theme</code>{" "}
              stores whether you chose light or dark mode. If nothing is stored, the site follows your system
              setting.
            </p>
            <h3 className={h3}>Filter and search state</h3>
            <p className={para}>
              Your search filters are kept in the page&apos;s URL (for example <code className="rounded bg-muted-100 px-1.5 py-0.5 text-[13px] dark:bg-white/10">/?city=Dallas&amp;beds=3</code>)
              rather than in local storage. This makes results shareable as a link. Clearing your browser
              history or the keys above removes this data.
            </p>
          </section>

          {/* 7 ── Your rights */}
          <section id="rights" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">7. </span>Your rights
            </h2>
            <p className={para}>
              You can ask us to access, correct or delete the personal information we hold about you. Email us
              and we will action your request. Locally stored preferences can be cleared at any time through
              your browser.
            </p>
          </section>

          {/* 8 ── Security */}
          <section id="security" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">8. </span>Data security
            </h2>
            <p className={para}>
              We take reasonable measures to protect your information and keep the demo site free of backend
              databases. No method of transmission or storage is completely secure, so we cannot guarantee
              absolute security.
            </p>
          </section>

          {/* 9 ── Children */}
          <section id="children" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">9. </span>Children&apos;s privacy
            </h2>
            <p className={para}>
              {site.brand} is intended for adults renting property and is not directed to children. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          {/* 10 ── International transfers */}
          <section id="transfers" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">10. </span>International transfers
            </h2>
            <p className={para}>
              Our operations are based in the United States. Messages you send through email or WhatsApp may
              be processed by those providers on servers outside your country, so your data can be
              transferred internationally as part of answering you.
            </p>
          </section>

          {/* 11 ── Changes */}
          <section id="changes" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">11. </span>Changes to this policy
            </h2>
            <p className={para}>
              We may update this policy as the project evolves. The &ldquo;last updated&rdquo; date above shows
              when the current version took effect.
            </p>
          </section>

          {/* 12 ── Contact */}
          <section id="contact" className="scroll-mt-24 py-8">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">12. </span>Contact
            </h2>
            <p className={para}>
              For any privacy question or to exercise your rights, email{" "}
              <a href={mailHref} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                {site.email}
              </a>
              , or reach us through the{" "}
              <Link to="/contact" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                contact page
              </Link>
              . {site.legal.company}, {site.legal.address}. See also our{" "}
              <Link to="/terms" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                terms of use
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
