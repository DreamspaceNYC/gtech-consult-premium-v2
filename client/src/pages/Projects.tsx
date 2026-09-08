import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";

const projectAreas = [
  {
    title: "Solar and backup power",
    description:
      "Assessment, equipment sizing, panel and inverter installation, electrical protection, commissioning and user handover.",
  },
  {
    title: "CCTV security",
    description:
      "Property surveys, camera positioning, recorder and storage setup, protected cabling, testing and viewing guidance.",
  },
  {
    title: "Smart-home systems",
    description:
      "Selected lighting, access, appliance and security controls planned around real routines and available infrastructure.",
  },
] as const;

export default function Projects() {
  const page = SITE_PAGES.projects;
  return (
    <div className="site-page">
      <SeoHead path={page.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={page.path} />
        <PageHero
          eyebrow="Proof through careful work"
          title={page.h1}
          description="See the kinds of energy, security and automation work our team plans, installs, tests and hands over to customers."
        />
        <section className="content-section">
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">Installation categories</p>
              <h2>Work designed for everyday use</h2>
              <p>
                Only photographs and project details confirmed as work completed
                by G-Tech Consult will be published as case studies. Customer
                locations and security details remain private unless publication
                has been approved.
              </p>
            </div>
            <div className="proof-grid">
              {projectAreas.map((area, index) => (
                <article className="process-card" key={area.title}>
                  <span>Area {index + 1}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <ContactCta heading="Tell us what you need installed" />
      </main>
      <SiteFooter />
    </div>
  );
}
