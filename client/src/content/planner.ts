import { SOLAR_PACKAGES, type SolarPackage } from "@/content/packages";

/** Naira per litre of petrol, confirmed by the business owner (2026-09-28). */
export const FUEL_PRICE_PER_LITRE = 1300;

export const WHATSAPP_NUMBER = "https://wa.me/2348167498489";

/** Daytime is 06:00–18:00; everything else counts as night for battery sizing. */
export const DAY_START = 6;
export const DAY_END = 18;

export interface VariantOption {
  label: string;
  watts: number;
}

export interface Appliance {
  id: string;
  name: string;
  variants: VariantOption[];
  defaultVariant: number;
  /** Typical hours per day this appliance runs — the customer can change it. */
  defaultHours: number;
}

export const APPLIANCES: Appliance[] = [
  {
    id: "ac",
    name: "Air conditioner",
    variants: [
      { label: "1HP", watts: 900 },
      { label: "1.5HP", watts: 1200 },
      { label: "2HP", watts: 1800 },
    ],
    defaultVariant: 1,
    defaultHours: 9,
  },
  {
    id: "fan",
    name: "Fan",
    variants: [
      { label: "Table / standing", watts: 75 },
      { label: "Ceiling", watts: 80 },
      { label: "Industrial", watts: 200 },
    ],
    defaultVariant: 0,
    defaultHours: 9,
  },
  {
    id: "tv",
    name: "TV",
    variants: [
      { label: '32"', watts: 60 },
      { label: '43"', watts: 100 },
      { label: '55"+', watts: 150 },
    ],
    defaultVariant: 1,
    defaultHours: 5,
  },
  {
    id: "fridge",
    name: "Fridge",
    variants: [
      { label: "Tabletop", watts: 100 },
      { label: "Medium", watts: 150 },
      { label: "Double door", watts: 250 },
    ],
    defaultVariant: 1,
    defaultHours: 24,
  },
  {
    id: "freezer",
    name: "Deep freezer",
    variants: [
      { label: "Small chest", watts: 150 },
      { label: "Large chest", watts: 250 },
    ],
    defaultVariant: 0,
    defaultHours: 24,
  },
  {
    id: "pump",
    name: "Pumping machine",
    variants: [
      { label: "0.5HP", watts: 400 },
      { label: "1HP", watts: 750 },
      { label: "1.5HP", watts: 1100 },
      { label: "2HP", watts: 1500 },
    ],
    defaultVariant: 1,
    defaultHours: 2,
  },
  {
    id: "washer",
    name: "Washing machine",
    variants: [
      { label: "Top loader", watts: 500 },
      { label: "Front loader", watts: 800 },
      { label: "Front loader + heater", watts: 2000 },
    ],
    defaultVariant: 0,
    defaultHours: 2,
  },
  {
    id: "microwave",
    name: "Microwave oven",
    variants: [
      { label: "Small", watts: 800 },
      { label: "Large", watts: 1200 },
    ],
    defaultVariant: 0,
    defaultHours: 1,
  },
  {
    id: "lights",
    name: "Lighting",
    variants: [
      { label: "5 LED bulbs", watts: 50 },
      { label: "10 LED bulbs", watts: 100 },
      { label: "20 LED bulbs", watts: 200 },
    ],
    defaultVariant: 1,
    defaultHours: 5,
  },
  {
    id: "charging",
    name: "Charging",
    variants: [
      { label: "Phones + laptop", watts: 65 },
      { label: "Desktop setup", watts: 200 },
    ],
    defaultVariant: 0,
    defaultHours: 6,
  },
];

/* ---------- usage pattern (replaces per-appliance on/off times) ---------- */

/**
 * When the customer uses power most. One question for the whole plan —
 * far simpler than setting on/off times per appliance, and it is all the
 * battery sizing needs.
 */
export type UsagePattern = "day" | "mixed" | "night";

export const USAGE_PATTERNS: { id: UsagePattern; label: string }[] = [
  { id: "day", label: "Mostly daytime" },
  { id: "mixed", label: "Day and night" },
  { id: "night", label: "Mostly at night" },
];

export const USAGE_LABEL: Record<UsagePattern, string> = {
  day: "mostly during the day",
  mixed: "day and night",
  night: "mostly at night",
};

/**
 * Share of daily energy assumed to fall at night (18:00–06:00).
 * Drives the battery sizing; the 30% cloudy-day margin still applies.
 */
export const NIGHT_SHARE: Record<UsagePattern, number> = {
  day: 0.3,
  mixed: 0.55,
  night: 0.8,
};

export const DEFAULT_USAGE: UsagePattern = "night";

/**
 * Keyword database for custom appliances: type a name, get its real-world
 * variants (e.g. sewing machine → servo vs clutch motor).
 */
