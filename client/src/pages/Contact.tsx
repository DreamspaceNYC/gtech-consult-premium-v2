import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  BUSINESS,
  ASSESSMENT_URL,
  formatPublicHours,
} from "@/content/business";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";
import { MapPin, MessageCircle, Phone } from "lucide-react";

export default function Contact() {
  const page = SITE_PAGES.contact;
  return (
    <div className="site-page">
      <SeoHead path={page.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={page.path} />
        <PageHero
          eyebrow="Visit, call or message"
          title={page.h1}
          description="Contact our Ondo City team to discuss a technical assessment for solar power, backup energy, CCTV or smart-home automation."
        />
        <section className="content-section">
          <div className="container contact-page-grid">
            <address className="nap-card">
              <p className="page-eyebrow">Customer-facing location</p>
              <h2>{BUSINESS.name}</h2>
              <p>{BUSINESS.fullAddress}</p>
              <p>{formatPublicHours()}</p>
              <div className="contact-link-list">
                <a href={`tel:${BUSINESS.phone}`}>
                  <Phone aria-hidden="true" size={17} />
                  {BUSINESS.displayPhone}
                </a>
                <a href={ASSESSMENT_URL}>
                  <MessageCircle aria-hidden="true" size={17} />
                  Chat on WhatsApp
                </a>
                <a href={BUSINESS.mapsUrl}>
                  <MapPin aria-hidden="true" size={17} />
                  Open directions in Google Maps
                </a>
              </div>
            </address>
            <div className="contact-guidance">
              <p className="page-eyebrow">Before your assessment</p>
              <h2>Help us understand the job</h2>
              <p>
                For solar and inverter enquiries, list the appliances you want
                to run and the backup period you expect. For CCTV or automation,
                tell us the property type, priority areas and features you need.
              </p>
              <p>
                Share your town and state, including Lagos or another location
                outside Ondo. Service availability, final equipment, pricing,
                logistics and installation timing are confirmed after the
                project has been assessed.
              </p>
              <div className="social-row">
                <a href={BUSINESS.instagram}>Instagram</a>
                <a href={BUSINESS.facebook}>Facebook</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
