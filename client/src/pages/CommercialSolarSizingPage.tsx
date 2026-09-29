import {
  ClipboardList,
  FileText,
  Plus,
  Settings,
  Wrench,
} from "lucide-react";
import "../inner-pages.css";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { GridPattern } from "@/components/magicui";
import {
  AnimatedList,
  BlurText,
  CountUp,
} from "@/components/reactbits";
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
        <div className="inner-hero-wrap">
          <GridPattern
            className="inner-hero-pattern"
            squares={[
              [12, 2],
              [13, 2],
              [13, 3],
            ]}
          />
          <div className="inner-hero-glow" aria-hidden="true" />
          <PageHero
            eyebrow="For businesses"
            title={page.h1}
            description={page.description}
          />
        </div>

        <section className="content-section" aria-labelledby="commercial-how">
          <div className="container">
            <div className="gt-section-head">
              <p className="gt-eyebrow">How it works</p>
              <BlurText
                as="h2"
                id="commercial-how"
                className="gt-h2"
                text="Commercial sizing, done properly"
              />
              <p className="gt-sub">
                Homes can be estimated from an appliance list. Businesses
                need a load audit — here is our process for shops, offices,
                hotels, warehouses and factories across Lagos, Ondo and
                Nigeria.
              </p>
              <p className="gt-count-pill">
                <CountUp end={4} />
                stages from audit to after-sales support
              </p>
            </div>
            <AnimatedList className="gt-grid-4" stagger={0.1}>
              <article className="gt-card gt-step-card">
                <span className="gt-step-ghost" aria-hidden="true">1</span>
                <div className="gt-card-top">
                  <span className="gt-icon-chip">
                    <ClipboardList size={21} aria-hidden="true" />
                  </span>
                  <span className="gt-step-tag">Step 1</span>
                </div>
                <h3>1. Load audit</h3>
                <p>
                  We list every machine, air conditioner, pump, light and
                  socket load with its watts and operating hours — including
                  motor starting surges, which decide the real inverter size.
                </p>
              </article>
              <article className="gt-card gt-step-card">
                <span className="gt-step-ghost" aria-hidden="true">2</span>
                <div className="gt-card-top">
                  <span className="gt-icon-chip">
                    <Settings size={21} aria-hidden="true" />
                  </span>
                  <span className="gt-step-tag">Step 2</span>
                </div>
                <h3>2. Supply and design</h3>
                <p>
                  We confirm single-phase or 3-phase supply, then design the
                  system: inverter kVA, battery kWh for your outage pattern,
                  panel array, and hybrid or off-grid architecture.
                </p>
              </article>
              <article className="gt-card gt-step-card">
                <span className="gt-step-ghost" aria-hidden="true">3</span>
                <div className="gt-card-top">
                  <span className="gt-icon-chip">
                    <FileText size={21} aria-hidden="true" />
                  </span>
                  <span className="gt-step-tag">Step 3</span>
                </div>
                <h3>3. Written proposal</h3>
                <p>
                  You receive a written proposal with exact naira pricing,
                  equipment specifications and an installation schedule —
                  before any commitment.
                </p>
              </article>
              <article className="gt-card gt-step-card">
                <span className="gt-step-ghost" aria-hidden="true">4</span>
                <div className="gt-card-top">
                  <span className="gt-icon-chip">
                    <Wrench size={21} aria-hidden="true" />
                  </span>
                  <span className="gt-step-tag">Step 4</span>
                </div>
                <h3>4. Installation and support</h3>
                <p>
                  Certified installation, system handover with training for
                  your staff, and after-sales maintenance so the system keeps
                  paying for itself.
                </p>
              </article>
            </AnimatedList>
          </div>
        </section>

        <section
          className="content-section content-section-soft"
          aria-labelledby="commercial-faq-heading"
        >
          <div className="container">
            <div className="gt-section-head">
              <p className="gt-eyebrow">Common questions</p>
              <BlurText
                as="h2"
                id="commercial-faq-heading"
                className="gt-h2"
                text="Commercial solar questions, answered"
              />
              <p className="gt-sub">
                Running a small shop or office?{" "}
                <Link href="/solar-planner">
                  Try the free solar calculator
                </Link>{" "}
                for a quick estimate first.
              </p>
              <p className="gt-count-pill">
                <CountUp end={COMMERCIAL_FAQS.length} />
                answered questions
              </p>
            </div>
            <AnimatedList className="gt-faq" stagger={0.04} y={12}>
              {COMMERCIAL_FAQS.map(faq => (
                <details key={faq.question}>
                  <summary>
                    <span>{faq.question}</span>
                    <Plus
                      size={15}
                      aria-hidden="true"
                      className="gt-faq-icon"
                    />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </AnimatedList>
          </div>
        </section>

        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  );
}
