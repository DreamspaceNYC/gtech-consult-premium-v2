import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import "./ShimmerButton.css";

/**
 * ShimmerButton — Magic UI button with an animated shine sweep, copied into
 * the repo and adapted: the original is motion/react-based and button-only;
 * this version is CSS-only (no motion dependency, honours
 * prefers-reduced-motion) and renders an <a> when `href` is provided so it
 * can back link CTAs such as the header WhatsApp button.
 */
interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: ReactNode;
  /** When provided, renders an <a> instead of a <button>. */
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "100px",
  background = "rgba(0, 0, 0, 1)",
  className,
  children,
  href,
  ...props
}: ShimmerButtonProps) {
  const style = {
    "--shimmer-color": shimmerColor,
    "--shimmer-size": shimmerSize,
    "--shimmer-duration": shimmerDuration,
    "--shimmer-radius": borderRadius,
    "--shimmer-bg": background,
  } as CSSProperties;
  const cls = cn("gtr-shimmer-button", className);
  const inner = (
    <span className="gtr-shimmer-button__inner">{children}</span>
  );

  if (href) {
    const { type: _type, ...anchorProps } = props;
    void _type;
    return (
      <a
        href={href}
        style={style}
        className={cls}
        {...(anchorProps as ComponentPropsWithoutRef<"a">)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button style={style} className={cls} {...props}>
      {inner}
    </button>
  );
}
