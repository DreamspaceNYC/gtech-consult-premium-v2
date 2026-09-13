import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS, ASSESSMENT_URL } from "@/content/business";

export function ContactCta({
  heading = "Let’s assess the right solution for your property",
}: {
  heading?: string;
}) {
  return (
    <section className="contact-cta">
      <div className="container contact-cta-inner">
        <div>
          <p className="page-eyebrow">Talk to G-Tech Consult</p>
          <h2>{heading}</h2>
          <p>
            Tell us what you want to power, secure or automate. We’ll confirm
            the next assessment step.
          </p>
        </div>
        <div className="contact-cta-actions">
          <a className="store-button green" href={ASSESSMENT_URL}>
            <MessageCircle aria-hidden="true" size={16} />
            Chat on WhatsApp
          </a>
          <a className="store-button dark" href={`tel:${BUSINESS.phone}`}>
            <Phone aria-hidden="true" size={16} />
            Call {BUSINESS.displayPhone}
          </a>
        </div>
      </div>
    </section>
  );
}
