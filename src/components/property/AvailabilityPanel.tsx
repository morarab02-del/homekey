import { Badge } from "@/components/ui/Badge";
import { formatMoney } from "@/lib/formatting";
import { AVAILABILITY_LABEL, type Availability, type Property } from "@/types/property";

export const AVAILABILITY_TONE: Record<Availability, "ok" | "soon" | "muted"> = {
  "available-now": "ok",
  "available-later": "soon",
  leased: "muted",
};

interface FeeRow {
  label: string;
  value: string;
}

/** Availability status plus the rent-type aware fee list. */
export function AvailabilityPanel({ property }: { property: Property }) {
  const { status, availableFrom } = property.availability;
  const nightly = property.rentType === "nightly";

  const rows: FeeRow[] = nightly
    ? [
        {
          label: "Refundable damage deposit",
          value: formatMoney(property.fees.securityDeposit),
        },
      ]
    : [
        { label: "Security deposit", value: formatMoney(property.fees.securityDeposit) },
        { label: "Deposit rule", value: "Deposit equal to one month's rent" },
        { label: "Application fee", value: formatMoney(property.fees.applicationFee) },
      ];

  rows.push({
    label: "Pets",
    value: property.fees.petsAllowed
      ? property.fees.petFee && property.fees.petFee > 0
        ? `Allowed — ${formatMoney(property.fees.petFee)} pet fee`
        : "Allowed"
      : "Not allowed",
  });

  return (
    <section className="surface p-5 sm:p-6" aria-labelledby="availability-heading">
      <h2 id="availability-heading" className="text-lg font-bold text-ink-900 dark:text-white">
        Availability &amp; fees
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Badge tone={AVAILABILITY_TONE[status]}>{AVAILABILITY_LABEL[status]}</Badge>
        {status === "available-later" && availableFrom ? (
          <span className="text-sm font-medium text-ink-700 dark:text-muted-300">
            Available from {availableFrom}
          </span>
        ) : null}
        {status === "leased" ? (
          <span className="text-sm font-medium text-ink-600 dark:text-muted-500">
            Join the waitlist in the booking panel and we&rsquo;ll let you know first.
          </span>
        ) : null}
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-muted-200 bg-muted-50/60 p-4 dark:border-white/10 dark:bg-white/[.03]"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-600 dark:text-muted-500">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm font-bold text-ink-900 dark:text-white">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default AvailabilityPanel;
