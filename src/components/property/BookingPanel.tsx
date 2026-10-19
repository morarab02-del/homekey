import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  PencilLine,
} from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { site } from "@/config/site";
import {
  canBookNightly,
  nightlyQuote,
  requestMailtoLink,
  requestWhatsappLink,
  validateBookingRequest,
  validateTourRequest,
  type BookingRequest,
  type TourRequest,
} from "@/lib/booking";
import {
  formatBaths,
  formatBeds,
  formatMoney,
  fullAddress,
  propertyEnquiryMessage,
  whatsappLink,
} from "@/lib/formatting";
import { priceLabel } from "@/lib/filtering";
import type { Property } from "@/types/property";

type Mode = "form" | "done";
type FieldName = "name" | "email" | "phone" | "moveInDate" | "checkIn" | "checkOut";
type FieldErrors = Partial<Record<FieldName, string>>;

function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function BookingPanel({ property }: { property: Property }) {
  const nightly = property.rentType === "nightly";
  const leased = property.availability.status === "leased";
  const minNights = property.minNights ?? site.booking.defaultMinNights;

  const [mode, setMode] = useState<Mode>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sentDate, setSentDate] = useState("");

  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);
  const quote = useMemo(
    () => nightlyQuote(property, checkInDate, checkOutDate),
    [property, checkInDate, checkOutDate],
  );
  const stayValid = canBookNightly(property, checkInDate, checkOutDate);

  const stayHint =
    !checkIn || !checkOut
      ? "Pick your dates to see the full total."
      : quote.nights <= 0
        ? "Check-out must be at least one night after check-in."
        : quote.nights < minNights
          ? `Minimum stay is ${minNights} nights — add ${minNights - quote.nights} more ${
              minNights - quote.nights === 1 ? "night" : "nights"
            }.`
          : null;

  const enquiryHref = whatsappLink(
    propertyEnquiryMessage({
      title: property.title,
      address: fullAddress(property.address),
      priceLabel: priceLabel(property),
      beds: formatBeds(property.bedrooms),
      baths: formatBaths(property.bathrooms),
    }),
  );

  const submitTour = () => {
    const request: TourRequest = {
      propertyId: property.id,
      name,
      email,
      phone,
      moveInDate,
      message,
    };
    const next = validateTourRequest(request);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSentDate(moveInDate);
      setMode("done");
    }
  };

  const submitBooking = () => {
    const request: BookingRequest = {
      propertyId: property.id,
      name,
      email,
      phone,
      moveInDate: checkIn,
      message,
      checkIn,
      checkOut,
      nights: quote.nights,
      total: quote.total,
    };
    const next: FieldErrors = { ...validateBookingRequest(request) };
    if (!stayValid) next.checkIn = stayHint ?? "Select a valid stay.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSentDate(checkIn);
      setMode("done");
    }
  };

  const rentTypeTag = nightly ? "Short stay" : "Long-term rental";
  const termSuffix = nightly ? "/ night" : "/ month";

  if (mode === "done") {
    const summary = { name, email, phone, date: sentDate, note: message.trim() || undefined };
    const detailRows: { label: string; value: string }[] = [
      { label: "Name", value: name },
      { label: "Email", value: email },
      { label: "Phone", value: phone },
      { label: nightly ? "Check-in date" : "Move-in date", value: sentDate },
    ];
    if (nightly) {
      detailRows.push(
        { label: "Check-out date", value: checkOut },
        { label: "Nights", value: String(quote.nights) },
        { label: "Guests", value: String(guests) },
        { label: "Estimated total", value: formatMoney(quote.total) },
      );
    }
    if (message.trim()) detailRows.push({ label: "Note", value: message.trim() });

    return (
      <section className="bg-surface-card border border-sand-border rounded-2xl p-6 shadow-sm space-y-6" role="status" aria-labelledby="booking-confirm-heading">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-ok-100 text-ok-700 dark:bg-ok-700/25 dark:text-ok-200">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2
          id="booking-confirm-heading"
          className="text-lg font-bold tracking-tight font-serif text-ink-primary"
        >
          {nightly ? "Your stay request is ready" : "Your booking request is ready"}
        </h2>
        <p className="text-sm text-ink-muted">
          Nothing has been sent yet. Pick a channel below and your request goes straight to{" "}
          {site.landlord.name}.
        </p>

        <dl className="divide-y divide-sand-border space-y-2">
          {detailRows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-4 py-2 bg-surface-subtle px-4"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                {row.label}
              </dt>
              <dd className="max-w-[60%] text-right text-sm font-semibold text-ink-primary">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-xs text-ink-subtle">
          This is a request preview — no booking or inquiry has been transmitted until you send it
          on WhatsApp or by email.
        </p>

        <div className="space-y-2.5">
          <LinkButton
            href={requestWhatsappLink(property, summary)}
            external
            variant="wa"
            size="lg"
            block
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Send on WhatsApp
          </LinkButton>
          <LinkButton
            href={requestMailtoLink(property, summary)}
            variant="secondary"
            block
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email this request
          </LinkButton>
          <Button
            type="button"
            variant="ghost"
            block
            onClick={() => {
              setMode("form");
              setErrors({});
            }}
          >
            <PencilLine className="h-4 w-4" aria-hidden="true" />
            Edit details
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface-card border border-sand-border rounded-2xl p-6 shadow-sm space-y-6" aria-labelledby="booking-heading">
      <div className="flex items-baseline justify-between border-b border-sand-border pb-4">
        <div>
          <span id="bookingPriceDisplay" className="text-2xl font-bold text-ink-primary">
            {priceLabel(property)}
          </span>
          <span id="bookingTermDisplay" className="text-xs text-ink-muted">
            {termSuffix}
          </span>
        </div>
        <span className="text-xs text-ink-muted">{rentTypeTag}</span>
      </div>

      {/* Skip-the-form route — always available, including on leased homes. */}
      <LinkButton href={enquiryHref} external variant="wa" size="lg" block className="mt-4">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Chat on WhatsApp
      </LinkButton>

      <form
        className="space-y-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (leased) return;
          if (nightly) submitBooking();
          else submitTour();
        }}
      >
        {leased ? (
          <div
            className="rounded-xl border border-sand-border bg-surface-subtle p-4"
            role="status"
          >
            <p className="text-sm font-bold text-ink-primary">
              This home is currently leased
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              The form is paused while this home is rented. Join the waitlist — message{" "}
              {site.landlord.name} on WhatsApp and you&rsquo;ll be the first to know when it
              reopens.
            </p>
          </div>
        ) : null}

        <div>
          <label htmlFor="bk-name" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
            Full name
          </label>
          <Input
            id="bk-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            disabled={leased}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "bk-name-error" : undefined}
            className={clsx(
              "w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm",
              errors.name && "border-red-500 dark:border-red-400"
            )}
          />
          {errors.name ? (
            <p id="bk-name-error" className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="bk-email" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
            Email
          </label>
          <Input
            id="bk-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={email}
            disabled={leased}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "bk-email-error" : undefined}
            className={clsx(
              "w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm",
              errors.email && "border-red-500 dark:border-red-400"
            )}
          />
          {errors.email ? (
            <p id="bk-email-error" className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="bk-phone" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
            Phone
          </label>
          <Input
            id="bk-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 214 555 0134"
            value={phone}
            disabled={leased}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "bk-phone-error" : undefined}
            className={clsx(
              "w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm",
              errors.phone && "border-red-500 dark:border-red-400"
            )}
          />
          {errors.phone ? (
            <p id="bk-phone-error" className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        {nightly ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="bk-check-in" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
                  Check-in
                </label>
                <Input
                  id="bk-check-in"
                  name="checkIn"
                  type="date"
                  min={todayIso()}
                  value={checkIn}
                  disabled={leased}
                  onChange={(event) => setCheckIn(event.target.value)}
                  aria-invalid={errors.checkIn ? true : undefined}
                  aria-describedby={
                    errors.checkIn
                      ? "bk-check-in-error"
                      : stayHint
                      ? "bk-stay-hint"
                      : undefined
                  }
                  className={clsx(
                    "w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm",
                    errors.checkIn && "border-red-500 dark:border-red-400"
                  )}
                />
              </div>
              <div>
                <label htmlFor="bk-check-out" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
                  Check-out
                </label>
                <Input
                  id="bk-check-out"
                  name="checkOut"
                  type="date"
                  min={checkIn || todayIso()}
                  value={checkOut}
                  disabled={leased}
                  onChange={(event) => setCheckOut(event.target.value)}
                  aria-invalid={errors.checkOut ? true : undefined}
                  aria-describedby={errors.checkOut ? "bk-check-out-error" : undefined}
                  className={clsx(
                    "w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm",
                    errors.checkOut && "border-red-500 dark:border-red-400"
                  )}
                />
              </div>
            </div>

            {errors.checkIn ? (
              <p id="bk-check-in-error" className="text-xs font-semibold text-red-600 dark:text-red-400" role="alert">
                {errors.checkIn}
              </p>
            ) : null}
            {errors.checkOut ? (
              <p id="bk-check-out-error" className="text-xs font-semibold text-red-600 dark:text-red-400" role="alert">
                {errors.checkOut}
              </p>
            ) : null}

            <div>
              <label htmlFor="bk-guests" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
                Guests
              </label>
              <Select
                id="bk-guests"
                name="guests"
                value={guests}
                disabled={leased}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm"
              >
                {Array.from(
                  { length: Math.min(16, Math.max(2, property.bedrooms * 2)) },
                  (_, index) => index + 1,
                ).map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </Select>
            </div>

            {quote.nights > 0 ? (
              <div className="rounded-xl border border-sand-border bg-surface-subtle p-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-ink-muted">{formatMoney(property.priceNightly ?? 0)} × {quote.nights} {quote.nights === 1 ? "night" : "nights"}</dt>
                    <dd className="font-semibold text-ink-primary">{formatMoney(quote.rent)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-ink-muted">Cleaning fee</dt>
                    <dd className="font-semibold text-ink-primary">{formatMoney(quote.cleaningFee)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-ink-muted">Service fee ({site.booking.serviceFeePercent}%)</dt>
                    <dd className="font-semibold text-ink-primary">{formatMoney(quote.serviceFee)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-sand-border pt-2">
                    <dt className="font-bold text-ink-primary">Total</dt>
                    <dd className="font-bold text-brand-700 dark:text-brand-300">{formatMoney(quote.total)}</dd>
                  </div>
                </dl>
              </div>
            ) : null}

            {stayHint ? (
              <p
                id="bk-stay-hint"
                className="text-xs font-semibold text-soon-700 dark:text-soon-200"
              >
                {stayHint}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <div>
              <label htmlFor="bk-move-in" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
                Move-in date
              </label>
              <Input
                id="bk-move-in"
                name="moveInDate"
                type="date"
                min={todayIso()}
                value={moveInDate}
                disabled={leased}
                onChange={(event) => setMoveInDate(event.target.value)}
                aria-invalid={errors.moveInDate ? true : undefined}
                aria-describedby={errors.moveInDate ? "bk-move-in-error" : undefined}
                className={clsx(
                  "w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm",
                  errors.moveInDate && "border-red-500 dark:border-red-400"
                )}
              />
              {errors.moveInDate ? (
                <p id="bk-move-in-error" className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400" role="alert">
                  {errors.moveInDate}
                </p>
              ) : null}
            </div>
          </>
        )}

        <div>
          <label htmlFor="bk-message" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
            Message <span className="font-normal normal-case tracking-normal text-ink-subtle">(optional)</span>
          </label>
          <textarea
            id="bk-message"
            name="message"
            rows={2}
            value={message}
            disabled={leased}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={
              nightly
                ? "Introduce yourself or ask a question…"
                : "Introduce yourself or ask a question…"
            }
            className="w-full px-3 py-2 border border-sand-border rounded-lg bg-surface-main text-sm placeholder-ink-subtle transition-colors focus:border-brass-accent dark:border-white/15 dark:bg-white/5 dark:text-white"
          />
        </div>

        {!leased ? (
          <Button
            type="submit"
            block
            size="lg"
            disabled={nightly && !stayValid}
            className="bg-ink-primary text-surface-main"
          >
            {nightly ? "Request to book" : "Book this property"}
          </Button>
        ) : null}

        <p className="text-xs leading-relaxed text-ink-muted">
          {nightly
            ? "You won't be charged yet — this request reserves the dates and the landlord confirms on WhatsApp."
            : "Submitting books the property and the landlord confirms on WhatsApp."}
        </p>
      </form>
    </section>
  );
}

function clsx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default BookingPanel;