import { useState } from "react";
import {
  Cctv,
  HousePlus,
  ShieldCheck,
  Sun,
} from "lucide-react";
import "../inner-pages.css";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { GridPattern } from "@/components/magicui";
import { AnimatedList, BlurText } from "@/components/reactbits";
import { BUSINESS } from "@/content/business";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";

type AreaFilter = "all" | "solar" | "cctv" | "smart-home";

const FILTERS: { id: AreaFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "solar", label: "Solar" },
  { id: "cctv", label: "CCTV" },
  { id: "smart-home", label: "Smart Home" },
];

const projectAreas = [
  {
    filter: "solar" as const,
    icon: Sun,
    title: "Solar and backup power",
    description:
      "Assessment, equipment sizing, panel and inverter installation, electrical protection, commissioning and user handover.",
  },
  {
    filter: "cctv" as const,
    icon: Cctv,
    title: "CCTV security",
    description:
      "Property surveys, camera positioning, recorder and storage setup, protected cabling, testing and viewing guidance.",
  },
  {
    filter: "smart-home" as const,
    icon: HousePlus,
    title: "Smart-home systems",
    description:
      "Selected lighting, access, appliance and security controls planned around real routines and available infrastructure.",
  },
] as const;

export default function Projects() {
  const page = SITE_PAGES.projects;
  const [filter, setFilter] = useState<AreaFilter>("all");
  const visibleAreas =
    filter === "all"
      ? projectAreas
      : projectAreas.filter(area => area.filter === filter);

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
              [8, 2],
              [9, 2],
              [8, 3],
            ]}
          />
          <div className="inner-hero-glow" aria-hidden="true" />
          <PageHero
            eyebrow="Proof through careful work"
            title={page.h1}
            description="See the kinds of energy, security and automation work our team plans, installs, tests and hands over to customers."
          />
        </div>

        <section className="content-section">
          <div className="container">
            <div className="gt-section-head">
              <p className="gt-eyebrow">Installation categories</p>
              <BlurText
                as="h2"
                className="gt-h2"
                text="Work designed for everyday use"
              />
            </div>

            <div className="gt-notice">
              <ShieldCheck size={20} aria-hidden="true" />
              <p>
                Only photographs and project details confirmed as work
                completed by G-Tech Consult will be published as case
                studies. Customer locations and security details remain
                private unless publication has been approved.
              </p>
            </div>

            <div
              className="gt-chips"
              role="group"
              aria-label="Filter work areas"
            >
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  className="gt-chip"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <AnimatedList
              key={filter}
              className="gt-grid-3"
              stagger={0.1}
            >
              {visibleAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <article className="gt-card" key={area.title}>
                    <div className="gt-card-top">
                      <span className="gt-icon-chip">
                        <Icon size={21} aria-hidden="true" />
                      </span>
                      <span className="gt-num">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </article>
                );
              })}
            </AnimatedList>

            <div className="gt-notice" style={{ marginTop: 26 }}>
              <ShieldCheck size={20} aria-hidden="true" />
              <p>
                Ask for examples of work completed by G-Tech Consult relevant
                to your requirements. You can also view installation updates
                on our{" "}
                <a href={BUSINESS.instagram}>Instagram</a> and{" "}
                <a href={BUSINESS.facebook}>Facebook</a> profiles.
              </p>
            </div>
          </div>
        </section>

        <ContactCta heading="Tell us what you need installed" />
      </main>
      <SiteFooter />
    </div>
  );
}
