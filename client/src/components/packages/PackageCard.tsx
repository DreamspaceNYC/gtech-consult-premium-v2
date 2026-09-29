import { Check, Eye, MessageCircle, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SolarPackage } from "@/content/packages";
import "./package-card.css";

const WHATSAPP = "https://wa.me/2348167498489";
const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

export function PackageCard({
  item,
  onAdd,
  onView,
}: {
  item: SolarPackage;
  onAdd: (item: SolarPackage) => void;
  onView: (item: SolarPackage) => void;
}) {
  const price = formatNaira(item.price);
  const waHref = `${WHATSAPP}?text=${encodeURIComponent(
    `Hello G-Tech Consult, I am interested in the ${item.title} at ${price}. Please help me arrange a technical assessment.`
  )}`;

  return (
    <article className="gt-card" id={item.slug} data-package={item.slug}>
      <div className="gt-card-media">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          width="640"
          height="480"
        />
        {item.badge && <span className="gt-card-badge">{item.badge}</span>}
        <div aria-hidden="true" className="gt-card-glass" />
      </div>
      <div className="gt-card-body">
        <p className="gt-card-category">{item.category}</p>
        <h3 className="gt-card-title">{item.title}</h3>
        <p className="gt-card-desc">{item.description}</p>
        <p className="gt-card-price">
          <span>{price}</span>
          <span className="gt-card-price-note">package price</span>
        </p>
        <ul className="gt-card-powers">
          {item.powers.slice(0, 4).map(power => (
            <li key={power}>
              <Check size={15} aria-hidden="true" />
              <span>{power}</span>
            </li>
          ))}
        </ul>
        <dl className="gt-card-specs">
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
        {item.notes?.map(note => (
          <p className="gt-card-note" key={note}>
            {note}
          </p>
        ))}
        <div className="gt-card-actions">
          <button
            type="button"
            className={cn("gt-btn", "gt-btn-primary")}
            onClick={() => onAdd(item)}
          >
            <ShoppingCart size={16} aria-hidden="true" /> Add to cart
          </button>
          <button
            type="button"
            className={cn("gt-btn", "gt-btn-outline")}
            onClick={() => onView(item)}
          >
            <Eye size={16} aria-hidden="true" /> View details
          </button>
        </div>
        <a
          className="gt-wa"
          href={waHref}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} aria-hidden="true" /> Ask about this package
          on WhatsApp
        </a>
        <details className="gt-card-inclusions">
          <summary>Equipment and installation inclusions</summary>
          <ul className="gt-equip">
            {item.items.map(part => (
              <li key={part.name}>
                {part.name}: {part.spec} (quantity: {part.qty})
              </li>
            ))}
          </ul>
          <ul className="gt-incl">
            {item.inclusions.map(inclusion => (
              <li key={inclusion}>{inclusion}</li>
            ))}
          </ul>
        </details>
      </div>
    </article>
  );
}
