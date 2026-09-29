/* G-Tech product catalog — 6 families, 28 products, 4 services.
   Enquiry-only: NO prices anywhere. Generic names + plain one-line
   descriptions only. Images live under /images/catalog/<family>/<slug>.png */

export type CatalogFamily = {
  id: string;
  label: string;
  blurb: string;
};

export type CatalogProduct = {
  slug: string;
  family: string; // family id
  name: string;
  description: string;
  image: string;
};

export type CatalogService = {
  slug: string;
  family: string;
  name: string;
  description: string;
  icon: string; // lucide icon key, resolved in ServiceCard
};

export const CATALOG_FAMILIES: CatalogFamily[] = [
  {
    id: "solar-power",
    label: "Solar & Power",
    blurb: "Panels, inverters and batteries for steady light.",
  },
  {
    id: "cctv-surveillance",
    label: "CCTV & Surveillance",
    blurb: "Cameras and recorders that keep watch for you.",
  },
  {
    id: "access-control-entry",
    label: "Access Control & Entry",
    blurb: "Decide who comes in, and when.",
  },
  {
    id: "network-connectivity",
    label: "Network & Connectivity",
    blurb: "Strong signal and internet where you need it.",
  },
  {
    id: "fire-safety",
    label: "Fire & Safety",
    blurb: "Early warning when it matters most.",
  },
  {
    id: "smart-home",
    label: "Smart Home",
    blurb: "Control your home from your phone.",
  },
];

