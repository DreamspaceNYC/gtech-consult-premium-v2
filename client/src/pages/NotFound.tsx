import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SeoHead } from "@/seo/SeoHead";

export default function NotFound() {
  return (
    <div className="site-page">
      <SeoHead path="/404" />
      <SiteHeader />
      <main id="main-content">
        <section className="not-found-page">
          <div className="container content-narrow">
            <p className="page-eyebrow">404 error</p>
            <h1>Page Not Found</h1>
            <p>
              The page you requested is unavailable. Explore our solar, security
              and smart-home services from the G-Tech Consult homepage.
            </p>
            <a className="store-button green" href="/">
              Return to G-Tech Consult
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
