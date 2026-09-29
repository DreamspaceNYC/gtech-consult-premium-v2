import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CountUp — React Bits number tween, copied into the repo.
 * Animates from `start` to `end` when scrolled into view.
 * Use only with real numbers from content (step counts, card counts…),
 * never invented stats. Jumps straight to `end` on reduced motion.
 */
type CountUpProps = {
  end: number;
  start?: number;
  /** seconds */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
};

export function CountUp({
  end,
  start = 0,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-32px" });
  const [value, setValue] = useState(start);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setValue(end);
    }
  }, [end]);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(start, end, {
      duration,
      ease: [0.22, 0.9, 0.3, 1],
      onUpdate: v => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduced, start, end, duration]);

  const [intPart, fracPart] = value.toFixed(decimals).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const formatted =
    fracPart !== undefined ? `${grouped}.${fracPart}` : grouped;

  return (
    <span ref={ref} className={cn("count-up", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
