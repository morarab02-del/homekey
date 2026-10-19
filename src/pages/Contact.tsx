import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Clock, IdCard, Mail, MessageCircle, Phone } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Accordion, SectionHeading } from "@/components/ui";
import { VerifiedBadge } from "@/components/ui/Badge";
import { site } from "@/config/site";
import { faqs } from "@/data/faqs";
import { mailtoLink, telLink, whatsappLink } from "@/lib/formatting";

const SUBJECTS = [
  "General enquiry",
  "Book a viewing",
  "Nightly stay",
  "Existing booking",
  "Other",
] as const;

const OFFICE_HOURS = [
  { days: "Monday – Friday", time: "8:00am – 7:00pm CT" },
  { days: "Saturday", time: "9:00am – 5:00pm CT" },
  { days: "Sunday", time: "By appointment" },
];

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const EMPTY: ContactForm = {
  name: "",
  email: "",
  phone: "",
  subject: SUBJECTS[0],
  message: "",
};

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(values: ContactForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!values.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState<ContactForm>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact HomeKey | HomeKey";
  }, []);

  const waHref = whatsappLink(
    `Hello ${site.brand}, I'd like to know more about your homes for rent in Texas.`,
  );
  const telHref = telLink();
  const mailHref = mailtoLink("HomeKey enquiry", `Hello ${site.brand}, I have a question about your homes.`);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  const update =
    (field: keyof ContactForm) =>
    (event: { target: { value: string } }) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const composedWa = [
    `Hello ${site.brand}, my name is ${values.name} (${values.email}${values.phone ? `, ${values.phone}` : ""}).`,
    `Subject: ${values.subject}`,
    "",
    values.message,
  ].join("\n");
  const composedMailSubject = `HomeKey — ${values.subject}`;
  const composedMailBody = [
    `From: ${values.name} <${values.email}>${values.phone ? ` · ${values.phone}` : ""}`,
    "",
    values.message,
    "",
    "— Sent from the HomeKey contact form",
  ].join("\n");

  const contacts = [
    {
      label: "WhatsApp",
      value: site.whatsappDisplay,
      description: "Fastest reply — message us any time.",
      href: waHref,
      external: true,
      Icon: MessageCircle,
      iconClass: "bg-[#25D366]/15 text-[#20bd5a] dark:bg-[#25D366]/20 dark:text-[#25D366]",
    },
    {
      label: "Phone",
      value: site.phone,
      description: "Call during office hours for a chat.",
      href: telHref,
      external: false,
      Icon: Phone,
      iconClass: "bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-200",
    },
    {
      label: "Email",
      value: site.email,
      description: "Send documents or a longer question.",
      href: mailHref,
      external: false,
      Icon: Mail,
      iconClass: "bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-200",
    },
  ];

  return (
    <div>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <section className="section pb-0">
        <div className="shell">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="h-section text-ink-900 dark:text-white">Contact HomeKey</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base dark:text-muted-500">
              Questions about a listing, a fee, or booking a viewing? Reach {site.landlord.name}{" "}
              directly — you always talk to the same person.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="surface group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-full ${contact.iconClass}`}>
                  <contact.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
                  {contact.label}
                </span>
                <span className="mt-0.5 text-base font-bold text-ink-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                  {contact.value}
                </span>
                <span className="mt-1.5 text-sm text-ink-600 dark:text-muted-500">{contact.description}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + landlord sidebar ────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
            {/* Contact form */}
            <div className="surface p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-900 dark:text-white">Send a message</h2>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-muted-500">
                Fill in the form and we&apos;ll reply to the details you provide.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-xl2 border border-ok-200 bg-ok-50 p-6 dark:border-ok-700/40 dark:bg-ok-700/15">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ok-100 text-ok-700 dark:bg-ok-700/30 dark:text-ok-200">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink-900 dark:text-white">
                    Thanks, {values.name.trim()} — your message is ready.
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-muted-500">
                    This demo form has no backend, so nothing has left your device yet. Send it now via
                    WhatsApp or email so {site.landlord.name} receives it instantly.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <LinkButton href={whatsappLink(composedWa)} variant="wa" external>
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Send via WhatsApp
                    </LinkButton>
                    <LinkButton href={mailtoLink(composedMailSubject, composedMailBody)} variant="secondary">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      Send via email
                    </LinkButton>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setSubmitted(false);
                        setValues(EMPTY);
                        setErrors({});
                      }}
                    >
                      Write another
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="contact-name">
                        Name
                      </label>
                      <Input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Doe"
                        value={values.name}
                        onChange={update("name")}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                      />
                      {errors.name ? (
                        <p id="contact-name-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label className="field-label" htmlFor="contact-email">
                        Email
                      </label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="jane@example.com"
                        value={values.email}
                        onChange={update("email")}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                      />
                      {errors.email ? (
                        <p id="contact-email-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="contact-phone">
                        Phone <span className="font-normal normal-case text-muted-500 dark:text-muted-300">(optional)</span>
                      </label>
                      <Input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+1 (555) 000-0000"
                        value={values.phone}
                        onChange={update("phone")}
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="contact-subject">
                        Subject
                      </label>
                      <Select
                        id="contact-subject"
                        name="subject"
                        value={values.subject}
                        onChange={update("subject")}
                      >
                        {SUBJECTS.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Tell us what you're looking for — move-in date, budget, neighborhoods…"
                      value={values.message}
                      onChange={update("message")}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      className="field h-auto min-h-[120px] resize-y py-2.5 leading-relaxed"
                    />
                    {errors.message ? (
                      <p id="contact-message-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button type="submit" className="btn btn-primary btn-md">
                      Send message
                    </button>
                    <p className="text-xs leading-relaxed text-muted-500 dark:text-muted-300">
                      Demo form — messages are kept on your device only.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar: landlord + office hours */}
            <aside className="space-y-6">
              <div className="surface p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
                  Your landlord
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-700 text-base font-bold text-white dark:bg-brand-600"
                  >
                    GM
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-ink-900 dark:text-white">{site.landlord.name}</h2>
                    <VerifiedBadge className="mt-0.5" />
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-500 dark:text-muted-300" aria-hidden="true" />
                    <div>
                      <p className="text-muted-600 dark:text-muted-500">Licence</p>
                      <p className="font-semibold text-ink-700 dark:text-muted-300">{site.landlord.license}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-500 dark:text-muted-300" aria-hidden="true" />
                    <div>
                      <p className="text-muted-600 dark:text-muted-500">Response time</p>
                      <p className="font-semibold text-ink-700 dark:text-muted-300">{site.landlord.responseTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-200">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-lg font-bold text-ink-900 dark:text-white">Office hours</h2>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  {OFFICE_HOURS.map((row) => (
                    <div key={row.days} className="flex items-center justify-between gap-3 border-b border-muted-200 pb-2 last:border-0 last:pb-0 dark:border-white/10">
                      <dt className="text-ink-600 dark:text-muted-500">{row.days}</dt>
                      <dd className="font-semibold text-ink-700 dark:text-muted-300">{row.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-500 dark:text-muted-300">
                  Times are Central Time. WhatsApp messages are read outside these hours too.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <SectionHeading title="Frequently asked questions" subtitle="Quick answers to the things renters ask us most." />
            <div className="space-y-3">
              {faqs.map((faq) => (
                <Accordion key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-ink-600 dark:text-muted-500">
              Still have a question? Email{" "}
              <a href={mailHref} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                {site.email}
              </a>{" "}
              and we&apos;ll get back to you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
