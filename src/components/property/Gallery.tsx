import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Slider";
import { SmartImage } from "@/components/ui/SmartImage";
import type { PropertyPhoto } from "@/types/property";

/** Photo stage: grid layout matching prototype, with full-screen lightbox. */
export function Gallery({
  photos,
  title,
}: {
  photos: PropertyPhoto[];
  title: string;
}) {
  const count = photos.length;
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const activeIndex = count > 0 ? Math.min(index, count - 1) : 0;
  const active = count > 0 ? photos[activeIndex] : undefined;

  const go = useCallback(
    (direction: 1 | -1) =>
      setIndex((current) => (count > 0 ? (current + direction + count) % count : 0)),
    [count],
  );

  useEffect(() => {
    setIndex(0);
    setLightbox(false);
  }, [photos]);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox, go]);

  if (!active || count === 0) return null;

  return (
    <section aria-label={`${title} photo gallery`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl border border-sand-border bg-surface-card p-2 overflow-hidden">
        <button
          type="button"
          className="md:col-span-2 aspect-[4/3] relative group overflow-hidden rounded-xl"
          onClick={() => setLightbox(true)}
          aria-label={`Open photo ${activeIndex + 1} of ${count} full size`}
        >
          <SmartImage
            src={active.src}
            alt={active.alt}
            eager
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute bottom-3 left-3 bg-ink-900/70 text-white text-xs px-2.5 py-1 rounded-md">
            {active.room} (tap to expand)
          </span>
        </button>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:col-span-1">
          {photos
            .filter((_, i) => i !== activeIndex)
            .slice(0, 2)
            .map((photo, photoIndex) => (
              <button
                key={photo.src}
                type="button"
                className="aspect-[4/3] overflow-hidden rounded-xl"
                onClick={() => {
                  const realIndex = photos.findIndex((p) => p.src === photo.src);
                  setIndex(realIndex);
                  setLightbox(true);
                }}
                aria-label={`Open demonstration photo ${photoIndex + 2}`}
              >
                <SmartImage src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
              </button>
            ))}
        </div>

        {count > 3 ? (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:col-span-1">
            {photos
              .filter((_, i) => i !== activeIndex)
              .slice(2, 4)
              .map((photo, photoIndex) => (
                <button
                  key={photo.src}
                  type="button"
                  className="aspect-[4/3] relative overflow-hidden rounded-xl"
                  onClick={() => {
                    const realIndex = photos.findIndex((p) => p.src === photo.src);
                    setIndex(realIndex);
                    setLightbox(true);
                  }}
                  aria-label={`Open demonstration photo ${photoIndex + 4}`}
                >
                  <SmartImage src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                  {photoIndex === photos.length - 3 ? (
                    <span className="absolute inset-0 bg-ink-900/40 flex items-center justify-center text-white text-sm">
                      View all {count} photos
                    </span>
                  ) : null}
                </button>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:col-span-1">
            {photos
              .filter((_, i) => i !== activeIndex)
              .slice(2, 4)
              .map((photo, photoIndex) => (
                <button
                  key={photo.src}
                  type="button"
                  className="aspect-[4/3] overflow-hidden rounded-xl"
                  onClick={() => {
                    const realIndex = photos.findIndex((p) => p.src === photo.src);
                    setIndex(realIndex);
                    setLightbox(true);
                  }}
                  aria-label={`Open demonstration photo ${photoIndex + 4}`}
                >
                  <SmartImage src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                </button>
              ))}
          </div>
        )}
      </div>

      <Modal
        open={lightbox}
        onClose={() => setLightbox(false)}
        label={`${title} — photo ${activeIndex + 1} of ${count}`}
      >
        <div className="flex flex-col h-full w-full max-h-[92vh] overflow-hidden bg-black/95 text-white">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <h2 id="lightboxTitle" className="sr-only">
                {title} — photo gallery
              </h2>
            </div>
            <span id="lightbox-counter" className="text-sm font-mono text-stone-300" aria-live="polite">
              {activeIndex + 1} / {count}
            </span>
            <button
              type="button"
              id="lightboxCloseBtn"
              aria-label="Close photo gallery"
              className="p-2 rounded-full hover:bg-white/10"
              onClick={() => setLightbox(false)}
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1 items-center justify-center min-h-0">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-0 md:left-2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
            <SmartImage
              src={active.src}
              alt={active.alt}
              eager
              className="max-h-full max-w-[85%] object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-0 md:right-2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex justify-center gap-3 overflow-x-auto py-3 px-4" aria-label="Choose a photo">
            {photos.map((photo, photoIndex) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setIndex(photoIndex)}
                aria-label={`Select photo ${photoIndex + 1}`}
                aria-current={photoIndex === activeIndex}
                className="shrink-0 w-16 h-12 rounded overflow-hidden border-2 border-transparent opacity-60 hover:opacity-100 transition"
              >
                <img
                  src={photo.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span className="sr-only">{photoIndex === activeIndex ? " (current)" : ""}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </section>
  );
}

export default Gallery;