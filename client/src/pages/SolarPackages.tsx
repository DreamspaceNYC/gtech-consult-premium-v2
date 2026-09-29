import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PackageCard } from "@/components/packages/PackageCard";
import {
  PackageFilters,
  type PackageFilter,
} from "@/components/packages/PackageFilters";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SOLAR_PACKAGES, type SolarPackage } from "@/content/packages";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";
import "./SolarPackages.css";

const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

/* Spring constants reused from the 21st animated filter grid. */
const CELL = {
  type: "spring",
  stiffness: 520,
  damping: 34,
  mass: 0.45,
} as const;
const MOVE = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.8,
} as const;
const EASE = [0.23, 1, 0.32, 1] as const;
const LEAVE = { duration: 0.14, ease: [0.4, 0, 1, 1] } as const;
const INSTANT = { duration: 0 } as const;

type PriceFilter = PackageFilter & {
  match: (item: SolarPackage) => boolean;
};

const PRICE_FILTERS: PriceFilter[] = [
  { id: "all", label: "All packages", match: () => true },
  {
    id: "under-2m",
    label: "Under ₦2M",
    match: item => item.price < 2000000,
  },
  {
    id: "mid",
    label: "₦2M – ₦7M",
    match: item => item.price >= 2000000 && item.price <= 7000000,
  },
  {
    id: "premium",
    label: "Above ₦7M",
    match: item => item.price > 7000000,
  },
];

