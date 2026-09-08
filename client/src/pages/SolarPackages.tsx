import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BUSINESS } from "@/content/business";
import { SOLAR_PACKAGES } from "@/content/packages";
import { SITE_PAGES } from "@/content/sitePages";
import { SeoHead } from "@/seo/SeoHead";

const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

export default function SolarPackages() {
  const page = SITE_PAGES.solarPackages;

  return (
    <div className="site-page">
      <SeoHead path={page.path} />
      <SiteHeader />
      <main id="main-content">
        <Breadcrumbs path={page.path} />
        <PageHero
          eyebrow="Power options and prices"
          title={page.h1}
          description="Compare complete solar packages, then request an assessment so the final recommendation reflects your appliances, property and expected backup time."
        />
        <section className="content-section">
          <div className="container package-list">
            {SOLAR_PACKAGES.map(item => (
              <article
                className="package-list-card"
                data-package={item.slug}
                key={item.slug}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  width="640"
                  height="480"
                  loading="lazy"
                />
                <div>
                  <p className="page-eyebrow">{item.badge ?? item.category}</p>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <dl className="package-specs">
                    <div>
                      <dt>System</dt>
                      <dd>{item.system}</dd>
                    </div>
                    <div>
                      <dt>Battery</dt>
                      <dd>{item.battery}</dd>
                    </div>
                    <div>
                      <dt>Panels</dt>
                      <dd>{item.panels}</dd>
                    </div>
                  </dl>
                  <h3>Designed to power</h3>
                  <ul>
                    {item.powers.map(power => (
                      <li key={power}>{power}</li>
                    ))}
                  </ul>
                  <p className="package-price">{formatNaira(item.price)}</p>
                  <p className="package-note">
                    Final sizing and installation scope are confirmed after
                    assessment. Runtime depends on actual load and operating
                    conditions.
                  </p>
                  <a
                    className="store-button green"
                    href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(
                      `Hello G-Tech Consult, I am interested in the ${item.title}. Please help me arrange an assessment.`
                    )}`}
                  >
                    Ask about this package
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  );
}
