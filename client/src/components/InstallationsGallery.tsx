import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY_IMAGES } from "@/content/gallery";

type GalleryCategory = "Solar" | "CCTV" | "Smart Home";

const FILTERS: ("All" | GalleryCategory)[] = ["All", "Solar", "CCTV", "Smart Home"];

/**
 * Category map kept OUTSIDE content/gallery.ts (sacred — must not be edited).
 * Every photo in GALLERY_IMAGES is a solar job site (Blessing Computers and
 * Fagun, Ondo installs), so all 11 map to "Solar"; the CCTV / Smart Home
 * chips render an honest empty state until job photos for those trades land.
 */
const IMAGE_CATEGORIES: GalleryCategory[] = GALLERY_IMAGES.map(() => "Solar");

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * "Recent installations" grid with category filter chips and a
 * click-to-enlarge lightbox. Images are real G-Tech Consult job-site photos.
 */
export function InstallationsGallery() {
  const [filter, setFilter] = useState<"All" | GalleryCategory>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      GALLERY_IMAGES.map((image, i) => ({ image, category: IMAGE_CATEGORIES[i] }))
        .filter(entry => filter === "All" || entry.category === filter),
    [filter],
  );

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox(i =>
        i === null ? i : (i + dir + filtered.length) % filtered.length,
      ),
    [filtered.length],
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

  // Reset the lightbox when the filter changes under it.
  useEffect(() => setLightbox(null), [filter]);

  if (GALLERY_IMAGES.length === 0) return null;

  const lightboxEntry = lightbox !== null ? filtered[lightbox] : null;

  return (
    <section
      id="installations"
      className="gtr-gallery gtr-section"
      aria-labelledby="gallery-heading"
    >
      <div className="container">
        <div className="gtr-gallery-head">
          <div className="gtr-heading" style={{ marginBottom: 0 }}>
            <p className="gtr-kicker">Our work</p>
            <h2 id="gallery-heading">Recent installations</h2>
            <p>
              Real G-Tech Consult job sites — solar panels, inverters and
              battery installations, photographed as they happened.
            </p>
          </div>
          <div
            className="gtr-chips"
            role="group"
            aria-label="Filter installations by category"
          >
            {FILTERS.map(f => (
              <button
                key={f}
                className={`gtr-chip${filter === f ? " is-active" : ""}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div className="gtr-gallery-grid" layout={!reducedMotion()}>
          <AnimatePresence mode="popLayout">
            {filtered.map(({ image }) => (
              <motion.button
                layout={!reducedMotion()}
                key={image.src}
                className="gtr-gallery-item"
                onClick={() =>
                  setLightbox(filtered.findIndex(e => e.image.src === image.src))
                }
                aria-label={`Enlarge photo: ${image.caption}`}
                initial={reducedMotion() ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion() ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="gtr-gallery-caption">{image.caption}</span>
              </motion.button>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="gtr-gallery-empty">
              <Camera size={30} aria-hidden="true" />
              <p>No {filter} installation photos yet.</p>
              <span>
                New job-site photos are added after each completed install —
                browse our solar installs for now.
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {lightboxEntry && (
        <div
          className="gtr-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightbox! + 1} of ${filtered.length}`}
          onClick={close}
        >
          <button
            className="gtr-lightbox__close"
            onClick={close}
            aria-label="Close photo viewer"
          >
            <X size={22} />
          </button>
          <button
            className="gtr-lightbox__prev"
            onClick={e => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>
          <figure
            className="gtr-lightbox-figure"
            onClick={e => e.stopPropagation()}
          >
            <img src={lightboxEntry.image.src} alt={lightboxEntry.image.alt} />
            <figcaption>{lightboxEntry.image.caption}</figcaption>
          </figure>
          <button
            className="gtr-lightbox__next"
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
