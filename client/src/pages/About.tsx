import { ArrowRight } from "lucide-react";
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
import { SERVICE_PAGES } from "@/content/services";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";

const stages = [
  "Listen to the customer's power, security or automation priorities.",
  "Assess the property, equipment requirements and installation conditions.",
  "Recommend and quote a clearly defined system.",
  "Install, protect, test and commission the agreed solution.",
  "Explain operation and remain available for after-installation support.",
] as const;

export default function About() {
  const page = SITE_PAGES.about;
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
              [9, 1],
              [10, 1],
              [9, 2],
            ]}
          />
          <div className="inner-hero-glow" aria-hidden="true" />
          <PageHero
            eyebrow="Energy, security and smart living"
            title={page.h1}
            description="We help homes and businesses make practical decisions about solar power, backup energy, CCTV and smart-home systems from our customer-facing Ondo City location."
          />
        </div>

        <section className="content-section">
          <div className="container gt-about-layout">
            <div>
              <p className="gt-eyebrow">How we work</p>
              <BlurText
                as="h2"
                className="gt-h2"
                text="Assessment before recommendation"
              />
              <p className="gt-sub">
                Equipment performs best when it is selected for the real job.
                Our process begins with the intended loads, coverage areas,
                usage patterns and installation environment rather than a
                one-size-fits-all promise.
              </p>
              <p className="gt-count-pill">
                <CountUp end={stages.length} />
                stages, every installation
              </p>
            </div>
            <AnimatedList
              containerAs="ol"
              itemAs="li"
              className="gt-approach"
              stagger={0.09}
            >
              {stages.map((stage, index) => (
                <>
                  <span className="gt-approach-num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{stage}</span>
                </>
              ))}
            </AnimatedList>
          </div>
        </section>

        <section className="content-section content-section-soft">
          <div className="container">
            <div className="gt-section-head">
              <p className="gt-eyebrow">Our services</p>
              <BlurText
                as="h2"
                className="gt-h2"
                text="Explore the right starting point"
              />
            </div>
            <AnimatedList className="gt-grid-2" stagger={0.09}>
              {SERVICE_PAGES.map(service => (
                <a
                  href={`${service.path}/`}
                  key={service.path}
                  className="gt-card gt-service-link"
                >
                  <h3>{service.h1}</h3>
                  <p>{service.description}</p>
                  <span className="gt-link-more">
                    View service
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </a>
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
