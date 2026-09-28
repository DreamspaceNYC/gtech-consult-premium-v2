import { useMemo, useState } from "react";
import { MessageCircle, Minus, Plus } from "lucide-react";
import {
  APPLIANCES,
  FUEL_PRICE_PER_LITRE,
  HOUR_OPTIONS,
  MAX_QTY,
  buildPlannerWhatsAppLink,
  computeSavings,
  computeSizing,
  defaultLoadState,
  formatNaira,
  fuelToMonthly,
  packageBySlug,
  type FuelPeriod,
  type LoadState,
} from "@/content/planner";
import { SOLAR_PACKAGES } from "@/content/packages";
import { ASSESSMENT_URL } from "@/content/business";

const PERIODS: { id: FuelPeriod; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

/**
 * "Plan your solar" — step 1 sizes the system from the customer's
 * appliances, step 2 compares the recommended package against
 * generator fuel spending. Everything uses real package prices.
 */
export function SolarPlanner() {
  const [load, setLoad] = useState<LoadState>(defaultLoadState);
  const [period, setPeriod] = useState<FuelPeriod>("monthly");
  const [fuelAmount, setFuelAmount] = useState("");
  const [pkgOverride, setPkgOverride] = useState<string>("");

  const sizing = useMemo(() => computeSizing(load), [load]);
  const pkg = pkgOverride ? packageBySlug(pkgOverride) : sizing.pkg;

  const fuelNumber = Number(fuelAmount) || 0;
  const monthlyFuel = fuelToMonthly(fuelNumber, period);
  const savings =
    monthlyFuel > 0 && pkg ? computeSavings(monthlyFuel, pkg.price) : null;

  const setQty = (id: string, qty: number) =>
    setLoad(prev => ({
      ...prev,
      [id]: { ...prev[id], qty: Math.max(0, Math.min(MAX_QTY, qty)) },
    }));

  const setHours = (id: string, hours: number) =>
    setLoad(prev => ({ ...prev, [id]: { ...prev[id], hours } }));

  const waLink =
    sizing.hasLoad && pkg
      ? buildPlannerWhatsAppLink(load, sizing, pkg, period, fuelNumber, savings)
      : null;

  return (
    <section className="solar-planner" aria-labelledby="planner-heading">
      <div className="container">
        <div className="section-heading">
          <p className="page-eyebrow">Solar planner</p>
          <h2 id="planner-heading">Plan your solar</h2>
          <p className="gallery-sub">
            Tell us what you want to power and what you spend on fuel — we will
            size the system, match it to a real G-Tech package, and show you
            what it saves you.
          </p>
        </div>

        {/* Step 1 — appliances */}
        <div className="planner-card">
          <p className="planner-step">Step 1 — What do you want to power?</p>
          <div className="planner-appliances">
            {APPLIANCES.map(a => {
              const sel = load[a.id];
              return (
                <div key={a.id} className="planner-appliance">
                  <div className="planner-appliance-info">
                    <span className="planner-appliance-name">{a.name}</span>
                    <span className="planner-appliance-watts">
                      ≈{a.watts.toLocaleString("en-NG")}W each
                    </span>
                  </div>
                  <div className="planner-appliance-controls">
                    <div
                      className="planner-stepper"
                      role="group"
                      aria-label={`How many: ${a.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => setQty(a.id, sel.qty - 1)}
                        disabled={sel.qty <= 0}
                        aria-label={`Fewer ${a.name}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-live="polite">{sel.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(a.id, sel.qty + 1)}
                        disabled={sel.qty >= MAX_QTY}
                        aria-label={`More ${a.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <label className="planner-hours">
                      <span className="visually-hidden">
                        Hours per day: {a.name}
                      </span>
                      <select
                        value={sel.hours}
                        onChange={e => setHours(a.id, Number(e.target.value))}
                        aria-label={`Hours per day for ${a.name}`}
                      >
                        {HOUR_OPTIONS.map(h => (
                          <option key={h} value={h}>
                            {h}h/day
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          {sizing.hasLoad ? (
            <div className="planner-result">
              <div className="planner-result-stats">
                <div>
                  <span className="planner-stat-value">
                    {(sizing.peakWatts / 1000).toFixed(1)}kW
                  </span>
                  <span className="planner-stat-label">peak load</span>
                </div>
                <div>
                  <span className="planner-stat-value">
                    {(sizing.dailyWh / 1000).toFixed(1)}kWh
                  </span>
                  <span className="planner-stat-label">per day</span>
                </div>
                <div>
                  <span className="planner-stat-value">
                    {sizing.inverterKva.toFixed(1)}kVA
                  </span>
                  <span className="planner-stat-label">inverter needed</span>
                </div>
                <div>
                  <span className="planner-stat-value">
                    {sizing.batteryKwh.toFixed(1)}kWh
                  </span>
                  <span className="planner-stat-label">battery needed</span>
                </div>
              </div>
              {pkg ? (
                <div className="planner-package">
                  <div>
                    <p className="planner-package-kicker">Recommended package</p>
                    <p className="planner-package-name">{pkg.title}</p>
                    <p className="planner-package-spec">
                      {pkg.system} · {pkg.battery}
                    </p>
                    {sizing.batteryShortfall && (
                      <p className="planner-note">
                        Your estimated battery need is above this package's
                        standard battery — we will confirm the right battery
                        size at your free assessment.
                      </p>
                    )}
                  </div>
                  <p className="planner-package-price">
                    {formatNaira(pkg.price)}
                  </p>
                </div>
              ) : (
                <p className="planner-note">
                  Your load is larger than our standard packages — it needs a
                  custom design. Send us your plan on WhatsApp and we will size
                  it properly, free.
                </p>
              )}
            </div>
          ) : (
            <p className="planner-hint">
              Tap + on the appliances you want your solar to power.
            </p>
          )}
        </div>

        {/* Step 2 — fuel savings */}
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
                  onClick={() => setPeriod(p.id)}
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
                placeholder={`e.g. ${period === "daily" ? "5,000" : period === "weekly" ? "35,000" : "150,000"}`}
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
              onChange={e => setPkgOverride(e.target.value)}
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
                    {formatNaira(savings.monthly)}
                  </span>
                  <span className="planner-stat-label">fuel / month</span>
                </div>
                <div>
                  <span className="planner-stat-value">
                    {formatNaira(savings.yearly)}
                  </span>
                  <span className="planner-stat-label">fuel / year</span>
                </div>
                <div>
                  <span className="planner-stat-value">
                    {Math.round(savings.litresPerMonth).toLocaleString("en-NG")}L
                  </span>
                  <span className="planner-stat-label">burned / month</span>
                </div>
                <div>
                  <span className="planner-stat-value">
                    ~{Math.round(savings.paybackMonths)} mo
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
                    <strong>{formatNaira(savings.fiveYearSavings)}</strong> over
                    5 years with the {pkg.shortTitle} at{" "}
                    {formatNaira(pkg.price)}.
                  </>
                ) : (
                  <>
                    At this fuel spend the {pkg.shortTitle} takes about{" "}
                    {Math.round(savings.paybackMonths / 12)} years to pay back —
                    a smaller package or our free assessment may suit you
                    better.
                  </>
                )}
              </p>
              <p className="planner-note">
                Based on ₦{FUEL_PRICE_PER_LITRE.toLocaleString("en-NG")} per
                litre. Generator servicing and repair costs are not included —
                real savings are higher.
              </p>
            </div>
          ) : (
            <p className="planner-hint">
              Enter what you spend on fuel to see your payback time and 5-year
              savings.
            </p>
          )}
        </div>

        <div className="planner-cta">
          {waLink ? (
            <a
              className="store-button green"
              href={waLink}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} /> Send my plan on WhatsApp
            </a>
          ) : (
            <a
              className="store-button green"
              href={ASSESSMENT_URL}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} /> Book a free site assessment
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
