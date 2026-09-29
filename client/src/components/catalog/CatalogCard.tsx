import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/content/business";
import { familyLabel, type CatalogProduct } from "@/content/catalog";
import "../packages/package-card.css";

/* Product card for the G-Tech catalog. Enquiry-only: no prices, no cart.
   Reuses the gt-card glass system from the package cards. */
export function CatalogCard({ item }: { item: CatalogProduct }) {
  const waHref = `${BUSINESS.whatsapp}?text=${encodeURIComponent(
    `Hello G-Tech Consult, I am interested in your ${item.name} (${familyLabel(item.family)}). Please share details and pricing.`
  )}`;

  return (
    <article className="gt-card" data-catalog={item.slug}>
      <div className="gt-card-media">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          width="640"
          height="480"
        />
        <div aria-hidden="true" className="gt-card-glass" />
      </div>
      <div className="gt-card-body">
        <p className="gt-card-category">{familyLabel(item.family)}</p>
        <h3 className="gt-card-title">{item.name}</h3>
        <p className="gt-card-desc">{item.description}</p>
        <div className="gt-card-actions">
          <a
            className={cn("gt-btn", "gt-btn-primary")}
            href={waHref}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} aria-hidden="true" /> Enquire on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
