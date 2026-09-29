import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SolarPlanner } from "@/components/SolarPlanner";
import { SizingGuide } from "@/components/SizingGuide";
import { PLANNER_FAQS } from "@/content/plannerFaq";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";

/**
 * Dedicated solar planner page: the interactive sizing tool plus the
 * five questions it answers, so the page earns search visibility as
 * a free tool rather than living only inside the homepage.
 */
export default function SolarPlannerPage() {
  const page = SITE_PAGES.solarPlanner;

  return (
    <div className="site-page">
      <SeoHead path={page.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={page.path} />
        <PageHero
          eyebrow="Free solar calculator"
          title={page.h1}
          description={page.description}
        />
        <SolarPlanner shareable />
        <SizingGuide />
        <section
          className="content-section"
          aria-labelledby="planner-faq-heading"
        >
          <div className="container">
            <div className="section-heading">
              <p className="page-eyebrow">Common questions</p>
              <h2 id="planner-faq-heading">Solar sizing questions, answered</h2>
              <p>
                The twenty questions customers ask us most — answered with
                real numbers. Try the planner above to get answers for your
                own home or business.
              </p>
            </div>
            <div className="faq-list">
              {PLANNER_FAQS.map(faq => (
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
