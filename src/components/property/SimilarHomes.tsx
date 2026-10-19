import { PropertyCard } from "@/components/PropertyCard";
import { similarProperties } from "@/lib/filtering";
import type { Property } from "@/types/property";

/** Three nearby/similar listings rendered with the shared property card. */
export function SimilarHomes({
  property,
  list,
}: {
  property: Property;
  list: Property[];
}) {
  const similar = similarProperties(property, list, 3);

  if (similar.length === 0) return null;

  return (
    <section className="mt-14" aria-labelledby="similar-heading">
      <h2
        id="similar-heading"
        className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl dark:text-white"
      >
        Similar homes you may like
      </h2>
      <p className="mt-2 text-sm text-ink-600 sm:text-base dark:text-muted-500">
        Hand-picked by city, rent type and property type — all from the same verified landlord.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((item, index) => (
          <PropertyCard key={item.id} property={item} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}

export default SimilarHomes;
