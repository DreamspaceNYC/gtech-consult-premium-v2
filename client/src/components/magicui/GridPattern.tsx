import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * GridPattern — Magic UI background pattern, copied into the repo.
 * Static SVG grid. Colour comes from CSS `color` (currentColor);
 * set it via the `gt-pattern` classes in inner-pages.css or your own.
 */
type GridPatternProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[number, number]>;
  strokeDasharray?: string;
  className?: string;
};

export function GridPattern({
  width = 44,
  height = 44,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn("gt-grid-pattern", className)}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy], i) => (
            <rect
              key={`${sx}-${sy}-${i}`}
              strokeWidth="0"
              width={width - 1}
              height={height - 1}
              x={sx * width + 1}
              y={sy * height + 1}
              fill="currentColor"
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
