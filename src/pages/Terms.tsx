import { useEffect } from "react";
import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { generalEnquiryMessage, mailtoLink, telLink, whatsappLink } from "@/lib/formatting";

const LAST_UPDATED = "October 9, 2026";

const para = "mt-4 leading-relaxed text-ink-700 dark:text-muted-500";
const h3 = "mt-6 text-lg font-bold text-ink-900 dark:text-white";

const TOC = [
  { id: "acceptance", label: "Acceptance of terms" },
  { id: "role", label: "Our role" },
  { id: "accuracy", label: "Listing accuracy & demo data" },
  { id: "tenancy", label: "Applications and tenancy" },
  { id: "fees", label: "Deposits and fees" },
  { id: "nightly", label: "Nightly bookings and cancellation" },
  { id: "pets", label: "Pets" },
  { id: "conduct", label: "Prohibited conduct" },
  { id: "liability", label: "Limitation of liability" },
  { id: "fair-housing", label: "Fair housing" },
  { id: "changes", label: "Changes to these terms" },
  { id: "contact", label: "Contact" },
];

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of use | HomeKey";
  }, []);

  const mailHref = mailtoLink("HomeKey enquiry", generalEnquiryMessage());

  return (
    <div className="section">
      <div className="shell">
        <article className="mx-auto max-w-3xl">
          <header>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">
              Legal
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
              Terms of use
            </h1>
            <p className="mt-2 text-sm text-muted-500 dark:text-muted-300">Last updated: {LAST_UPDATED}</p>
            <p className="mt-4 leading-relaxed text-ink-600 dark:text-muted-500">
              These terms explain the rules for using the {site.brand} website. By browsing or sending an
              enquiry you agree to them. They apply to everyone — renters, applicants and guests.
            </p>
          </header>

          {/* Table of contents */}
          <nav aria-label="Table of contents" className="surface-flat mt-8 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-600 dark:text-muted-500">
              On this page
            </h2>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {TOC.map((item, index) => (
                <li key={item.id} className="text-sm">
                  <a
                    href={`#${item.id}`}
                    className="text-brand-700 hover:underline dark:text-brand-300"
                  >
                    <span className="text-muted-500 dark:text-muted-300">{index + 1}. </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 1 ── Acceptance */}
          <section id="acceptance" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">1. </span>Acceptance of terms
            </h2>
            <p className={para}>
              By accessing or using {site.brand}, you confirm that you have read, understood and agree to
              these terms. If you do not agree, please do not use the website.
            </p>
          </section>

          {/* 2 ── Our role */}
          <section id="role" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">2. </span>Our role
            </h2>
            <p className={para}>
              {site.brand} is operated by {site.legal.company} ({site.legal.address}). {site.landlord.name}{" "}
              ({site.landlord.license}) owns and manages every listing directly as the landlord and property
              manager. We are a single-landlord platform — we are <strong>not</strong> a multiple listing
              service (MLS) or a general marketplace where third-party owners list, and the listings shown
              here are not syndicated from any MLS.
            </p>
            <p className={para}>
              Because one accountable party manages each home, your enquiries, applications, viewings and
              lease are all handled by the same person.
            </p>
          </section>

          {/* 3 ── Accuracy & demo data */}
          <section id="accuracy" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">3. </span>Listing accuracy &amp; demo data
            </h2>
            <p className={para}>
              This is a demonstration project. The properties, photos, prices and reviews shown are{" "}
              <strong>sample data</strong> provided to illustrate the platform and are not affiliated with any
              MLS, brokerage or real owner. Nothing here is an offer, and no listing should be relied upon for
              a real transaction.
            </p>
            <p className={para}>
              On a live deployment, availability, pricing and features can change at any time. Where a price,
              date or fee is material to your decision, confirm the current details with us before applying.
            </p>
          </section>

          {/* 4 ── Applications & tenancy */}
          <section id="tenancy" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">4. </span>Applications and tenancy
            </h2>
            <p className={para}>
              Monthly rentals are secured by a written residential lease and are subject to an application
              and screening review. We evaluate every applicant using the same objective criteria, such as
              income, rental history and references. Submitting an enquiry or application does not guarantee
              approval or reserve a home — a tenancy begins only when a lease is signed by both parties.
            </p>
            <h3 className={h3}>Tour requests</h3>
            <p className={para}>
              You can request an in-person or video viewing through a listing or by contacting us directly.
              Please keep to the confirmed appointment time; we may cancel or reschedule viewings at our
              reasonable discretion.
            </p>
          </section>

          {/* 5 ── Deposits & fees */}
          <section id="fees" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">5. </span>Deposits and fees
            </h2>
            <p className={para}>
              We keep fees transparent. There are no admin, auction or listing fees added by us.
            </p>
            <h3 className={h3}>Monthly rentals</h3>
            <p className={para}>
              A refundable security deposit (typically equal to one month&apos;s rent) plus a one-off
              application fee per adult are due before move-in. Any pet or parking fee is stated on the
              listing.
            </p>
            <h3 className={h3}>Nightly rentals</h3>
            <p className={para}>
              A refundable damage deposit may be collected, and a cleaning fee and service fee are included
              in the total shown before you confirm. All charges are displayed up front — no hidden fees.
            </p>
          </section>

          {/* 6 ── Nightly bookings */}
          <section id="nightly" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">6. </span>Nightly bookings and cancellation
            </h2>
            <p className={para}>
              Nightly listings have a minimum stay, shown on each listing. A confirmed booking is subject to
              our house rules on guests, parties, smoking and quiet hours. Cancellations made at least 48
              hours before check-in are refunded in full; later cancellations forfeit the first night. Damage
              deposits are returned within a reasonable period after check-out, less any documented charges.
            </p>
          </section>

          {/* 7 ── Pets */}
          <section id="pets" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">7. </span>Pets
            </h2>
            <p className={para}>
              Many of our homes are pet friendly for a one-off pet fee and an approved pet profile; the pet
              policy for each home is shown in its fees panel before you enquire. Assistance animals required
              by a person with a disability are accommodated in accordance with fair-housing law and are not
              treated as ordinary pets or subject to pet fees.
            </p>
          </section>

          {/* 8 ── Prohibited conduct */}
          <section id="conduct" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">8. </span>Prohibited conduct
            </h2>
            <p className={para}>
              You agree not to submit false or misleading information, misuse the contact form to send spam
              or unlawful content, scrape or copy listings at scale, attempt to gain unauthorised access, or
              use the site to harass any person. We may refuse service to anyone who breaches these terms.
            </p>
          </section>

          {/* 9 ── Limitation of liability */}
          <section id="liability" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">9. </span>Limitation of liability
            </h2>
            <p className={para}>
              The website is provided &ldquo;as is&rdquo; without warranties of any kind. As a demonstration
              project, the content is illustrative and may contain inaccuracies. To the fullest extent
              permitted by law, {site.legal.company} is not liable for any indirect or consequential loss
              arising from your use of the site or reliance on any listing. Nothing in these terms limits
              liability that cannot be limited under applicable law.
            </p>
          </section>

          {/* 10 ── Fair housing */}
          <section id="fair-housing" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">10. </span>Fair housing
            </h2>
            <p className={para}>
              {site.brand} supports equal housing opportunity. We do not discriminate on the basis of race,
              colour, religion, sex, disability, familial status or national origin, in accordance with the
              federal Fair Housing Act and applicable Texas fair-housing law, and we apply the same
              requirements to every applicant.
            </p>
          </section>

          {/* 11 ── Changes */}
          <section id="changes" className="scroll-mt-24 border-b border-muted-200 py-8 dark:border-white/10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">11. </span>Changes to these terms
            </h2>
            <p className={para}>
              We may update these terms from time to time. The &ldquo;last updated&rdquo; date above shows
              when the current version took effect, and your continued use of the site means you accept the
              revised terms.
            </p>
          </section>

          {/* 12 ── Contact */}
          <section id="contact" className="scroll-mt-24 py-8">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
              <span className="text-muted-500 dark:text-muted-300">12. </span>Contact
            </h2>
            <p className={para}>
              Questions about these terms? Contact {site.legal.company}, {site.legal.address} — landlord{" "}
              {site.landlord.name}, {site.landlord.license} — by{" "}
              <a href={mailHref} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                email
              </a>
              , <a href={telLink()} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                phone
              </a>{" "}
              or{" "}
              <a
                href={whatsappLink(generalEnquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-700 hover:underline dark:text-brand-300"
              >
                WhatsApp
              </a>
              , or see our <Link to="/privacy" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">privacy policy</Link>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
