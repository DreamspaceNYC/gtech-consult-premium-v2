import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  stagger?: number;
  duration?: number;
  initial?: Record<string, number>;
  animate?: Record<string, number>;
  exit?: Record<string, number>;
  className?: string;
  children: ReactNode;
}

/**
 * React Bits AnimatedList — staggered entrance for grid children,
 * triggered once by viewport intersection. Adapts motion/react -> framer-motion.
 * Respects prefers-reduced-motion (renders children statically).
 */
export function AnimatedList({
  stagger = 0.1,
  duration = 0.5,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: -20 },
  className,
  children,
}: AnimatedListProps) {
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={cn(className)}>
      {items.map((child, i) => (
        <motion.div
          key={(child as { key?: string | number })?.key ?? i}
          initial={reduced ? false : initial}
          animate={reduced ? undefined : inView ? animate : initial}
          exit={reduced ? undefined : exit}
          transition={{ duration, delay: reduced ? 0 : i * stagger }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
