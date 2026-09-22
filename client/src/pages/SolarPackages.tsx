import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BUSINESS } from "@/content/business";
import { SOLAR_PACKAGES } from "@/content/packages";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";

const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

export default function SolarPackages() {
  const page = SITE_PAGES.solarPackages;

  return (
    <div className="site-page">
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
              className="comparison-scroll"
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
            <p className="package-note">
              For Premium Comfort, confirm total battery capacity and quantity
              in your quotation. For Power Tank, confirm continuous output,
              surge rating and usable battery capacity before choosing loads.
            </p>
          </div>
        </section>
        <section className="content-section">
          <div className="container package-list">
            {SOLAR_PACKAGES.map(item => (
              <article
                className="package-list-card"
                data-package={item.slug}
                id={item.slug}
                key={item.slug}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  width="640"
                  height="480"
                  loading="lazy"
                />
                <div>
                  <p className="page-eyebrow">{item.badge ?? item.category}</p>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <dl className="package-specs">
                    <div>
                      <dt>System</dt>
                      <dd>{item.system}</dd>
                    </div>
                    <div>
                      <dt>Battery</dt>
                      <dd>{item.battery}</dd>
                    </div>
                    <div>
                      <dt>Panels</dt>
                      <dd>{item.panels}</dd>
                    </div>
                  </dl>
                  <h3>Designed to power</h3>
                  <ul>
                    {item.powers.map(power => (
                      <li key={power}>{power}</li>
                    ))}
                  </ul>
                  {item.notes?.map(note => (
                    <p className="package-note" key={note}>
                      {note}
                    </p>
                  ))}
                  <details className="package-inclusions">
                    <summary>Equipment and installation inclusions</summary>
                    <ul>
                      {item.items.map(part => (
                        <li key={part.name}>
                          {part.name}: {part.spec} (quantity: {part.qty})
                        </li>
                      ))}
                    </ul>
                    <ul>
                      {item.inclusions.map(inclusion => (
                        <li key={inclusion}>{inclusion}</li>
                      ))}
                    </ul>
                  </details>
                  <p className="package-price">{formatNaira(item.price)}</p>
                  <p className="package-note">
                    Final sizing and installation scope are confirmed after
                    assessment. Runtime depends on actual load and operating
                    conditions.
                  </p>
                  <a
                    className="store-button green"
                    href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(
                      `Hello G-Tech Consult, I am interested in the ${item.title}. My town/state: __. Appliances: __. Required backup hours: __. Please confirm availability and arrange an assessment.`
                    )}`}
                  >
                    Ask about this package
                  </a>
                </div>
              </article>
            ))}
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
    </div>
  );
}
