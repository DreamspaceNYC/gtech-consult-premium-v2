export type StaticPageSlug =
  | "home"
  | "solarPackages"
  | "solarPlanner"
  | "commercialSizing"
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
    title: "Solar Inverter Size Calculator Nigeria — Free kVA Sizing Tool | G-Tech Consult",
    description:
      "Free solar inverter size calculator for Nigeria: enter your appliances and daily usage to size your inverter (kVA), battery and panels. Commercial sizing for Lagos and Ondo businesses, real naira package prices and generator payback.",
    h1: "Solar Inverter Size Calculator Nigeria",
  },
  commercialSizing: {
    path: "/commercial-solar-sizing",
    title: "Commercial Solar Inverter Sizing in Lagos & Ondo | G-Tech Consult",
    description:
      "Commercial solar inverter sizing for businesses in Lagos, Ondo and across Nigeria: 3-phase and hybrid system design, load audits and capacity estimates from your equipment list or electricity bill.",
    h1: "Commercial Solar Inverter Sizing",
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
