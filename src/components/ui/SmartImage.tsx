import { useEffect, useState } from "react";

/**
 * Image with a shimmer skeleton while loading and a local SVG fallback on error.
 * Cards use small variants, the gallery uses large variants.
 */
export function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-muted-100 dark:bg-white/5 ${className}`}>
      {/* Shimmer shown until image is fully loaded AND rendered */}
      {!loaded ? <div className="shimmer absolute inset-0" aria-hidden="true" /> : null}
      {failed ? (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/40 dark:to-brand-800/30">
          <img
            src="/fallback.svg"
            alt=""
            className="h-1/2 w-1/2 opacity-80"
            aria-hidden="true"
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "sync" : "async"}
          onLoad={() => {
            // Small delay to ensure image is fully rendered before hiding shimmer
            requestAnimationFrame(() => {
              setLoaded(true);
            });
          }}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
