export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

// Real G-Tech Consult installation photographs, extracted from job-site videos
// (Blessing Computers and Fagun, Ondo installations).
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "/images/gallery/install-01.webp",
    alt: "Two G-Tech Consult technicians mounting solar panels on a roof",
    caption: "Mounting solar panels — Blessing Computers install",
  },
  {
    src: "/images/gallery/install-02.webp",
    alt: "Technician securing solar panels to a roof mounting frame",
    caption: "Securing panels to the roof frame — Blessing Computers",
  },
  {
    src: "/images/gallery/install-03.webp",
    alt: "Close-up of solar panels seated on a residential roof",
    caption: "Panels seated on the roof — Blessing Computers",
  },
  {
    src: "/images/gallery/install-04.webp",
    alt: "Technician working on a rooftop solar panel array",
    caption: "Rooftop panel work — Blessing Computers",
  },
  {
    src: "/images/gallery/install-05.webp",
    alt: "Technicians mounting solar panels on a roof in progress",
    caption: "Panel mounting in progress — Blessing Computers",
  },
  {
    src: "/images/gallery/install-06.webp",
    alt: "Technician wiring an inverter during installation",
    caption: "Wiring the inverter — Fagun, Ondo install",
  },
  {
    src: "/images/gallery/install-07.webp",
    alt: "Close-up of hands connecting cables to inverter terminals",
    caption: "Connecting inverter terminals — Fagun, Ondo",
  },
  {
    src: "/images/gallery/install-08.webp",
    alt: "Installed wall-mounted inverter above a battery bank",
    caption: "Inverter and battery bank installed — Fagun, Ondo",
  },
  {
    src: "/images/gallery/install-09.webp",
    alt: "Technician drilling a wall mount for solar equipment",
    caption: "Drilling the wall mount — Blessing Computers",
  },
  {
    src: "/images/gallery/install-10.webp",
    alt: "Technician fitting a metal mounting bracket on a wall",
    caption: "Fitting the mounting bracket — Fagun, Ondo",
  },
  {
    src: "/images/gallery/install-11.webp",
    alt: "Technician beside an installed inverter and battery unit",
    caption: "Inverter and battery setup — Fagun, Ondo",
  },
];

export interface HeroSlide {
  src: string;
  alt: string;
}

// Wide, high-impact shots for the homepage hero background slideshow.
export const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/gallery/hero-install-01.webp",
    alt: "G-Tech Consult technicians mounting solar panels on a roof",
  },
  {
    src: "/images/gallery/hero-install-02.webp",
    alt: "Technician wiring an inverter during a G-Tech Consult installation",
  },
  {
    src: "/images/gallery/hero-install-03.webp",
    alt: "Installed solar panels on a residential roof",
  },
];
