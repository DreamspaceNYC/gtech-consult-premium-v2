import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getServiceByPath } from "@/content/services";
import { SeoHead } from "@/seo/SeoHead";

export default function ServicePage({ path }: { path: string }) {
  const service = getServiceByPath(path);
  if (!service) return null;

  return (
    <div className="site-page">
      <SeoHead path={service.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={service.path} />
        <PageHero
          eyebrow={service.eyebrow}
          title={service.h1}
          description={service.introduction}
        />
        <section className="content-section">
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">What the service includes</p>
              <h2>A system planned around the property and its real needs</h2>
            </div>
            <div className="service-grid">
              {service.benefits.map((benefit, index) => (
                <article className="content-card" key={benefit}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{benefit}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="content-section content-section-soft">
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">From assessment to handover</p>
              <h2>Our installation process</h2>
            </div>
            <div className="service-grid">
              {service.process.map((step, index) => (
                <article className="process-card" key={step.title}>
                  <span>Step {index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
            <p className="area-statement">{service.areaStatement}</p>
          </div>
        </section>
        <section className="content-section">
          <div className="container content-narrow">
            <div className="section-heading">
              <p className="page-eyebrow">Useful answers</p>
              <h2>Frequently asked questions</h2>
            </div>
            <div className="faq-list">
              {service.faqs.map(faq => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <ContactCta heading={service.cta} />
      </main>
      <SiteFooter />
    </div>
  );
}
