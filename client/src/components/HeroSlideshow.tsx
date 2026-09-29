import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/content/gallery";

const ROTATE_MS = 7000;

/**
 * Full-bleed background slideshow for the homepage hero.
 * Decorative only (aria-hidden): the hero copy carries the message.
 * Rotation pauses for users who prefer reduced motion.
 */
export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex(i => (i + 1) % HERO_SLIDES.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  if (HERO_SLIDES.length === 0) return null;

  return (
    <div className="hero-slideshow" aria-hidden="true">
      {HERO_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt=""
          className={i === index ? "hero-slide active" : "hero-slide"}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
      <div className="hero-slideshow-shade" />
    </div>
  );
}