export const VARIANT_DB: { keys: string[]; variants: VariantOption[] }[] = [
  {
    keys: ["sew"],
    variants: [
      { label: "Servo motor", watts: 100 },
      { label: "Clutch / regular motor", watts: 400 },
    ],
  },
  {
    keys: ["aircon", "air con", "a/c", " ac"],
    variants: [
      { label: "1HP", watts: 900 },
      { label: "1.5HP", watts: 1200 },
      { label: "2HP", watts: 1800 },
    ],
  },
  {
    keys: ["pump", "borehole"],
    variants: [
      { label: "0.5HP", watts: 400 },
      { label: "1HP", watts: 750 },
      { label: "1.5HP", watts: 1100 },
      { label: "2HP", watts: 1500 },
    ],
  },
  {
    keys: ["fridge", "refrigerator"],
    variants: [
      { label: "Tabletop", watts: 100 },
      { label: "Medium", watts: 150 },
      { label: "Double door", watts: 250 },
    ],
  },
  {
    keys: ["freezer", "deep freeze", "chest"],
    variants: [
      { label: "Small chest", watts: 150 },
      { label: "Large chest", watts: 250 },
    ],
  },
  {
    keys: ["tv", "television"],
    variants: [
      { label: '32"', watts: 60 },
      { label: '43"', watts: 100 },
      { label: '55"+', watts: 150 },
    ],
  },
  {
    keys: ["fan"],
    variants: [
      { label: "Table / standing", watts: 75 },
      { label: "Ceiling", watts: 80 },
      { label: "Industrial", watts: 200 },
    ],
  },
  {
    keys: ["wash"],
    variants: [
      { label: "Top loader", watts: 500 },
      { label: "Front loader", watts: 800 },
      { label: "Front loader + heater", watts: 2000 },
    ],
  },
  {
    keys: ["microwave"],
    variants: [
      { label: "Small", watts: 800 },
      { label: "Large", watts: 1200 },
    ],
  },
  {
    keys: ["iron"],
    variants: [
      { label: "Dry iron", watts: 1000 },
      { label: "Steam iron", watts: 1500 },
    ],
  },
  {
    keys: ["laptop", "computer", "desktop"],
    variants: [
      { label: "Laptop", watts: 65 },
      { label: "Desktop", watts: 200 },
    ],
  },
  {
    keys: ["bulb", "light"],
    variants: [
      { label: "5 LED bulbs", watts: 50 },
      { label: "10 LED bulbs", watts: 100 },
      { label: "20 LED bulbs", watts: 200 },
    ],
  },
];

/** Fallback when a custom name matches nothing we know. */
export const SIZE_BANDS: VariantOption[] = [
  { label: "Small — like a phone charger", watts: 50 },
  { label: "Medium — like a TV or fan", watts: 200 },
  { label: "Large — like a fridge or pump", watts: 800 },
  { label: "Heavy — like an AC or cooker", watts: 1500 },
];

/** Find variant options for a typed appliance name, or null if unknown. */
export function matchVariants(name: string): VariantOption[] | null {
  const n = ` ${name.toLowerCase().trim()} `;
  if (n.trim().length < 2) return null;
  for (const entry of VARIANT_DB) {
    if (entry.keys.some(k => n.includes(k))) return entry.variants;
  }
  return null;
}

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

/** What the customer sets per appliance: how many, which type, how long on. */
export interface LoadSelection {
  qty: number;
  variant: number;
  /** Hours the appliance runs per day (0–24). */
  hours: number;
}

export type LoadState = Record<string, LoadSelection>;

export interface CustomAppliance {
  id: string;
  name: string;
  variantLabel: string;
  watts: number;
  qty: number;
  /** Hours the appliance runs per day (0–24). */
  hours: number;
}

export const MAX_CUSTOM = 6;
export const MAX_QTY = 10;
export const MAX_HOURS = 24;

export function defaultLoadState(): LoadState {
  const state: LoadState = {};
  for (const a of APPLIANCES)
    state[a.id] = { qty: 0, variant: a.defaultVariant, hours: a.defaultHours };
  return state;
}

/** Hours per day from on/off times. Same time = runs 24 hours. (Legacy.) */
export function hoursBetween(on: number, off: number): number {
  if (on === off) return 24;
  return (off - on + 24) % 24;
}

function isNightHour(h: number): boolean {
  return h >= DAY_END || h < DAY_START;
}

function isActiveAt(h: number, on: number, off: number): boolean {
  if (on === off) return true;
  if (on < off) return h >= on && h < off;
  return h >= on || h < off;
}

