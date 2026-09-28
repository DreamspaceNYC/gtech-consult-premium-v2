import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Minus, Plus, X } from "lucide-react";
import {
  APPLIANCES,
  FUEL_PRICE_PER_LITRE,
  HOUR_LABELS,
  MAX_CUSTOM,
  MAX_QTY,
  SIZE_BANDS,
  buzz,
  buildPlannerWhatsAppLink,
  computeSavings,
  computeSizing,
  defaultLoadState,
  fmtHour,
  formatNaira,
  fuelToMonthly,
  hoursBetween,
  matchVariants,
  packageBySlug,
  type Appliance,
  type CustomAppliance,
  type FuelPeriod,
  type LoadState,
  type LoadSelection,
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
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const step = (d: number) => {
    buzz(10);
    onChange(Math.max(0, Math.min(MAX_QTY, value + d)));
  };
  return (
    <div className="planner-stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= 0}
        aria-label={`Fewer ${label}`}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={value >= MAX_QTY}
        aria-label={`More ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function TimeSelect({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <label className="planner-time">
      <span className="planner-time-tag">{label}</span>
      <select
        value={value}
        onChange={e => {
          buzz(8);
          onChange(Number(e.target.value));
        }}
        aria-label={label}
      >
        {HOUR_LABELS.map((text, h) => (
          <option key={h} value={h}>
            {text}
          </option>
        ))}
      </select>
    </label>
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
  const hrs = hoursBetween(sel.on, sel.off);
  return (
    <div className="planner-appliance">
      <div className="planner-appliance-top">
        <div className="planner-appliance-info">
          <span className="planner-appliance-name">{appliance.name}</span>
          <span className="planner-appliance-watts">
            ≈{watts.toLocaleString("en-NG")}W each
          </span>
        </div>
        <Stepper
          value={sel.qty}
          onChange={qty => onChange({ ...sel, qty })}
          label={appliance.name}
        />
      </div>
      <div className="planner-appliance-bottom">
        <label className="planner-variant">
          <span className="visually-hidden">Type of {appliance.name}</span>
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
        <div className="planner-times">
          <TimeSelect
            value={sel.on}
            onChange={on => onChange({ ...sel, on })}
            label="On"
          />
          <TimeSelect
            value={sel.off}
            onChange={off => onChange({ ...sel, off })}
            label="Off"
          />
          <span className="planner-hours-badge">
            {hrs === 24 ? "24h" : `${hrs}h/day`}
          </span>
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
  on: number;
  off: number;
  variantIdx: number;
  manualWatts: string;
}

function customOptions(name: string): VariantOption[] {
  return [...(matchVariants(name) ?? SIZE_BANDS), MANUAL_OPTION];
}

function resolveCustom(d: CustomDraft): { watts: number; label: string } {
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
  const isManual =
    opts[Math.min(draft.variantIdx, opts.length - 1)].watts === -1;
  const hrs = hoursBetween(draft.on, draft.off);

  const setName = (name: string) => {
    const before = JSON.stringify((matchVariants(draft.name) ?? []).map(v => v.label));
    const after = JSON.stringify((matchVariants(name) ?? []).map(v => v.label));
    const reset = before !== after;
    onChange({
      ...draft,
      name,
      variantIdx: reset ? 0 : draft.variantIdx,
      manualWatts: reset ? "" : draft.manualWatts,
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
          <Stepper
            value={draft.qty}
            onChange={qty => onChange({ ...draft, qty })}
            label={draft.name || "custom appliance"}
          />
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
        <label className="planner-variant">
          <span className="visually-hidden">Type or size</span>
          <select
            value={Math.min(draft.variantIdx, opts.length - 1)}
            onChange={e => {
              buzz(8);
              onChange({ ...draft, variantIdx: Number(e.target.value) });
            }}
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
          </label>
        )}
        <div className="planner-times">
          <TimeSelect
            value={draft.on}
            onChange={on => onChange({ ...draft, on })}
            label="On"
          />
          <TimeSelect
            value={draft.off}
            onChange={off => onChange({ ...draft, off })}
            label="Off"
          />
          <span className="planner-hours-badge">
            {hrs === 24 ? "24h" : `${hrs}h/day`}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- main section ---------- */

/**
 * "Plan your solar" — step 1 sizes the system from the customer's
 * appliances (with on/off timing and custom entries), step 2 compares
 * the recommended package against generator fuel spending.
 */
export function SolarPlanner() {
  const [load, setLoad] = useState<LoadState>(defaultLoadState);
  const [drafts, setDrafts] = useState<CustomDraft[]>([]);
  const [period, setPeriod] = useState<FuelPeriod>("monthly");
  const [fuelAmount, setFuelAmount] = useState("");
  const [pkgOverride, setPkgOverride] = useState<string>("");
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
          on: d.on,
          off: d.off,
        };
      }),
    [drafts],
  );

  const sizing = useMemo(() => computeSizing(load, customs), [load, customs]);
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
        on: 9,
        off: 17,
        variantIdx: 0,
        manualWatts: "",
      },
    ]);
  };

  const waLink =
    sizing.hasLoad && pkg
      ? buildPlannerWhatsAppLink(
          load,
          customs,
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
              Tell us what you want to power and when you use it — pick the
              type, set on and off times, even add your own appliances. We will
              size the system, match it to a real G-Tech package, and show you
              what it saves you.
            </p>
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
                when each one runs.
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
              <a
                className="store-button green"
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => buzz(25)}
              >
                <MessageCircle size={17} /> Send my plan on WhatsApp
              </a>
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
        </Reveal>
      </div>
    </section>
  );
}
