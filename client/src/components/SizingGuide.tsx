import { Link } from "wouter";

/**
 * Visible sizing guide on the /solar-planner page.
 * Real, quotable content targeting "how to calculate solar inverter size
 * Nigeria" and related searches — this is what earns rankings, not metadata.
 */
export function SizingGuide() {
  return (
    <section className="content-section" aria-labelledby="sizing-guide-heading">
      <div className="container">
        <div className="section-heading">
          <p className="page-eyebrow">Sizing guide</p>
          <h2 id="sizing-guide-heading">
            How to calculate solar inverter size in Nigeria
          </h2>
          <p>
            The exact method our installers use — and the same maths the
            planner above runs automatically.
          </p>
        </div>
        <div className="guide-grid">
          <article className="guide-card">
            <h3>Step 1 — List your loads in watts</h3>
            <p>
              Write down every appliance, its watt rating from the nameplate,
              and how many hours it runs each day. Watts × hours gives
              watt-hours: the energy each appliance consumes daily. Add them
              all up and you have your daily energy need in kWh.
            </p>
          </article>
          <article className="guide-card">
            <h3>Step 2 — Find your peak load</h3>
            <p>
              Your inverter must handle the highest total watts running at any
              single moment — that is your peak load. Add 25% headroom for
              safety, because fridges, pumps and air conditioners draw three
              to five times their rated watts for a few seconds when starting.
            </p>
          </article>
          <article className="guide-card">
            <h3>kVA vs kW: the Nigerian convention</h3>
            <p>
              Nigeria rates inverters in kVA. Roughly, kW = kVA × 0.8, so a
              5kVA inverter delivers about 4kW of usable power. When comparing
              a solar inverter kVA calculator result with quotes in Lagos or
              Ondo, always confirm whether each figure is kVA or kW.
            </p>
          </article>
          <article className="guide-card">
            <h3>Sizing the battery from night-time use</h3>
            <p>
              Panels only produce in daylight, so your battery must carry
              everything you run after dark. Add up night-time watt-hours and
              add about 30% extra for cloudy days. Tell the planner whether
              you use power mostly by day, day and night, or mostly at night
              and it weights the battery accordingly.
            </p>
          </article>
          <article className="guide-card">
            <h3>Sizing from your electricity bill</h3>
            <p>
              No appliance list handy? Divide your monthly kWh by 30 for
              average daily usage — enough to estimate panels and a rough
              battery size. But a bill never shows peak load, which is what
              sizes the inverter, so combine it with an appliance list for
              the full picture.
            </p>
          </article>
          <article className="guide-card">
            <h3>Businesses and 3-phase loads</h3>
            <p>
              Shops, offices, hotels and factories follow the same steps at
              larger scale, with one extra check: single-phase or 3-phase
              supply. Commercial sites on 3-phase need a 3-phase hybrid
              inverter with balanced phases.{" "}
              <Link href="/commercial-solar-sizing">
                See our commercial solar sizing page
              </Link>{" "}
              for the full business process.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