/** How many of the appliance's daily hours fall at night (18:00–06:00). (Legacy.) */
export function nightHours(on: number, off: number): number {
  let n = 0;
  for (let h = 0; h < 24; h++)
    if (isActiveAt(h, on, off) && isNightHour(h)) n++;
  return n;
}

/** "21" -> "9pm", "0" -> "12am". (Legacy.) */
export function fmtHour(h: number): string {
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

export const HOUR_LABELS: string[] = Array.from(
  { length: 24 },
  (_, h) => fmtHour(h),
);

export interface SizingResult {
  hasLoad: boolean;
  /** Peak draw in watts, including 25% headroom. */
  peakWatts: number;
  /** Estimated daily energy in Wh. */
  dailyWh: number;
  /** Estimated night-time energy in Wh (drives battery sizing). */
  nightWh: number;
  /** Suggested inverter size in kVA. */
  inverterKva: number;
  /** Suggested usable battery in kWh (30% cloudy-day margin on night load). */
  batteryKwh: number;
  acCount: number;
  hasPump: boolean;
  /** Null when the load needs a custom design. */
  pkg: SolarPackage | null;
  /** True when the matched package's battery is smaller than estimated need. */
  batteryShortfall: boolean;
}

export function computeSizing(
  load: LoadState,
  customs: CustomAppliance[],
  usage: UsagePattern = DEFAULT_USAGE,
): SizingResult {
  let rawPeak = 0;
  let dailyWh = 0;
  let acCount = 0;
  let hasPump = false;

  const add = (
    watts: number,
    qty: number,
    hours: number,
    isAc: boolean,
    isPump: boolean,
  ) => {
    if (qty <= 0 || watts <= 0 || hours <= 0) return;
    rawPeak += watts * qty;
    dailyWh += watts * qty * hours;
    if (isAc) acCount += qty;
    if (isPump) hasPump = true;
  };

  for (const a of APPLIANCES) {
    const sel = load[a.id];
    if (!sel) continue;
    const watts = a.variants[sel.variant]?.watts ?? 0;
    add(watts, sel.qty, sel.hours, a.id === "ac", a.id === "pump");
  }
  for (const c of customs)
    add(c.watts, c.qty, c.hours, false, /pump|borehole/i.test(c.name));

  const hasLoad = rawPeak > 0;
  const peakWatts = Math.round(rawPeak * 1.25);
  const inverterKva = peakWatts / 1000;
  const nightWh = Math.round(dailyWh * NIGHT_SHARE[usage]);
  const batteryKwh = Math.round(((nightWh * 1.3) / 1000) * 10) / 10;

  const pkg = matchPackage(inverterKva, acCount, hasPump);
  const pkgBattery = pkg ? PACKAGE_BATTERY_KWH[pkg.slug] : null;
  const batteryShortfall =
    pkg !== null && pkgBattery !== null && batteryKwh > pkgBattery;

  return {
    hasLoad,
    peakWatts,
    dailyWh: Math.round(dailyWh),
    nightWh,
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

/** Subtle haptic pulse on supported devices (Android). Silent no-op elsewhere. */
export function buzz(ms = 12): void {
  try {
    (navigator as Navigator & { vibrate?: (p: number) => boolean }).vibrate?.(
      ms,
    );
  } catch {
    /* not supported — animations carry the feedback */
  }
}

function describeSelection(
  lines: string[],
  qty: number,
  name: string,
  hours: number,
): void {
  if (qty > 0)
    lines.push(`- ${qty}x ${name}, ${hours}h per day`);
}

/* ---------- shareable plans ---------- */

export interface PlanSnapshot {
  load: LoadState;
  customs: CustomAppliance[];
  usage: UsagePattern;
  period: FuelPeriod;
  fuelAmount: string;
}

const b64urlEncode = (json: string): string => {
  const bin = encodeURIComponent(json).replace(
    /%([0-9A-F]{2})/g,
    (_, h: string) => String.fromCharCode(parseInt(h, 16)),
  );
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

const b64urlDecode = (code: string): string => {
  const b64 = code.replaceAll("-", "+").replaceAll("_", "/");
  const bin = atob(b64);
  return decodeURIComponent(
    Array.from(bin)
      .map(ch => `%${ch.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
};

function asUsage(v: unknown): UsagePattern {
  return v === "day" || v === "mixed" || v === "night" ? v : DEFAULT_USAGE;
}

/** Compact the customer's plan into a URL-safe string for sharing. */
export function encodePlan(
  load: LoadState,
  customs: CustomAppliance[],
  usage: UsagePattern,
  period: FuelPeriod,
  fuelAmount: string,
): string {
  const compact = {
    v: 2,
    l: APPLIANCES.map(a => {
      const s = load[a.id];
      return s && s.qty > 0 ? [s.qty, s.variant, s.hours] : 0;
    }),
    c: customs
      .filter(c => c.qty > 0 && c.watts > 0)
      .map(c => [c.name, c.watts, c.qty, c.hours]),
    u: usage,
    p: period,
    f: fuelAmount || "",
  };
  return b64urlEncode(JSON.stringify(compact));
}

/** Restore a plan from a shared URL code. Returns null when invalid. */
export function decodePlan(code: string): PlanSnapshot | null {
  try {
    const raw = JSON.parse(b64urlDecode(code)) as {
      v?: unknown;
      l?: unknown;
      c?: unknown;
      u?: unknown;
      p?: unknown;
      f?: unknown;
    };
    const v2 = raw.v === 2;
    const load = defaultLoadState();
    if (Array.isArray(raw.l)) {
      APPLIANCES.forEach((a, i) => {
        const v = (raw.l as unknown[])[i];
        if (Array.isArray(v) && Number(v[0]) > 0) {
          const hours = v2
            ? Math.min(MAX_HOURS, Math.max(0, Math.round(Number(v[2]) || 0)))
            : hoursBetween(
                Math.min(23, Math.max(0, Number(v[2]) || 0)),
                Math.min(23, Math.max(0, Number(v[3]) || 0)),
              );
          load[a.id] = {
            qty: Math.min(MAX_QTY, Math.max(0, Number(v[0]) | 0)),
            variant: Math.min(
              a.variants.length - 1,
              Math.max(0, Number(v[1]) | 0),
            ),
            hours,
          };
        }
      });
    }
    const customs: CustomAppliance[] = Array.isArray(raw.c)
      ? (raw.c as unknown[]).slice(0, MAX_CUSTOM).map((c, i) => {
          const parts = Array.isArray(c) ? c : [];
          const watts = Math.max(0, Number(parts[1]) || 0);
          const hours = v2
            ? Math.min(MAX_HOURS, Math.max(0, Math.round(Number(parts[3]) || 0)))
            : hoursBetween(
                Math.min(23, Math.max(0, Number(parts[3]) || 0)),
                Math.min(23, Math.max(0, Number(parts[4]) || 0)),
              );
          return {
            id: `shared-${i}`,
            name: String(parts[0] ?? "Custom appliance").slice(0, 60),
            variantLabel: `${watts}W`,
            watts,
            qty: Math.min(MAX_QTY, Math.max(1, Number(parts[2]) || 1)),
            hours,
          };
        })
      : [];
    const period: FuelPeriod =
      raw.p === "daily" || raw.p === "weekly" || raw.p === "monthly"
        ? raw.p
        : "monthly";
    return {
      load,
      customs,
      usage: asUsage(raw.u),
      period,
      fuelAmount: String(raw.f ?? ""),
    };
  } catch {
    return null;
  }
}

/** Canonical share URL for an encoded plan. */
export function planShareUrl(code: string): string {
  return `https://gtechconsult.ng/solar-planner/?plan=${code}`;
}

/** Plain-text summary of the plan, for copy/share (WhatsApp link wraps this). */
export function buildPlannerMessage(
  load: LoadState,
  customs: CustomAppliance[],
  usage: UsagePattern,
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
    if (!sel) continue;
    const v = a.variants[sel.variant];
    describeSelection(lines, sel.qty, `${a.name} (${v?.label ?? ""})`, sel.hours);
  }
  for (const c of customs)
    describeSelection(lines, c.qty, `${c.name} (${c.variantLabel})`, c.hours);
  lines.push(
    "",
    `We use power ${USAGE_LABEL[usage]}.`,
    `Estimated load: ${(sizing.peakWatts / 1000).toFixed(1)}kW peak, ${(sizing.dailyWh / 1000).toFixed(1)}kWh per day (${(sizing.nightWh / 1000).toFixed(1)}kWh at night)`,
    `Recommended: ${pkg.shortTitle} — ${formatNaira(pkg.price)}`,
  );
  if (savings) {
    lines.push(
      `My fuel spend: ${formatNaira(fuelAmount)} ${period}`,
      `Payback: about ${Math.round(savings.paybackMonths)} months`,
    );
  }
  lines.push("", "I'd like a free site assessment.");
  return lines.join("\n");
}

/** Builds the pre-filled WhatsApp message carrying the customer's plan. */
export function buildPlannerWhatsAppLink(
  load: LoadState,
  customs: CustomAppliance[],
  usage: UsagePattern,
  sizing: SizingResult,
  pkg: SolarPackage,
  period: FuelPeriod,
  fuelAmount: number,
  savings: SavingsResult | null,
): string {
  const text = buildPlannerMessage(
    load,
    customs,
    usage,
    sizing,
    pkg,
    period,
    fuelAmount,
    savings,
  );
  return `${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
