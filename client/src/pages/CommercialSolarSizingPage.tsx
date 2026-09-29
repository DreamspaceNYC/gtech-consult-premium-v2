import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { COMMERCIAL_FAQS } from "@/content/commercialFaq";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";
import { Link } from "wouter";

/**
 * Commercial solar sizing page: targets "commercial solar inverter sizing
 * Lagos", "3-phase solar inverter", warehouse/office sizing and related
 * business queries. Ends in the planner + WhatsApp handoff.
 */
export default function CommercialSolarSizingPage() {
  const page = SITE_PAGES.commercialSizing;

  return (
    <div className="site-page">
      <SeoHead path={page.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={page.path} />
        <PageHero
          eyebrow="For businesses"
          title={page.h1}
          description={page.description}
        />
        <section className="content-section" aria-labelledby="commercial-how">
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">How it works</p>
              <h2 id="commercial-how">
                Commercial sizing, done properly
              </h2>
              <p>
                Homes can be estimated from an appliance list. Businesses
                need a load audit — here is our process for shops, offices,
                hotels, warehouses and factories across Lagos, Ondo and
                Nigeria.
              </p>
            </div>
            <div className="guide-grid">
              <article className="guide-card">
                <h3>1. Load audit</h3>
                <p>
                  We list every machine, air conditioner, pump, light and
                  socket load with its watts and operating hours — including
                  motor starting surges, which decide the real inverter size.
                </p>
              </article>
              <article className="guide-card">
                <h3>2. Supply and design</h3>
                <p>
                  We confirm single-phase or 3-phase supply, then design the
                  system: inverter kVA, battery kWh for your outage pattern,
                  panel array, and hybrid or off-grid architecture.
                </p>
              </article>
              <article className="guide-card">
                <h3>3. Written proposal</h3>
                <p>
                  You receive a written proposal with exact naira pricing,
                  equipment specifications and an installation schedule —
                  before any commitment.
                </p>
              </article>
              <article className="guide-card">
                <h3>4. Installation and support</h3>
                <p>
                  Certified installation, system handover with training for
                  your staff, and after-sales maintenance so the system keeps
                  paying for itself.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section
          className="content-section content-section-soft"
          aria-labelledby="commercial-faq-heading"
        >
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">Common questions</p>
              <h2 id="commercial-faq-heading">
                Commercial solar questions, answered
              </h2>
              <p>
                Running a small shop or office?{" "}
                <Link href="/solar-planner">
                  Try the free solar calculator
                </Link>{" "}
                for a quick estimate first.
              </p>
            </div>
            <div className="faq-list">
              {COMMERCIAL_FAQS.map(faq => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  );
}
