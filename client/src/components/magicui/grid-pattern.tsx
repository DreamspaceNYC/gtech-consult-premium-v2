import { useId } from "react";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
}

/**
 * Magic UI GridPattern — a decorative SVG grid backdrop.
 * Purely presentational; parent should set aria-hidden.
 */
export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  ...props
}: GridPatternProps) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
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
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {Array.from({ length: numSquares }, (_, i) => {
          const pos = getRandomPosition(id, i, maxOpacity);
          return (
            <rect
              {...pos}
              key={i}
              width={width - 1}
              height={height - 1}
              fill="currentColor"
              strokeWidth="0"
            />
          );
        })}
      </svg>
    </svg>
  );
}

function getRandomPosition(id: string, index: number, maxOpacity: number) {
  // Deterministic pseudo-random from the id + index so SSR/hydration match.
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + index * 7919;
  const rand = (salt: number) => {
    const x = Math.sin(seed * 9973 + salt * 613) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    x: Math.floor(rand(1) * 20) * 41 - 20,
    y: Math.floor(rand(2) * 14) * 41,
    opacity: rand(3) * maxOpacity,
  };
}
