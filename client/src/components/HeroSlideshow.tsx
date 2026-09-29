import { ArrowRight } from "lucide-react";
import { HERO_SLIDES } from "@/content/gallery";

/**
 * Repurposed from the old full-bleed hero slideshow: the 3 real G-Tech
 * install photos (HERO_SLIDES in gallery.ts) now render as an "Our recent
 * work" strip directly beneath the hero. The photos stay visible — nothing
 * was dropped.
 */
export function HeroSlideshow() {
  if (HERO_SLIDES.length === 0) return null;

  return (
    <div className="gtr-workstrip">
      <div className="container">
        <div className="gtr-workstrip__head">
          <h2>Our recent work</h2>
          <a href="#installations">
            See all installations <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="gtr-workstrip__grid">
          {HERO_SLIDES.map((slide, i) => (
            <figure className="gtr-workstrip__card" key={slide.src}>
              <img
                src={slide.src}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <figcaption>{slide.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
