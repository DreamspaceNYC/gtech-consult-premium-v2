import type { ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import "./bento-grid.css";

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("gtr-bento-grid", className)}>{children}</div>;
}

interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: LucideIcon;
  description: string;
  href: string;
  cta: string;
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: BentoCardProps) {
  return (
    <a href={href} className={cn("gtr-bento-card", className)}>
      {background && (
        <div className="gtr-bento-card__bg" aria-hidden="true">
          {background}
        </div>
      )}
      <div className="gtr-bento-card__content">
        {Icon && (
          <span className="gtr-bento-card__icon">
            <Icon size={22} aria-hidden="true" />
          </span>
        )}
        <h3 className="gtr-bento-card__name">{name}</h3>
        <p className="gtr-bento-card__desc">{description}</p>
        <span className="gtr-bento-card__cta">
          {cta} <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
