import { MessageCircle } from "lucide-react";
import { BUSINESS, formatPublicHours } from "@/content/business";
import { SERVICE_PAGES } from "@/content/services";

const companyLinks = [
  { href: "/solar-packages", label: "Solar Packages" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <a href="/">
            <img
              src="/images/gtech-logo-reference-cropped_daba8f24.png"
              alt="G-Tech Consult"
              width="150"
              height="74"
            />
          </a>
          <p>Solar power, CCTV security and smart-home solutions in Ondo.</p>
        </div>
        <div>
          <strong>Services</strong>
          {SERVICE_PAGES.map(service => (
            <a href={service.path} key={service.path}>
              {service.h1}
            </a>
          ))}
        </div>
        <div>
          <strong>Company</strong>
          {companyLinks.map(link => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <address>
          <strong>Visit or contact us</strong>
          <a href={BUSINESS.mapsUrl}>{BUSINESS.fullAddress}</a>
          <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.displayPhone}</a>
          <span>{formatPublicHours()}</span>
          <a className="site-footer-chat" href={BUSINESS.whatsapp}>
            <MessageCircle aria-hidden="true" size={15} />
            Chat on WhatsApp
          </a>
        </address>
      </div>
      <div className="container site-footer-bottom">
        <span>© {new Date().getFullYear()} G-Tech Consult.</span>
        <span>Ondo City, Ondo State, Nigeria</span>
      </div>
    </footer>
  );
}
