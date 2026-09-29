import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Link2,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  X,
} from "lucide-react";
import {
  APPLIANCES,
  DEFAULT_USAGE,
  FUEL_PRICE_PER_LITRE,
  MAX_CUSTOM,
  MAX_HOURS,
  MAX_QTY,
  SIZE_BANDS,
  USAGE_LABEL,
  USAGE_PATTERNS,
  buzz,
  buildPlannerMessage,
  buildPlannerWhatsAppLink,
  computeSavings,
  computeSizing,
  decodePlan,
  defaultLoadState,
  encodePlan,
  formatNaira,
  fuelToMonthly,
  matchVariants,
  packageBySlug,
  planShareUrl,
  type Appliance,
  type CustomAppliance,
  type FuelPeriod,
  type LoadState,
  type LoadSelection,
  type PlanSnapshot,
  type UsagePattern,
  type VariantOption,
} from "@/content/planner";
import { SOLAR_PACKAGES } from "@/content/packages";
import { ASSESSMENT_URL } from "@/content/business";

const PERIODS: { id: FuelPeriod; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const MANUAL_OPTION: VariantOption = { label: "Type exact watts…", watts: -1 };

/* ---------- animation helpers ---------- */

function useCountUp(target: number, duration = 700): number {
  const [val, setVal] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      prevRef.current = target;
      return;
    }
    const from = prevRef.current;
    if (from === target) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    };
    const to = target;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function CountUp({
  value,
  format,
}: {
  value: number;
  format: (v: number) => string;
}) {
  return <>{format(useCountUp(value))}</>;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal${visible ? " visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- steppers & rows ---------- */

function Stepper({
  value,
  onChange,
  label,
  max = MAX_QTY,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  max?: number;
}) {
  const step = (d: number) => {
    buzz(10);
    onChange(Math.max(0, Math.min(max, value + d)));
  };
  return (
    <div className="planner-stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= 0}
        aria-label={`Less ${label}`}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={value >= max}
        aria-label={`More ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function ApplianceRow({
  appliance,
  sel,
  onChange,
}: {
  appliance: Appliance;
  sel: LoadSelection;
  onChange: (sel: LoadSelection) => void;
}) {
  const watts = appliance.variants[sel.variant]?.watts ?? 0;
  return (
    <div className="planner-appliance">
      <div className="planner-appliance-top">
        <div className="planner-appliance-info">
          <span className="planner-appliance-name">{appliance.name}</span>
          <span className="planner-appliance-watts">
            ≈{watts.toLocaleString("en-NG")}W each
          </span>
        </div>
        <div className="planner-qty">
          <span className="planner-field-tag">How many?</span>
          <Stepper
            value={sel.qty}
            onChange={qty => onChange({ ...sel, qty })}
            label={appliance.name}
          />
        </div>
      </div>
      <div className="planner-appliance-bottom">
        <label className="planner-variant">
          <span className="planner-field-tag">Type</span>
          <select
            value={sel.variant}
            onChange={e => {
              buzz(8);
              onChange({ ...sel, variant: Number(e.target.value) });
            }}
            aria-label={`Type of ${appliance.name}`}
          >
            {appliance.variants.map((v, i) => (
              <option key={i} value={i}>
                {v.label} (~{v.watts.toLocaleString("en-NG")}W)
              </option>
            ))}
          </select>
        </label>
        <div className="planner-hours">
          <span className="planner-field-tag">On for</span>
          <Stepper
            value={sel.hours}
            max={MAX_HOURS}
            onChange={hours => onChange({ ...sel, hours })}
            label={`hours per day for ${appliance.name}`}
          />
          <span className="planner-hours-unit">hrs/day</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- custom appliances ---------- */

interface CustomDraft {
  id: string;
  name: string;
  qty: number;
  hours: number;
  variantIdx: number;
  manualWatts: string;
  /** True when the user typed exact watts (or a shared plan fixed them). */
  manual: boolean;
}

function customOptions(name: string): VariantOption[] {
  return [...(matchVariants(name) ?? SIZE_BANDS), MANUAL_OPTION];
}

function resolveCustom(d: CustomDraft): { watts: number; label: string } {
  if (d.manual) {
    const w = Math.max(0, Math.floor(Number(d.manualWatts) || 0));
    return { watts: w, label: w > 0 ? `${w}W` : "custom" };
  }
  const opts = customOptions(d.name);
  const opt = opts[Math.min(d.variantIdx, opts.length - 1)];
  if (opt.watts === -1) {
    const w = Math.max(0, Math.floor(Number(d.manualWatts) || 0));
    return { watts: w, label: w > 0 ? `${w}W` : "custom" };
  }
  return { watts: opt.watts, label: opt.label };
}

function CustomRow({
  draft,
  onChange,
  onRemove,
}: {
  draft: CustomDraft;
  onChange: (d: CustomDraft) => void;
  onRemove: () => void;
}) {
  const opts = customOptions(draft.name);
  const manualIdx = opts.length - 1;
  const selectedIdx = Math.min(draft.variantIdx, manualIdx);
  const isManual = draft.manual || opts[selectedIdx].watts === -1;

  const setName = (name: string) => {
    const before = JSON.stringify(
      (matchVariants(draft.name) ?? []).map(v => v.label),
    );
    const after = JSON.stringify((matchVariants(name) ?? []).map(v => v.label));
    const reset = before !== after;
    onChange({
      ...draft,
      name,
      variantIdx: reset ? 0 : draft.variantIdx,
      manualWatts: reset ? "" : draft.manualWatts,
      manual: reset ? false : draft.manual,
    });
  };

  const setVariantIdx = (idx: number) => {
    buzz(8);
    onChange({
      ...draft,
      variantIdx: idx,
      manual: idx === manualIdx ? true : draft.manual,
    });
  };

  return (
    <div className="planner-appliance planner-custom">
      <div className="planner-appliance-top">
        <input
          className="planner-custom-name"
          type="text"
          placeholder="e.g. Sewing machine"
          value={draft.name}
          onChange={e => setName(e.target.value)}
          aria-label="Appliance name"
        />
        <div className="planner-custom-actions">
          <div className="planner-qty">
            <span className="planner-field-tag">How many?</span>
            <Stepper
              value={draft.qty}
              onChange={qty => onChange({ ...draft, qty })}
              label={draft.name || "custom appliance"}
            />
          </div>
          <button
            type="button"
            className="planner-remove"
            onClick={() => {
              buzz(10);
              onRemove();
            }}
            aria-label="Remove this appliance"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="planner-appliance-bottom">
        {!draft.manual && (
          <label className="planner-variant">
            <span className="planner-field-tag">Type</span>
            <select
              value={selectedIdx}
              onChange={e => setVariantIdx(Number(e.target.value))}
              aria-label="Type or size"
            >
              {opts.map((v, i) => (
                <option key={i} value={i}>
                  {v.watts === -1
                    ? v.label
                    : `${v.label} (~${v.watts.toLocaleString("en-NG")}W)`}
                </option>
              ))}
            </select>
          </label>
        )}
        {isManual && (
          <label className="planner-manual-watts">
            <span className="visually-hidden">Watts</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Watts"
              value={draft.manualWatts}
              onChange={e => onChange({ ...draft, manualWatts: e.target.value })}
              aria-label="Watts from the appliance sticker"
            />
            <span className="planner-w">W</span>
            {draft.manual && draft.name.trim().length > 1 && (
              <button
                type="button"
                className="planner-manual-back"
                onClick={() => {
                  buzz(8);
                  onChange({ ...draft, manual: false, variantIdx: 0 });
                }}
              >
                types ›
              </button>
            )}
          </label>
        )}
        <div className="planner-hours">
          <span className="planner-field-tag">On for</span>
          <Stepper
            value={draft.hours}
            max={MAX_HOURS}
            onChange={hours => onChange({ ...draft, hours })}
            label={`hours per day for ${draft.name || "custom appliance"}`}
          />
          <span className="planner-hours-unit">hrs/day</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- usage pattern ---------- */

function UsagePicker({
  value,
  onChange,
}: {
  value: UsagePattern;
  onChange: (u: UsagePattern) => void;
}) {
  return (
    <div className="planner-usage">
      <p className="planner-usage-label">When do you use power most?</p>
      <div
        className="planner-usage-chips"
        role="group"
        aria-label="When do you use power most?"
      >
        {USAGE_PATTERNS.map(u => (
          <button
            key={u.id}
            type="button"
            className={
              value === u.id
                ? "planner-usage-chip active"
                : "planner-usage-chip"
            }
            onClick={() => {
              buzz(10);
              onChange(u.id);
            }}
            aria-pressed={value === u.id}
          >
            {u.label}
          </button>
        ))}
      </div>
      <p className="planner-usage-hint">
        This sets your battery size — most homes use power {USAGE_LABEL.night}.
      </p>
    </div>
  );
}

/* ---------- share ---------- */

function SharePlan({
  load,
  customs,
  usage,
  period,
  fuelAmount,
}: {
  load: LoadState;
  customs: CustomAppliance[];
  usage: UsagePattern;
  period: FuelPeriod;
  fuelAmount: string;
}) {
  const [copied, setCopied] = useState(false);
  const code = encodePlan(load, customs, usage, period, fuelAmount);
  const url = planShareUrl(code);
  const text = "I planned my solar with G-Tech Consult — see the size I need:";

  const copyLink = async () => {
    buzz(10);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="planner-share">
      <p className="planner-share-title">
        <Share2 size={14} /> Share your plan
      </p>
      <div className="planner-share-buttons">
        <a
          className="planner-share-btn"
          href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => buzz(10)}
        >
          WhatsApp
        </a>
        <a
          className="planner-share-btn"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => buzz(10)}
        >
          Facebook
        </a>
        <a
          className="planner-share-btn"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => buzz(10)}
        >
          X
        </a>
        <button
          type="button"
          className="planner-share-btn"
          onClick={copyLink}
        >
          {copied ? (
            <>
              <Check size={13} /> Copied!
            </>
          ) : (
            <>
              <Link2 size={13} /> Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------- main section ---------- */

function readSharedPlan(shareable: boolean): PlanSnapshot | null {
  if (!shareable || typeof window === "undefined") return null;
  const code = new URLSearchParams(window.location.search).get("plan");
  return code ? decodePlan(code) : null;
}

/**
 * "Plan your solar" — step 1 sizes the system from the customer's
 * appliances (how many, which type, how long each runs per day, plus
 * when power is used most), step 2 compares the recommended package
 * against generator fuel spending.
 *
 * Pass `shareable` on the dedicated /solar-planner page: it hydrates
 * from ?plan= links and shows share buttons.
 */
export function SolarPlanner({ shareable = false }: { shareable?: boolean }) {
  const [shared] = useState<PlanSnapshot | null>(() => readSharedPlan(shareable));
  const [load, setLoad] = useState<LoadState>(
    () => shared?.load ?? defaultLoadState(),
  );
  const [usage, setUsage] = useState<UsagePattern>(
    () => shared?.usage ?? DEFAULT_USAGE,
  );
  const [drafts, setDrafts] = useState<CustomDraft[]>(() =>
    (shared?.customs ?? []).map(c => ({
      id: c.id,
      name: c.name === "Custom appliance" ? "" : c.name,
      qty: c.qty,
      hours: c.hours,
      variantIdx: 0,
      manualWatts: String(c.watts),
      manual: true,
    })),
  );
  const [period, setPeriod] = useState<FuelPeriod>(shared?.period ?? "monthly");
  const [fuelAmount, setFuelAmount] = useState(shared?.fuelAmount ?? "");
  const [pkgOverride, setPkgOverride] = useState<string>("");
  const [planCopied, setPlanCopied] = useState(false);
  const idRef = useRef(0);

  const customs: CustomAppliance[] = useMemo(
    () =>
      drafts.map(d => {
        const r = resolveCustom(d);
        return {
          id: d.id,
          name: d.name.trim() || "Custom appliance",
          variantLabel: r.label,
          watts: r.watts,
          qty: d.qty,
          hours: d.hours,
        };
      }),
    [drafts],
  );

  const sizing = useMemo(
    () => computeSizing(load, customs, usage),
    [load, customs, usage],
  );
  const pkg = pkgOverride ? packageBySlug(pkgOverride) : sizing.pkg;

  const fuelNumber = Number(fuelAmount) || 0;
  const monthlyFuel = fuelToMonthly(fuelNumber, period);
  const savings =
    monthlyFuel > 0 && pkg ? computeSavings(monthlyFuel, pkg.price) : null;

  const setSel = (id: string, sel: LoadSelection) =>
    setLoad(prev => ({ ...prev, [id]: sel }));

  const addCustom = () => {
    if (drafts.length >= MAX_CUSTOM) return;
    buzz(15);
    idRef.current += 1;
    setDrafts(prev => [
      ...prev,
      {
        id: `custom-${idRef.current}`,
        name: "",
        qty: 1,
        hours: 8,
        variantIdx: 0,
        manualWatts: "",
        manual: false,
      },
    ]);
  };

  const copyPlanText = async () => {
    if (!sizing.hasLoad || !pkg) return;
    buzz(10);
    const text = buildPlannerMessage(
      load,
      customs,
      usage,
      sizing,
      pkg,
      period,
      fuelNumber,
      savings,
    );
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setPlanCopied(true);
    window.setTimeout(() => setPlanCopied(false), 2000);
  };

  const waLink =
    sizing.hasLoad && pkg
      ? buildPlannerWhatsAppLink(
          load,
          customs,
          usage,
          sizing,
          pkg,
          period,
          fuelNumber,
          savings,
        )
      : null;

  return (
    <section className="solar-planner" aria-labelledby="planner-heading">
      <div className="container">
        <Reveal>
          <div className="section-heading">
            <p className="page-eyebrow">Solar planner</p>
            <h2 id="planner-heading">Plan your solar</h2>
            <p className="gallery-sub">
              Tell us what you want to power — choose each appliance, how many
              you have, and how long it runs each day. We will size the
              system, match it to a real G-Tech package, and show you what it
              saves you.
            </p>
            {!shareable && (
              <p className="planner-open-full">
                <a href="/solar-planner/">
                  Open the full solar planner with sharing and FAQs →
                </a>
              </p>
            )}
            {shared && (
              <p className="planner-shared-note">
                You're viewing a shared solar plan — tweak anything and make
                it yours.
              </p>
            )}
          </div>
        </Reveal>

        {/* Step 1 — appliances */}
        <Reveal delay={80}>
          <div className="planner-card">
            <p className="planner-step">Step 1 — What do you want to power?</p>
            <div className="planner-appliances">
              {APPLIANCES.map(a => (
                <ApplianceRow
                  key={a.id}
                  appliance={a}
                  sel={load[a.id]}
                  onChange={sel => setSel(a.id, sel)}
                />
              ))}
              {drafts.map(d => (
                <CustomRow
                  key={d.id}
                  draft={d}
                  onChange={nd =>
                    setDrafts(prev => prev.map(p => (p.id === d.id ? nd : p)))
                  }
                  onRemove={() =>
                    setDrafts(prev => prev.filter(p => p.id !== d.id))
                  }
                />
              ))}
            </div>
            {drafts.length < MAX_CUSTOM && (
              <button
                type="button"
                className="planner-add"
                onClick={addCustom}
              >
                <Plus size={15} /> Add your own appliance
              </button>
            )}

            <UsagePicker value={usage} onChange={setUsage} />

            {sizing.hasLoad ? (
              <div className="planner-result">
                <div className="planner-result-stats">
                  <div>
                    <span className="planner-stat-value">
                      <CountUp
                        value={sizing.peakWatts / 1000}
                        format={v => `${v.toFixed(1)}kW`}
                      />
                    </span>
                    <span className="planner-stat-label">peak load</span>
                  </div>
                  <div>
                    <span className="planner-stat-value">
                      <CountUp
                        value={sizing.dailyWh / 1000}
                        format={v => `${v.toFixed(1)}kWh`}
                      />
                    </span>
                    <span className="planner-stat-label">per day</span>
                  </div>
                  <div>
                    <span className="planner-stat-value">
                      <CountUp
                        value={sizing.nightWh / 1000}
                        format={v => `${v.toFixed(1)}kWh`}
                      />
                    </span>
                    <span className="planner-stat-label">used at night</span>
                  </div>
                  <div>
                    <span className="planner-stat-value">
                      <CountUp
                        value={sizing.inverterKva}
                        format={v => `${v.toFixed(1)}kVA`}
                      />
                    </span>
                    <span className="planner-stat-label">inverter needed</span>
                  </div>
                  <div>
                    <span className="planner-stat-value">
                      <CountUp
                        value={sizing.batteryKwh}
                        format={v => `${v.toFixed(1)}kWh`}
                      />
                    </span>
                    <span className="planner-stat-label">battery needed</span>
                  </div>
                </div>
                {pkg ? (
                  <div className="planner-package" key={pkg.slug}>
                    <div>
                      <p className="planner-package-kicker">
                        Recommended package
                      </p>
                      <p className="planner-package-name">{pkg.title}</p>
                      <p className="planner-package-spec">
                        {pkg.system} · {pkg.battery}
                      </p>
                      {sizing.batteryShortfall && (
                        <p className="planner-note">
                          Your night-time battery need is above this package's
                          standard battery — we will confirm the right battery
                          size at your free assessment.
                        </p>
                      )}
                    </div>
                    <p className="planner-package-price">
                      <CountUp value={pkg.price} format={v => formatNaira(v)} />
                    </p>
                  </div>
                ) : (
                  <p className="planner-note">
                    Your load is larger than our standard packages — it needs a
                    custom design. Send us your plan on WhatsApp and we will
                    size it properly, free.
                  </p>
                )}
              </div>
            ) : (
              <p className="planner-hint">
                Tap + on the appliances you want your solar to power, then set
                how long each one runs per day.
              </p>
            )}
          </div>
        </Reveal>

        {/* Step 2 — fuel savings */}
        <Reveal delay={80}>
          <div className="planner-card">
            <p className="planner-step">Step 2 — What will you save?</p>
            <div className="planner-fuel-row">
              <div
                className="planner-periods"
                role="group"
                aria-label="How do you measure your fuel spending?"
              >
                {PERIODS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={
                      period === p.id
                        ? "planner-period active"
                        : "planner-period"
                    }
                    onClick={() => {
                      buzz(10);
                      setPeriod(p.id);
                    }}
                    aria-pressed={period === p.id}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <label className="planner-fuel-input">
                <span className="visually-hidden">
                  How much do you spend on fuel ({period})?
                </span>
                <span className="planner-naira">₦</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder={
                    period === "daily"
                      ? "e.g. 5,000"
                      : period === "weekly"
                        ? "e.g. 35,000"
                        : "e.g. 150,000"
                  }
                  value={fuelAmount}
                  onChange={e => setFuelAmount(e.target.value)}
                />
                <span className="planner-per">/ {period}</span>
              </label>
            </div>

            <label className="planner-package-select">
              <span>Compare against</span>
              <select
                value={pkgOverride || pkg?.slug || ""}
                onChange={e => {
                  buzz(8);
                  setPkgOverride(e.target.value);
                }}
              >
                {sizing.pkg ? (
                  <option value="">
                    Recommended: {sizing.pkg.shortTitle} (
                    {formatNaira(sizing.pkg.price)})
                  </option>
                ) : (
                  <option value="">Select a package to compare</option>
                )}
                {SOLAR_PACKAGES.map(p => (
                  <option key={p.slug} value={p.slug}>
                    {p.shortTitle} ({formatNaira(p.price)})
                  </option>
                ))}
              </select>
            </label>

            {savings && pkg ? (
              <div className="planner-result">
                <div className="planner-result-stats">
                  <div>
                    <span className="planner-stat-value">
                      <CountUp value={savings.monthly} format={v => formatNaira(v)} />
                    </span>
                    <span className="planner-stat-label">fuel / month</span>
                  </div>
                  <div>
                    <span className="planner-stat-value">
                      <CountUp value={savings.yearly} format={v => formatNaira(v)} />
                    </span>
                    <span className="planner-stat-label">fuel / year</span>
                  </div>
                  <div>
                    <span className="planner-stat-value">
                      <CountUp
                        value={savings.litresPerMonth}
                        format={v =>
                          `${Math.round(v).toLocaleString("en-NG")}L`
                        }
                      />
                    </span>
                    <span className="planner-stat-label">burned / month</span>
                  </div>
                  <div>
                    <span className="planner-stat-value">
                      <CountUp
                        value={savings.paybackMonths}
                        format={v => `~${Math.round(v)} mo`}
                      />
                    </span>
                    <span className="planner-stat-label">payback time</span>
                  </div>
                </div>
                <p
                  className={
                    savings.fiveYearSavings >= 0
                      ? "planner-savings positive"
                      : "planner-savings"
                  }
                >
                  {savings.fiveYearSavings >= 0 ? (
                    <>
                      You save about{" "}
                      <strong>
                        <CountUp
                          value={savings.fiveYearSavings}
                          format={v => formatNaira(v)}
                        />
                      </strong>{" "}
                      over 5 years with the {pkg.shortTitle} at{" "}
                      {formatNaira(pkg.price)}.
                    </>
                  ) : (
                    <>
                      At this fuel spend the {pkg.shortTitle} takes about{" "}
                      {Math.round(savings.paybackMonths / 12)} years to pay
                      back — a smaller package or our free assessment may suit
                      you better.
                    </>
                  )}
                </p>
                <p className="planner-note">
                  Based on ₦{FUEL_PRICE_PER_LITRE.toLocaleString("en-NG")} per
                  litre. Generator servicing and repair costs are not included
                  — real savings are higher.
                </p>
              </div>
            ) : (
              <p className="planner-hint">
                Enter what you spend on fuel to see your payback time and
                5-year savings.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="planner-cta">
            {waLink ? (
              <>
                <a
                  className="store-button green"
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => buzz(25)}
                >
                  <MessageCircle size={17} /> Send my plan on WhatsApp
                </a>
                <button
                  type="button"
                  className="planner-copy-btn"
                  onClick={copyPlanText}
                >
                  {planCopied ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy my plan
                    </>
                  )}
                </button>
              </>
            ) : (
              <a
                className="store-button green"
                href={ASSESSMENT_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => buzz(25)}
              >
                <MessageCircle size={17} /> Book a free site assessment
              </a>
            )}
          </div>
          {shareable && sizing.hasLoad && (
            <Reveal delay={40}>
              <SharePlan
                load={load}
                customs={customs}
                usage={usage}
                period={period}
                fuelAmount={fuelAmount}
              />
            </Reveal>
          )}
        </Reveal>
      </div>
    </section>
  );
}
