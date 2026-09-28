import { SOLAR_PACKAGES, type SolarPackage } from "@/content/packages";

/** Naira per litre of petrol, confirmed by the business owner (2026-09-28). */
export const FUEL_PRICE_PER_LITRE = 1300;

export const WHATSAPP_NUMBER = "https://wa.me/2348167498489";

export interface Appliance {
  id: string;
  name: string;
  /** Typical power draw in watts — shown openly as an assumption. */
  watts: number;
  defaultHours: number;
}

export const APPLIANCES: Appliance[] = [
  { id: "ac", name: "Air conditioner (1.5HP)", watts: 1200, defaultHours: 8 },
  { id: "fan", name: "Standing / ceiling fan", watts: 75, defaultHours: 12 },
  { id: "tv", name: "LED TV", watts: 100, defaultHours: 6 },
  { id: "fridge", name: "Fridge", watts: 150, defaultHours: 24 },
  { id: "freezer", name: "Deep freezer", watts: 200, defaultHours: 24 },
  { id: "pump", name: "Pumping machine (1HP)", watts: 750, defaultHours: 2 },
  { id: "washer", name: "Washing machine", watts: 500, defaultHours: 2 },
  { id: "microwave", name: "Microwave oven", watts: 1000, defaultHours: 1 },
  { id: "lights", name: "Lighting (10 LED bulbs)", watts: 100, defaultHours: 8 },
  { id: "charging", name: "Phones & laptop charging", watts: 65, defaultHours: 6 },
];

export const HOUR_OPTIONS = [1, 2, 4, 6, 8, 12, 24];
export const MAX_QTY = 10;

/** Usable battery energy per package slug (kWh), from the package catalogue. */
const PACKAGE_BATTERY_KWH: Record<string, number | null> = {
  "power-tank": 1,
  "singles-sos": 2.5,
  "basic-managed": 5,
  "essential-power": 10,
  "moderate-ac-one": 16,
  "moderate-ac-two": 32,
  "premium-comfort": null, // confirmed in the itemised quote
};

export const packageBySlug = (slug: string): SolarPackage =>
  SOLAR_PACKAGES.find(p => p.slug === slug) as SolarPackage;

export interface LoadSelection {
  qty: number;
  hours: number;
}

export type LoadState = Record<string, LoadSelection>;

export function defaultLoadState(): LoadState {
  const state: LoadState = {};
  for (const a of APPLIANCES) state[a.id] = { qty: 0, hours: a.defaultHours };
  return state;
}

export interface SizingResult {
  hasLoad: boolean;
  /** Peak draw in watts, including 25% headroom. */
  peakWatts: number;
  /** Estimated daily energy in Wh. */
  dailyWh: number;
  /** Suggested inverter size in kVA. */
  inverterKva: number;
  /** Suggested usable battery in kWh (20% margin). */
  batteryKwh: number;
  acCount: number;
  hasPump: boolean;
  /** Null when the load needs a custom design. */
  pkg: SolarPackage | null;
  /** True when the matched package's battery is smaller than estimated need. */
  batteryShortfall: boolean;
}

export function computeSizing(load: LoadState): SizingResult {
  let rawPeak = 0;
  let dailyWh = 0;
  let acCount = 0;
  let hasPump = false;

  for (const a of APPLIANCES) {
    const sel = load[a.id];
    if (!sel || sel.qty <= 0) continue;
    rawPeak += a.watts * sel.qty;
    dailyWh += a.watts * sel.qty * sel.hours;
    if (a.id === "ac") acCount += sel.qty;
    if (a.id === "pump") hasPump = true;
  }

  const hasLoad = rawPeak > 0;
  const peakWatts = Math.round(rawPeak * 1.25);
  const inverterKva = peakWatts / 1000;
  const batteryKwh = Math.round(((dailyWh * 1.2) / 1000) * 10) / 10;

  const pkg = matchPackage(inverterKva, acCount, hasPump);
  const pkgBattery = pkg ? PACKAGE_BATTERY_KWH[pkg.slug] : null;
  const batteryShortfall =
    pkg !== null && pkgBattery !== null && batteryKwh > pkgBattery;

  return {
    hasLoad,
    peakWatts,
    dailyWh: Math.round(dailyWh),
    inverterKva: Math.round(inverterKva * 10) / 10,
    batteryKwh,
    acCount,
    hasPump,
    pkg,
    batteryShortfall,
  };
}

function matchPackage(
  inverterKva: number,
  acCount: number,
  hasPump: boolean,
): SolarPackage | null {
  if (acCount >= 3 || inverterKva > 10)
    return inverterKva <= 20 ? packageBySlug("premium-comfort") : null;
  if (acCount === 2) return packageBySlug("moderate-ac-two");
  if (acCount === 1) return packageBySlug("moderate-ac-one");
  if (inverterKva <= 0.5 && !hasPump) return packageBySlug("power-tank");
  if (inverterKva <= 1.5 && !hasPump) return packageBySlug("singles-sos");
  if (inverterKva <= 4) return packageBySlug("basic-managed");
  if (inverterKva <= 6) return packageBySlug("essential-power");
  return packageBySlug("moderate-ac-one");
}

export type FuelPeriod = "daily" | "weekly" | "monthly";

export function fuelToMonthly(amount: number, period: FuelPeriod): number {
  if (period === "daily") return amount * 30;
  if (period === "weekly") return amount * (52 / 12);
  return amount;
}

export interface SavingsResult {
  monthly: number;
  yearly: number;
  litresPerMonth: number;
  paybackMonths: number;
  fiveYearSavings: number;
}

export function computeSavings(
  monthlyFuelSpend: number,
  packagePrice: number,
): SavingsResult {
  const yearly = monthlyFuelSpend * 12;
  return {
    monthly: monthlyFuelSpend,
    yearly,
    litresPerMonth: monthlyFuelSpend / FUEL_PRICE_PER_LITRE,
    paybackMonths: packagePrice / monthlyFuelSpend,
    fiveYearSavings: yearly * 5 - packagePrice,
  };
}

export const formatNaira = (amount: number) =>
  `₦${Math.round(amount).toLocaleString("en-NG")}`;

/** Builds the pre-filled WhatsApp message carrying the customer's plan. */
export function buildPlannerWhatsAppLink(
  load: LoadState,
  sizing: SizingResult,
  pkg: SolarPackage,
  period: FuelPeriod,
  fuelAmount: number,
  savings: SavingsResult | null,
): string {
  const lines: string[] = [
    "Hello G-Tech Consult, I used the solar planner on your website.",
    "",
    "I want to power:",
  ];
  for (const a of APPLIANCES) {
    const sel = load[a.id];
    if (sel && sel.qty > 0)
      lines.push(`- ${sel.qty}x ${a.name} (~${sel.hours}h/day)`);
  }
  lines.push(
    "",
    `Estimated load: ${(sizing.peakWatts / 1000).toFixed(1)}kW peak, ${(sizing.dailyWh / 1000).toFixed(1)}kWh per day`,
    `Recommended: ${pkg.shortTitle} — ${formatNaira(pkg.price)}`,
  );
  if (savings) {
    lines.push(
      `My fuel spend: ${formatNaira(fuelAmount)} ${period}`,
      `Payback: about ${Math.round(savings.paybackMonths)} months`,
    );
  }
  lines.push("", "I'd like a free site assessment.");
  return `${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
