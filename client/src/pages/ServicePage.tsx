import {
  BadgeCheck,
  ClipboardCheck,
  MapPin,
  PenTool,
  Plus,
  ShieldCheck,
  Wrench,
  Zap,
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
import { getServiceByPath } from "@/content/services";
import { SeoHead } from "@/seo/SeoHead";

const BENEFIT_ICONS = [BadgeCheck, Zap, ShieldCheck] as const;
const PROCESS_ICONS = [ClipboardCheck, PenTool, Wrench] as const;

export default function ServicePage({ path }: { path: string }) {
  const service = getServiceByPath(path);
  if (!service) return null;

  return (
    <div className="site-page">
      <SeoHead path={service.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={service.path} />
        <div className="inner-hero-wrap">
          <GridPattern
            className="inner-hero-pattern"
            squares={[
              [14, 2],
              [15, 2],
              [14, 3],
            ]}
          />
          <div className="inner-hero-glow" aria-hidden="true" />
          <PageHero
            eyebrow={service.eyebrow}
            title={service.h1}
            description={service.introduction}
          />
        </div>

        <section className="content-section">
          <div className="container">
            <div className="gt-section-head">
              <p className="gt-eyebrow">What the service includes</p>
              <BlurText
                as="h2"
                className="gt-h2"
                text="A system planned around the property and its real needs"
              />
            </div>
            <AnimatedList className="gt-grid-3" stagger={0.1}>
              {service.benefits.map((benefit, index) => {
                const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
                return (
                  <article className="gt-card" key={benefit}>
                    <div className="gt-card-top">
                      <span className="gt-icon-chip">
                        <Icon size={21} aria-hidden="true" />
                      </span>
                      <span className="gt-num">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p>{benefit}</p>
                  </article>
                );
              })}
            </AnimatedList>
          </div>
        </section>

        <section className="content-section content-section-soft">
          <div className="container">
            <div className="gt-section-head">
              <p className="gt-eyebrow">From assessment to handover</p>
              <BlurText
                as="h2"
                className="gt-h2"
                text="Our installation process"
              />
              <p className="gt-count-pill">
                <CountUp end={service.process.length} />
                steps, one accountable team
              </p>
            </div>
            <AnimatedList className="gt-grid-3" stagger={0.12}>
              {service.process.map((step, index) => {
                const Icon = PROCESS_ICONS[index % PROCESS_ICONS.length];
                return (
                  <article className="gt-card gt-step-card" key={step.title}>
                    <span
                      className="gt-step-ghost"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div className="gt-card-top">
                      <span className="gt-icon-chip">
                        <Icon size={21} aria-hidden="true" />
                      </span>
                      <span className="gt-step-tag">Step {index + 1}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                );
              })}
            </AnimatedList>
            <div className="gt-area">
              <MapPin size={19} aria-hidden="true" />
              <p>{service.areaStatement}</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="container content-narrow">
            <div className="gt-section-head">
              <p className="gt-eyebrow">Useful answers</p>
              <BlurText
                as="h2"
                className="gt-h2"
                text="Frequently asked questions"
              />
            </div>
            <AnimatedList className="gt-faq" stagger={0.05} y={14}>
              {service.faqs.map(faq => (
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

        <ContactCta heading={service.cta} />
      </main>
      <SiteFooter />
    </div>
  );
}
