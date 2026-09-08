import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
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
        <PageHero
          eyebrow="Energy, security and smart living"
          title={page.h1}
          description="We help homes and businesses make practical decisions about solar power, backup energy, CCTV and smart-home systems from our customer-facing Ondo City location."
        />
        <section className="content-section">
          <div className="container about-layout">
            <div>
              <p className="page-eyebrow">How we work</p>
              <h2>Assessment before recommendation</h2>
              <p>
                Equipment performs best when it is selected for the real job.
                Our process begins with the intended loads, coverage areas,
                usage patterns and installation environment rather than a
                one-size-fits-all promise.
              </p>
            </div>
            <ol className="approach-list">
              {stages.map(stage => (
                <li key={stage}>{stage}</li>
              ))}
            </ol>
          </div>
        </section>
        <section className="content-section content-section-soft">
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">Our services</p>
              <h2>Explore the right starting point</h2>
            </div>
            <div className="service-link-grid">
              {SERVICE_PAGES.map(service => (
                <a href={service.path} key={service.path}>
                  <h3>{service.h1}</h3>
                  <p>{service.description}</p>
                  <span>View service →</span>
                </a>
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
