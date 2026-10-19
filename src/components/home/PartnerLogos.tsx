import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/** Emblems stay geometric and greyscale so the row reads as a "press wall". */
const PARTNERS: { name: string; emblem: ReactNode }[] = [
  {
    name: "Texas Renters",
    emblem: (
      <>
        <path d="M14 6l10 8v18H4V14l10-8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 32V21h8v11" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    name: "Dallas Living",
    emblem: (
      <>
        <circle cx="14" cy="16" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M14 9.5l2.2 4.9 5.3.5-4 3.6 1.2 5.3-4.5-2.7-4.5 2.7 1.2-5.3-4-3.6 5.3-.5 2.2-4.9z"
          fill="currentColor"
        />
      </>
    ),
  },
  {
    name: "Relocate Texas",
    emblem: (
      <>
        <path d="M4 32l20-20 3.5 3.5-20 20H4v-3.5z" fill="currentColor" />
        <circle cx="24" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    name: "Houston Home Guide",
    emblem: (
      <>
        <circle cx="11" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.6 20.4L26 31" stroke="currentColor" strokeWidth="1.6" />
        <path d="M23 28l3 3M26 25l3 3" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    name: "Lone Star Review",
    emblem: (
      <>
        <path
          d="M14 4l9 5v10c0 6-4 9.5-9 11-5-1.5-9-5-9-11V9l9-5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M9.5 16.5l3.2 3.2 6-6.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
  },
];

function Wordmark({ partner }: { partner: { name: string; emblem: ReactNode } }) {
  return (
    <svg
      viewBox="0 0 220 48"
      role="img"
      className="h-9 w-auto sm:h-10 text-ink-muted opacity-70 hover:opacity-100 hover:text-ink-primary transition-all duration-300"
      aria-labelledby={`partner-${partner.name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <title id={`partner-${partner.name.replace(/\s+/g, "-").toLowerCase()}`}>{partner.name}</title>
      <g transform="translate(4 4)">
        {partner.emblem}
      </g>
      <text
        x="44"
        y="30"
        fill="currentColor"
        fontSize="19"
        fontWeight="700"
        letterSpacing="-0.4"
      >
        {partner.name}
      </text>
    </svg>
  );
}

export function PartnerLogos() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className={`section bg-surface-main transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] text-brass-accent transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Featured in
          </p>
          <h2 className={`mt-3 h-section font-serif font-bold text-ink-primary transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Recognized by Texas rental publications
          </h2>
          <p className={`mt-3 text-sm leading-relaxed text-ink-muted transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            HomeKey has been featured by local rental guides and relocation resources across the state.
          </p>
        </div>

        <ul className={`mt-10 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {PARTNERS.map((partner, index) => (
            <li
              key={partner.name}
              className={`flex items-center justify-center stagger-${(index % 5) + 1} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Wordmark partner={partner} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}