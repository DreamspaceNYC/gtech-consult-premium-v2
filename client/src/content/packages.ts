export type PackageItem = { name: string; spec: string; qty: string };
export type SolarPackage = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
  system: string;
  battery: string;
  panels: string;
  description: string;
  powers: string[];
  notes?: string[];
  items: PackageItem[];
  inclusions: string[];
};

export const SOLAR_PACKAGES: SolarPackage[] = [
  {
    slug: "premium-comfort",
    title: "Premium Comfort Solar Package",
    shortTitle: "Premium Comfort",
    category: "Solar Installation",
    price: 14321800,
    badge: "PREMIUM COMFORT",
    image: "/images/gtech-premium-comfort-packshot_3201fbb7.png",
    system: "20kVA / 48V heavy-duty solar-inverter package",
    battery: "20kWh / 48V lithium battery",
    panels: "24 × 550W monocrystalline solar panels",
    description:
      "A high-capacity system for homes and businesses that want strong daytime performance and dependable overnight support for multiple air conditioners.",
    powers: [
      "3–4 air conditioners during the daytime",
      "2 air conditioners overnight until approximately 5:00 AM",
      "Lighting, TV, fans and other household appliances",
    ],
    items: [
      {
        name: "Pure sine-wave heavy-duty inverter",
        spec: "10KVA / 48V",
        qty: "2",
      },
      { name: "Lithium-ion battery", spec: "20kWh / 48V", qty: "2" },
      { name: "Monocrystalline solar panel", spec: "550W / 48V", qty: "24" },
    ],
    inclusions: [
      "8 solar hangers",
      "60m DTL solar cable (16mm)",
      "AC/DC surge protective devices and breakers",
      "100m 10mm pure copper cable",
      "40m 4mm pure copper cable",
      "Adaptable box, cable trunk and 200A changeover switch",
      "Clips, lugs, sockets, tapes, logistics and transportation",
      "Installation service charge",
    ],
  },
  {
    slug: "moderate-ac-two",
    title: "Moderate AC Solar Package — Two AC",
    shortTitle: "Moderate AC · Two AC",
    category: "Solar Installation",
    price: 9804800,
    badge: "POPULAR",
    image: "/images/gtech-moderate-two-ac-packshot_5157bb61.png",
    system: "10kVA / 48V heavy-duty solar-inverter package",
    battery: "32kWh / 48V lithium battery",
    panels: "16 × 550W monocrystalline solar panels",
    description:
      "A balanced high-capacity system for customers who want to run up to two air conditioners alongside everyday home appliances.",
    powers: [
      "Up to 2 air conditioners day and night",
      "Lights, TV, fans and freezer",
      "Air-conditioning support typically until around 6:00 AM, depending on use",
    ],
    items: [
      {
        name: "Pure sine-wave heavy-duty inverter",
        spec: "10KVA / 48V",
        qty: "1",
      },
      { name: "Lithium-ion battery", spec: "32kWh / 48V", qty: "1" },
      { name: "Monocrystalline solar panel", spec: "550W / 48V", qty: "16" },
    ],
    inclusions: [
      "5 solar hangers",
      "30m DTL solar cable (10mm)",
      "AC/DC surge protective devices and breakers",
      "50m 10mm pure copper cable",
      "20m 4mm pure copper cable",
      "Adaptable box, cable trunk and 200A changeover switch",
      "Clips, lugs, sockets, tapes, logistics and transportation",
      "Installation service charge",
    ],
  },
  {
    slug: "moderate-ac-one",
    title: "Moderate AC Solar Package — One AC",
    shortTitle: "Moderate AC · One AC",
    category: "Solar Installation",
    price: 6672800,
    badge: "ONE-AC SOLUTION",
    image: "/images/gtech-moderate-one-ac-packshot_5edb3f25.png",
    system: "10kVA / 48V heavy-duty solar-inverter package",
    battery: "16kWh / 48V lithium battery",
    panels: "12 × 550W monocrystalline solar panels",
    description:
      "A practical one-air-conditioner system for homes that want dependable power for essential appliances with controlled overnight AC use.",
    powers: [
      "1 air conditioner day and night",
      "Lights, TV, fans, freezer and essential loads",
      "Air conditioning typically until around 1:00–5:00 AM, depending on use",
    ],
    items: [
      {
        name: "Pure sine-wave heavy-duty inverter",
        spec: "10KVA / 48V",
        qty: "1",
      },
      { name: "Lithium-ion battery", spec: "16kWh / 48V", qty: "1" },
      { name: "Monocrystalline solar panel", spec: "550W / 48V", qty: "12" },
    ],
    inclusions: [
      "5 solar hangers",
      "30m DTL solar cable (10mm)",
      "AC/DC surge protective devices and breakers",
      "50m 10mm pure copper cable",
      "20m 4mm pure copper cable",
      "Adaptable box, cable trunk and changeover switch",
      "Clips, lugs, sockets, tapes, logistics and transportation",
      "Installation service charge",
    ],
  },
  {
    slug: "essential-power",
    title: "Essential Power Solar Package",
    shortTitle: "Essential Power",
    category: "Solar Installation",
    price: 4694800,
    badge: "ESSENTIAL POWER",
    image: "/images/gtech-essential-power-packshot_c65bd6fe.png",
    system: "6KVA / 48V heavy-duty hybrid inverter",
    battery: "10kWh / 48V lithium battery",
    panels: "8 × 550W monocrystalline solar panels",
    description:
      "A dependable essential-load system for lights, television, freezer operation and pumping-machine use without air conditioning.",
    powers: [
      "Lights and TV",
      "Freezer overnight until daybreak",
      "Pumping machine",
      "No air conditioner",
    ],
    items: [
      {
        name: "Pure sine-wave heavy-duty hybrid inverter",
        spec: "6KVA / 48V",
        qty: "1",
      },
      { name: "Lithium-ion battery", spec: "10kWh / 48V", qty: "1" },
      { name: "Monocrystalline solar panel", spec: "550W", qty: "8" },
    ],
    inclusions: [
      "Solar hangers",
      "20m DTL solar cable (6mm)",
      "AC/DC and DC/AC surge protection",
      "50m 10mm pure copper cable",
      "20m 4mm pure copper cable",
      "Adaptable box, cable trunk and 100A changeover switch",
      "Clips, lugs, sockets, tapes, screws, binding wire",
      "Installation charge and transportation",
    ],
  },
  {
    slug: "basic-managed",
    title: "Basic Load Solar Package — Managed Usage",
    shortTitle: "Basic Load · Managed",
    category: "Solar Installation",
    price: 2653800,
    badge: "BUDGET FRIENDLY",
    image: "/images/gtech-basic-managed-packshot_266fd39f.png",
    system: "4KVA / 24V heavy-duty hybrid inverter",
    battery: "5kWh lithium battery",
    panels: "4 × 550W monocrystalline solar panels",
    description:
      "A budget-conscious solar system for lights, television, freezer and pumping-machine use with managed daytime loading.",
    powers: [
      "Lights and TV",
      "Freezer and pumping machine",
      "Managed usage is required for overnight power",
    ],
    notes: [
      "To preserve power overnight, the freezer and pumping machine should be switched off by approximately 4:00 PM. Lighting and smaller loads can continue through the night.",
    ],
    items: [
      {
        name: "Pure sine-wave heavy-duty hybrid inverter",
        spec: "4KVA / 24V",
        qty: "1",
      },
      { name: "Lithium-ion battery", spec: "5kWh", qty: "1" },
      { name: "Monocrystalline solar panel", spec: "550W", qty: "4" },
    ],
    inclusions: [
      "Solar hangers",
      "20m DTL solar cable (6mm)",
      "AC/DC and DC/AC surge protection",
      "30m 10mm pure copper cable",
      "20m 4mm pure copper cable",
      "Adaptable box, cable trunk and 100A changeover switch",
      "Clips, lugs, sockets, tapes, screws, washer, bolt, nut, binding wire",
      "Installation charge and transportation",
    ],
  },
  {
    slug: "singles-sos",
    title: "Singles SOS Solar Package",
    shortTitle: "Singles SOS",
    category: "Solar Installation",
    price: 1418000,
    badge: "STARTER PACKAGE",
    image: "/images/gtech-singles-sos-packshot_2bf84abd.png",
    system: "1.5KVA / 24V hybrid solar inverter",
    battery: "2.5kWh lithium battery",
    panels: "3 × 200W monocrystalline solar panels",
    description:
      "A compact starter package for singles, small apartments or customers who need lighting, television, tabletop-freezer and charging power on a controlled budget.",
    powers: ["Lights", "TV", "Tabletop freezer", "Charging sockets"],
    notes: [
      "This is a small-load system. Its intended use is limited to the loads listed above; it is not sized for an air conditioner or pumping machine.",
    ],
    items: [
      {
        name: "Pure sine-wave high-voltage hybrid inverter",
        spec: "1.5KVA / 24V",
        qty: "1",
      },
      { name: "Lithium-ion battery", spec: "2.5kWh", qty: "1" },
      { name: "Monocrystalline solar panel", spec: "200W", qty: "3" },
    ],
    inclusions: [
      "Solar hangers",
      "20m DTL solar cable (6mm)",
      "AC/DC and DC/AC surge protection",
      "30m 4mm pure copper cable",
      "Adaptable box, cable trunk and 100A changeover switch",
      "Clips, lugs, sockets, tapes, screws, washer, bolt, nut, binding wire",
      "Installation charge and transportation",
    ],
  },
  {
    slug: "power-tank",
    title: "I Pass My Neighbour Power Tank",
    shortTitle: "Power Tank",
    category: "Solar Installation",
    price: 661000,
    badge: "LOW-BUDGET POWER",
    image: "/images/gtech-power-tank-packshot_68d1cb2f.png",
    system: "500W / 1kW power tank",
    battery: "Integrated power-tank storage",
    panels: "1 × 500W monocrystalline solar panel",
    description:
      "A handy low-budget power system for lights, television and charging sockets.",
    powers: ["Lights", "TV", "Charging sockets"],
    items: [
      { name: "Power tank", spec: "500W / 1kW", qty: "1" },
      { name: "Monocrystalline solar panel", spec: "500W", qty: "1" },
    ],
    inclusions: [
      "10m DTL solar cable (6mm)",
      "30m 4mm pure copper cable",
      "Adaptable box and 100A changeover switch",
      "Clips, lugs, sockets, tapes, screws, washer, bolt, nut, binding wire and trunk",
      "Installation charge and transportation",
    ],
  },
];

const categories = ["All", "Solar Installation", "CCTV", "Smart Homes"];
