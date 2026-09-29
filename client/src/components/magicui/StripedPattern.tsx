import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * StripedPattern — Magic UI background pattern, copied into the repo.
 * Diagonal striped SVG background. Colour comes from CSS `color`
 * (currentColor); set it via the `gt-pattern` classes in inner-pages.css.
 */
type StripedPatternProps = React.SVGProps<SVGSVGElement> & {
  direction?: "left" | "right";
  width?: number;
  height?: number;
  className?: string;
};

export function StripedPattern({
  direction = "left",
  width = 12,
  height = 12,
  className,
  ...props
}: StripedPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn("gt-striped-pattern", className)}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternTransform={direction === "right" ? "rotate(45)" : "rotate(-45)"}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={height}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
