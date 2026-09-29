import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY_IMAGES } from "@/content/gallery";

/**
 * "Recent installations" grid with a click-to-enlarge lightbox.
 * Images are real G-Tech Consult job-site photographs.
 */
export function InstallationsGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox(i =>
        i === null ? i : (i + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
      ),
    [],
  );

  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, step]);

  if (GALLERY_IMAGES.length === 0) return null;

  return (
    <section className="installations-gallery" aria-labelledby="gallery-heading">
      <div className="container">
        <div className="section-heading">
          <p className="page-eyebrow">Our work</p>
          <h2 id="gallery-heading">Recent installations</h2>
          <p className="gallery-sub">
            Real G-Tech Consult job sites — solar panels, inverters and battery
            installations, photographed as they happened.
          </p>
        </div>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((image, i) => (
            <button
              key={image.src}
              className="gallery-item"
              onClick={() => setLightbox(i)}
              aria-label={`Enlarge photo: ${image.caption}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
              <span className="gallery-caption">{image.caption}</span>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightbox + 1} of ${GALLERY_IMAGES.length}`}
          onClick={close}
        >
          <button
            className="lightbox-close"
            onClick={close}
            aria-label="Close photo viewer"
          >
            <X size={22} />
          </button>
          <button
            className="lightbox-prev"
            onClick={e => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>
          <figure
            className="lightbox-figure"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={GALLERY_IMAGES[lightbox].src}
              alt={GALLERY_IMAGES[lightbox].alt}
            />
            <figcaption>{GALLERY_IMAGES[lightbox].caption}</figcaption>
          </figure>
          <button
            className="lightbox-next"
            onClick={e => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
