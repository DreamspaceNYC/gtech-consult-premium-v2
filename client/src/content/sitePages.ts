export type StaticPageSlug =
  | "home"
  | "solarPackages"
  | "solarPlanner"
  | "projects"
  | "about"
  | "contact"
  | "notFound";

export type SitePage = {
  path: string;
  title: string;
  description: string;
  h1: string;
};

export const SITE_PAGES: Record<StaticPageSlug, SitePage> = {
  home: {
    path: "/",
    title: "Solar Power, Security & Smart Homes | G-Tech Consult",
    description:
      "G-Tech Consult installs solar power, inverters, lithium batteries, CCTV and smart-home systems for homes and businesses. Based in Ondo; enquire about your location.",
    h1: "Reliable Power. Smarter Security. Better Living.",
  },
  solarPackages: {
    path: "/solar-packages",
    title: "Solar Packages and Prices | G-Tech Consult",
    description:
      "Compare G-Tech Consult solar packages for different power needs, with inverter, battery, panel and installation details to help plan your home or business power system.",
    h1: "Solar Packages for Different Power Needs",
  },
  solarPlanner: {
    path: "/solar-planner",
    title: "Free Solar Calculator Nigeria — Size Your Inverter & Battery | G-Tech Consult",
    description:
      "Free solar planner: pick your appliances and usage times, get inverter and battery sizing, matched G-Tech packages with real naira prices, and generator payback estimates.",
    h1: "Plan Your Solar",
  },
  projects: {
    path: "/projects",
    title: "Solar, CCTV and Automation Projects | G-Tech Consult",
    description:
      "Explore the solar, inverter, battery, CCTV and smart-home installation work delivered by G-Tech Consult for homes and businesses. Ask about completed work relevant to your project.",
    h1: "Our Installation Work",
  },
  about: {
    path: "/about",
    title: "About G-Tech Consult | Energy & Security Specialists",
    description:
      "Learn how G-Tech Consult assesses, designs, installs and supports solar power, CCTV and smart-home systems from its Ondo City location.",
    h1: "About G-Tech Consult",
  },
  contact: {
    path: "/contact",
    title: "Contact G-Tech Consult",
    description:
      "Visit G-Tech Consult at Adesuper Junction in Ondo City, call 0816 749 8489 or request a solar, CCTV or smart-home assessment on WhatsApp.",
    h1: "Contact G-Tech Consult",
  },
  notFound: {
    path: "/404",
    title: "Page Not Found | G-Tech Consult",
    description:
      "The requested G-Tech Consult page could not be found. Return to our website to explore solar, CCTV and smart-home services.",
    h1: "Page Not Found",
  },
};