const img = (family: string, slug: string) =>
  `/images/catalog/${family}/${slug}.png`;

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  // ---- Solar & Power ----
  {
    slug: "solar-panels",
    family: "solar-power",
    name: "Solar panels",
    description: "Capture sunlight and turn it into electricity for your home or business.",
    image: img("solar-power", "solar-panels"),
  },
  {
    slug: "hybrid-inverters",
    family: "solar-power",
    name: "Hybrid inverters",
    description: "Convert solar and battery power into clean electricity for your appliances.",
    image: img("solar-power", "hybrid-inverters"),
  },
  {
    slug: "lithium-batteries",
    family: "solar-power",
    name: "Lithium batteries (LiFePO4)",
    description: "Store your solar power for steady light through the night.",
    image: img("solar-power", "lithium-batteries"),
  },
  {
    slug: "tubular-batteries",
    family: "solar-power",
    name: "Tubular batteries",
    description: "A budget-friendly way to store backup power for your inverter.",
    image: img("solar-power", "tubular-batteries"),
  },
  {
    slug: "mppt-charge-controllers",
    family: "solar-power",
    name: "MPPT charge controllers",
    description: "Manage how your panels charge your batteries, for longer battery life.",
    image: img("solar-power", "mppt-charge-controllers"),
  },
  {
    slug: "solar-street-flood-lights",
    family: "solar-power",
    name: "Solar street & flood lights",
    description: "Light up compounds, streets and gates with the sun — no wiring needed.",
    image: img("solar-power", "solar-street-flood-lights"),
  },
  {
    slug: "automatic-changeover-switches",
    family: "solar-power",
    name: "Automatic changeover switches",
    description: "Switch between PHCN, generator and solar automatically.",
    image: img("solar-power", "automatic-changeover-switches"),
  },
  // ---- CCTV & Surveillance ----
  {
    slug: "dome-cameras",
    family: "cctv-surveillance",
    name: "Dome cameras",
    description: "Discreet indoor cameras for shops, offices and homes.",
    image: img("cctv-surveillance", "dome-cameras"),
  },
  {
    slug: "bullet-cameras",
    family: "cctv-surveillance",
    name: "Bullet cameras",
    description: "Tough outdoor cameras that watch over gates and compounds.",
    image: img("cctv-surveillance", "bullet-cameras"),
  },
  {
    slug: "ptz-cameras",
    family: "cctv-surveillance",
    name: "PTZ cameras",
    description: "Pan, tilt and zoom to cover large areas like estates and warehouses.",
    image: img("cctv-surveillance", "ptz-cameras"),
  },
  {
    slug: "solar-4g-cameras",
    family: "cctv-surveillance",
    name: "Solar 4G cameras",
    description: "Watch remote places with no light or internet — powered by the sun.",
    image: img("cctv-surveillance", "solar-4g-cameras"),
  },
  {
    slug: "wifi-cameras",
    family: "cctv-surveillance",
    name: "WiFi cameras",
    description: "Quick to install with no cables — ideal for small homes.",
    image: img("cctv-surveillance", "wifi-cameras"),
  },
  {
    slug: "video-doorbells",
    family: "cctv-surveillance",
    name: "Video doorbells",
    description: "See and speak to visitors at your gate from your phone.",
    image: img("cctv-surveillance", "video-doorbells"),
  },
  {
    slug: "dvr-nvr-recorders",
    family: "cctv-surveillance",
    name: "DVR/NVR recorders",
    description: "Record and store footage from all your cameras in one place.",
    image: img("cctv-surveillance", "dvr-nvr-recorders"),
  },
  // ---- Access Control & Entry ----
  {
    slug: "biometric-locks",
    family: "access-control-entry",
    name: "Biometric locks",
    description: "Open doors with your fingerprint or face — no keys to lose.",
    image: img("access-control-entry", "biometric-locks"),
  },
  {
    slug: "keypad-card-locks",
    family: "access-control-entry",
    name: "Keypad & card locks",
    description: "Enter with a code or card — easy to manage for staff and tenants.",
    image: img("access-control-entry", "keypad-card-locks"),
  },
  {
    slug: "magnetic-locks",
    family: "access-control-entry",
    name: "Magnetic locks",
    description: "Strong, silent locks for glass doors and office entrances.",
    image: img("access-control-entry", "magnetic-locks"),
  },
  {
    slug: "smart-locks",
    family: "access-control-entry",
    name: "Smart locks",
    description: "Lock and unlock your door from your phone, from anywhere.",
    image: img("access-control-entry", "smart-locks"),
  },
  {
    slug: "turnstiles",
    family: "access-control-entry",
    name: "Turnstiles",
    description: "Control entry into busy premises, one person at a time.",
    image: img("access-control-entry", "turnstiles"),
  },
  {
    slug: "gate-automation-motors",
    family: "access-control-entry",
    name: "Gate automation motors",
    description: "Open and close your gate at the press of a button.",
    image: img("access-control-entry", "gate-automation-motors"),
  },
  {
    slug: "video-intercoms",
    family: "access-control-entry",
    name: "Video intercoms",
    description: "See who is at the door before you let them in.",
    image: img("access-control-entry", "video-intercoms"),
  },
  // ---- Network & Connectivity ----
  {
    slug: "network-masts",
    family: "network-connectivity",
    name: "Network masts",
    description: "Raise your network above obstacles for clear, far-reaching signal.",
    image: img("network-connectivity", "network-masts"),
  },
  {
    slug: "point-to-point-radios",
    family: "network-connectivity",
    name: "Point-to-point radios",
    description: "Beam internet between distant buildings or across a farm.",
    image: img("network-connectivity", "point-to-point-radios"),
  },
  {
    slug: "wifi-access-points-mesh",
    family: "network-connectivity",
    name: "WiFi access points & mesh",
    description: "Blanket your home or office in strong, even WiFi.",
    image: img("network-connectivity", "wifi-access-points-mesh"),
  },
  // ---- Fire & Safety ----
  {
    slug: "fire-alarm-panels",
    family: "fire-safety",
    name: "Fire alarm panels",
    description: "The control centre that watches over your fire alarm system.",
    image: img("fire-safety", "fire-alarm-panels"),
  },
  {
    slug: "smoke-heat-detectors",
    family: "fire-safety",
    name: "Smoke & heat detectors",
    description: "Catch smoke and heat early, before a fire spreads.",
    image: img("fire-safety", "smoke-heat-detectors"),
  },
  // ---- Smart Home ----
  {
    slug: "smart-switches",
    family: "smart-home",
    name: "Smart switches",
    description: "Control your lights from your phone or with your voice.",
    image: img("smart-home", "smart-switches"),
  },
  {
    slug: "smart-lighting",
    family: "smart-home",
    name: "Smart lighting",
    description: "Energy-saving bulbs you can dim and schedule from your phone.",
    image: img("smart-home", "smart-lighting"),
  },
];

export const CATALOG_SERVICES: CatalogService[] = [
  {
    slug: "power-audit",
    family: "solar-power",
    name: "Power audit",
    description: "We study your power use and design the right solar size for you.",
    icon: "clipboard",
  },
  {
    slug: "starlink-installation",
    family: "network-connectivity",
    name: "Starlink installation & setup",
    description: "We mount, align and set up your Starlink for fast internet.",
    icon: "satellite",
  },
  {
    slug: "structured-cabling",
    family: "network-connectivity",
    name: "Structured cabling",
    description: "Neat, labelled network cabling for offices and buildings.",
    icon: "network",
  },
];

export const productsByFamily = (familyId: string) =>
  familyId === "all"
    ? CATALOG_PRODUCTS
    : CATALOG_PRODUCTS.filter(p => p.family === familyId);

export const familyLabel = (familyId: string) =>
  CATALOG_FAMILIES.find(f => f.id === familyId)?.label ?? familyId;
