import {
  Clock,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import "../inner-pages.css";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { GridPattern, StripedPattern } from "@/components/magicui";
import { AnimatedList, BlurText } from "@/components/reactbits";
import {
  BUSINESS,
  ASSESSMENT_URL,
  formatPublicHours,
} from "@/content/business";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";

export default function Contact() {
  const page = SITE_PAGES.contact;
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
              [11, 2],
              [12, 2],
              [11, 3],
            ]}
          />
          <div className="inner-hero-glow" aria-hidden="true" />
          <PageHero
            eyebrow="Visit, call or message"
            title={page.h1}
            description="Contact our Ondo City team to discuss a technical assessment for solar power, backup energy, CCTV or smart-home automation."
          />
        </div>

        <section className="content-section">
          <div className="container gt-contact-grid">
            <AnimatedList stagger={0.12} y={20}>
              <address className="gt-nap">
                <StripedPattern
                  className="gt-nap-pattern"
                  direction="right"
                />
                <div className="gt-nap-inner">
                  <p className="gt-eyebrow">Customer-facing location</p>
                  <h2>{BUSINESS.name}</h2>
                  <ul className="gt-nap-rows">
                    <li>
                      <MapPin size={18} aria-hidden="true" />
                      <span>{BUSINESS.fullAddress}</span>
                    </li>
                    <li>
                      <Clock size={18} aria-hidden="true" />
                      <span>{formatPublicHours()}</span>
                    </li>
                    <li>
                      <Phone size={18} aria-hidden="true" />
                      <span>
                        <strong>{BUSINESS.displayPhone}</strong>
                        {" · "}
                        {BUSINESS.displaySecondaryPhone}
                      </span>
                    </li>
                  </ul>
                  <div className="gt-nap-actions">
                    <a
                      className="gt-nap-btn green"
                      href={ASSESSMENT_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      Chat on WhatsApp
                    </a>
                    <a
                      className="gt-nap-btn ghost"
                      href={`tel:${BUSINESS.phone}`}
                    >
                      <Phone size={16} aria-hidden="true" />
                      Call {BUSINESS.displayPhone}
                    </a>
                    <a
                      className="gt-nap-btn ghost"
                      href={BUSINESS.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Navigation size={16} aria-hidden="true" />
                      Open directions in Google Maps
                    </a>
                  </div>
                </div>
              </address>

              <div className="gt-guidance">
                <p className="gt-eyebrow">Before your assessment</p>
                <BlurText
                  as="h2"
                  className="gt-h2"
                  text="Help us understand the job"
                />
                <p>
                  For solar and inverter enquiries, list the appliances you
                  want to run and the backup period you expect. For CCTV or
                  automation, tell us the property type, priority areas and
                  features you need.
                </p>
                <p>
                  Share your town and state, including Lagos or another
                  location outside Ondo. Service availability, final
                  equipment, pricing, logistics and installation timing are
                  confirmed after the project has been assessed.
                </p>
                <div className="gt-social-row">
                  <a
                    className="gt-social-btn"
                    href={BUSINESS.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram size={16} aria-hidden="true" />
                    Instagram
                  </a>
                  <a
                    className="gt-social-btn"
                    href={BUSINESS.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Facebook size={16} aria-hidden="true" />
                    Facebook
                  </a>
                </div>
              </div>
            </AnimatedList>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
