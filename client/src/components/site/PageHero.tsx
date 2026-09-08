import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/content/business";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="page-hero-actions">
          <a className="store-button green" href={BUSINESS.whatsapp}>
            Request an assessment
            <MessageCircle aria-hidden="true" size={16} />
          </a>
          <a className="store-button outline" href={`tel:${BUSINESS.phone}`}>
            Call {BUSINESS.displayPhone}
          </a>
        </div>
      </div>
    </section>
  );
}
