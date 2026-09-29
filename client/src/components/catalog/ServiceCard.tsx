import { ClipboardCheck, MessageCircle, Network, Satellite } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/content/business";
import type { CatalogService } from "@/content/catalog";
import "../packages/package-card.css";

const SERVICE_ICONS = {
  clipboard: ClipboardCheck,
  satellite: Satellite,
  network: Network,
} as const;

/* Service card for catalog services (no product image): icon, one-line
   description and a "Book" WhatsApp button. Enquiry-only, no prices. */
export function ServiceCard({ item }: { item: CatalogService }) {
  const Icon = SERVICE_ICONS[item.icon as keyof typeof SERVICE_ICONS] ?? ClipboardCheck;
  const waHref = `${BUSINESS.whatsapp}?text=${encodeURIComponent(
    `Hello G-Tech Consult, I would like to book your ${item.name} service. Please share details.`
  )}`;

  return (
    <article className="gt-card gt-service-card" data-service={item.slug}>
      <div className="gt-card-body">
        <div className="gt-card-top">
          <span className="gt-icon-chip">
            <Icon size={21} aria-hidden="true" />
          </span>
        </div>
        <h3 className="gt-card-title">{item.name}</h3>
        <p className="gt-card-desc">{item.description}</p>
        <div className="gt-card-actions">
          <a
            className={cn("gt-btn", "gt-btn-outline")}
            href={waHref}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} aria-hidden="true" /> Book on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
