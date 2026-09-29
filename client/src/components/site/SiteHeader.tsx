import { Menu, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/content/business";
import { ShimmerButton } from "@/components/magicui";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/solar-installation-ondo-city/", label: "Solar Installation" },
  { href: "/solar-packages/", label: "Solar Packages" },
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="container site-header-inner">
          <a className="site-brand" href="/" aria-label="G-Tech Consult home">
            <img
              src="/images/gtech-logo-reference-cropped_daba8f24.png"
              alt="G-Tech Consult"
              width="150"
              height="74"
            />
          </a>
          <details className="site-nav-menu">
            <summary aria-label="Open navigation">
              <Menu aria-hidden="true" size={21} />
              <span>Menu</span>
            </summary>
            <nav aria-label="Primary navigation">
              {primaryLinks.map(link => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
          <nav className="site-nav" aria-label="Primary navigation">
            {primaryLinks.map(link => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <ShimmerButton
            href={BUSINESS.whatsapp}
            className="site-header-whatsapp"
            background="linear-gradient(135deg, #27b45e 0%, #118541 100%)"
            shimmerColor="rgba(255, 255, 255, 0.55)"
            shimmerDuration="3s"
            borderRadius="999px"
          >
            <MessageCircle aria-hidden="true" size={16} />
            WhatsApp
          </ShimmerButton>
        </div>
      </header>
    </>
  );
}
