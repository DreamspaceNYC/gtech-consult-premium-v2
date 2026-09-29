import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import "./marquee.css";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on mouse hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "gtr-marquee",
        reverse && "gtr-marquee--reverse",
        pauseOnHover && "gtr-marquee--pause-on-hover",
        className,
      )}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div key={i} className="gtr-marquee__content" aria-hidden={i > 0}>
          {children}
        </div>
      ))}
    </div>
  );
}