export default function SolarPackages() {
  const page = SITE_PAGES.solarPackages;
  const [activeFilter, setActiveFilter] = useState("all");
  const [cart, setCart] = useState<SolarPackage[]>([]);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();

  const counts = useMemo(() => {
    const next: Record<string, number> = {};
    for (const filter of PRICE_FILTERS) {
      next[filter.id] = SOLAR_PACKAGES.filter(item => filter.match(item)).length;
    }
    return next;
  }, []);

  const visible = useMemo(() => {
    const filter = PRICE_FILTERS.find(f => f.id === activeFilter);
    if (!filter) return SOLAR_PACKAGES;
    return SOLAR_PACKAGES.filter(item => filter.match(item));
  }, [activeFilter]);

  const addToCart = (item: SolarPackage) => {
    setCart(current => [...current, item]);
    setToast(`${item.shortTitle} added to cart`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2400);
  };

  const viewDetails = (item: SolarPackage) => {
    document
      .getElementById(item.slug)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const swap = reduced ? INSTANT : CELL;
  const step = reduced ? INSTANT : { layout: MOVE, duration: 0.2, ease: EASE };
  const leave = reduced ? INSTANT : LEAVE;

  return (
    <div className="site-page pkg-page">
      <SeoHead path={page.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={page.path} />
        <PageHero
          eyebrow="Power options and prices"
          title={page.h1}
          description="Compare complete solar packages, then request an assessment so the final recommendation reflects your appliances, property and expected backup time."
        />
        <section className="content-section content-section-soft">
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">Compare before you choose</p>
              <h2>Solar package prices and specifications</h2>
              <p>
                Published prices are in Nigerian naira. Confirm the current
                price, equipment availability and installation scope in a
                written quotation before payment.
              </p>
            </div>
            <div
              className="pkg-compare-wrap"
              role="region"
              aria-label="Solar package comparison"
              tabIndex={0}
            >
              <table className="comparison-table">
                <caption>
                  G-Tech Consult solar packages: inverter, battery, panels and
                  quoted package price
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Package</th>
                    <th scope="col">Inverter / system</th>
                    <th scope="col">Battery</th>
                    <th scope="col">Solar panels</th>
                    <th scope="col">Price (NGN)</th>
                  </tr>
                </thead>
                <tbody>
                  {SOLAR_PACKAGES.map(item => (
                    <tr key={item.slug}>
                      <th scope="row">
                        <a href={`#${item.slug}`}>{item.title}</a>
                      </th>
                      <td>{item.system}</td>
                      <td>{item.battery}</td>
                      <td>{item.panels}</td>
                      <td>{formatNaira(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pkg-note">
              For Premium Comfort, confirm total battery capacity and quantity
              in your quotation. For Power Tank, confirm continuous output,
              surge rating and usable battery capacity before choosing loads.
            </p>
          </div>
        </section>
        <section className="content-section pkg-section-band">
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">Browse by budget</p>
              <h2>Solar packages</h2>
              <p>
                Filter by price to shortlist, then add a package to your cart
                or ask about it on WhatsApp. Final sizing and installation
                scope are confirmed after assessment.
              </p>
            </div>
            <PackageFilters
              filters={PRICE_FILTERS}
              activeId={activeFilter}
              onChange={setActiveFilter}
              counts={counts}
            />
            <p className="pkg-count-line" aria-live="polite">
              Showing {visible.length} of {SOLAR_PACKAGES.length} packages
              {cart.length > 0 &&
                ` · ${cart.length} in cart (${formatNaira(
                  cart.reduce((sum, item) => sum + item.price, 0)
                )})`}
            </p>
            <motion.div layout={reduced ? false : true} className="pkg-grid">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map(item => (
                  <motion.div
                    key={item.slug}
                    layout={reduced ? false : "position"}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: leave }}
                    transition={step}
                    className="pkg-grid-item"
                  >
                    <PackageCard
                      item={item}
                      onAdd={addToCart}
                      onView={viewDetails}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <AnimatePresence initial={false}>
              {visible.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: leave }}
                  transition={swap}
                  className="pkg-empty"
                >
                  No packages match this price filter. Try another range.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </section>
        <section className="content-section content-section-soft">
          <div className="container content-narrow">
            <div className="section-heading">
              <p className="page-eyebrow">Buying guide</p>
              <h2>Choosing a solar system for your property</h2>
            </div>
            <div className="faq-list">
              <details open>
                <summary>
                  How much does solar installation cost in Nigeria?
                </summary>
                <p>
                  The cost depends on the inverter, usable battery capacity,
                  panel array, mounting, cabling and installation work. Compare
                  the published packages above as starting points, then request
                  a written quote for your appliances and location. An equipment
                  price alone does not describe the complete installed system.
                </p>
              </details>
              <details>
                <summary>
                  What size solar system can power an air conditioner?
                </summary>
                <p>
                  Start with the air conditioner’s electrical input rating,
                  starting demand and operating hours. Add other appliances that
                  will run at the same time. Inverter power, battery energy and
                  daily solar charging must all suit the load; the number of air
                  conditioners alone is not enough to size a system.
                </p>
              </details>
              <details>
                <summary>
                  Can a solar system run a freezer and pumping machine?
                </summary>
                <p>
                  A suitable system can support these appliances, but compressor
                  and pump starting demand matters. Share each appliance’s
                  rating, operating hours and whether they run together. Our{" "}
                  <a href="/inverter-lithium-battery-installation/">
                    inverter and battery assessment
                  </a>{" "}
                  checks simultaneous demand as well as backup energy.
                </p>
              </details>
              <details>
                <summary>What affects battery backup time?</summary>
                <p>
                  Backup time depends on usable battery energy and average
                  connected load. Battery settings, inverter losses, appliance
                  cycling, age and charging conditions also affect the result.
                  Ask for a runtime estimate based on a documented load list
                  instead of a fixed promise of power until a particular time of
                  day.
                </p>
              </details>
              <details>
                <summary>
                  What should my installation quotation include?
                </summary>
                <p>
                  Request equipment brands and model numbers, quantities,
                  inverter rating, total battery capacity, panel wattage,
                  protection, mounting and cable allowances. Confirm transport,
                  labour, commissioning, any electrical corrections, payment
                  terms and quotation validity. Additional work should be
                  itemised before approval.
                </p>
              </details>
              <details>
                <summary>What warranty and support will I receive?</summary>
                <p>
                  Ask for written equipment warranty terms and
                  installation-workmanship coverage, including who handles a
                  claim, exclusions, transport costs and the support contact.
                  Coverage depends on the selected equipment and agreed
                  installation terms; confirm it in your quotation before
                  payment.
                </p>
              </details>
              <details>
                <summary>
                  Can I request an installation outside your office location?
                </summary>
                <p>
                  Yes, send your town and state. Our office is in Ondo City, and
                  enquiries are welcome from Lagos and other parts of Nigeria.
                  We confirm assessment availability, travel costs, installation
                  scheduling and ongoing support for each location before
                  booking.{" "}
                  <a href="/solar-installation-ondo-state/">
                    Discuss a custom installation
                  </a>
                  .
                </p>
              </details>
            </div>
          </div>
        </section>
        <ContactCta />
      </main>
      <SiteFooter />
      <AnimatePresence>
        {toast && (
          <motion.div
            key="cart-toast"
            role="status"
            className="pkg-toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={reduced ? INSTANT : { duration: 0.2 }}
          >
            <span className="pkg-toast-dot" aria-hidden="true" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
