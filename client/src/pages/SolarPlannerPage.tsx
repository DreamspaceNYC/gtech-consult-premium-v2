import { Plus } from "lucide-react";
import "../inner-pages.css";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SolarPlanner } from "@/components/SolarPlanner";
import { SizingGuide } from "@/components/SizingGuide";
import { GridPattern } from "@/components/magicui";
import {
  AnimatedList,
  BlurText,
  CountUp,
} from "@/components/reactbits";
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
        <div className="inner-hero-wrap">
          <GridPattern
            className="inner-hero-pattern"
            squares={[
              [10, 1],
              [11, 1],
              [10, 2],
            ]}
          />
          <div className="inner-hero-glow" aria-hidden="true" />
          <PageHero
            eyebrow="Free solar calculator"
            title={page.h1}
            description={page.description}
          />
        </div>
        <SolarPlanner shareable />
        <SizingGuide />
        <section
          className="content-section"
          aria-labelledby="planner-faq-heading"
        >
          <div className="container">
            <div className="gt-section-head">
              <p className="gt-eyebrow">Common questions</p>
              <BlurText
                as="h2"
                id="planner-faq-heading"
                className="gt-h2"
                text="Solar sizing questions, answered"
              />
              <p className="gt-sub">
                The twenty questions customers ask us most — answered with
                real numbers. Try the planner above to get answers for your
                own home or business.
              </p>
              <p className="gt-count-pill">
                <CountUp end={PLANNER_FAQS.length} />
                answered questions
              </p>
            </div>
            <AnimatedList className="gt-faq" stagger={0.03} y={12}>
              {PLANNER_FAQS.map(faq => (
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
