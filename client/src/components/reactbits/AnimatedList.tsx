import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * AnimatedList — React Bits staggered list entrance, copied into the repo.
 * Children animate in one after another when the container scrolls into
 * view. Adapted: `motion/react` imports rewritten to `framer-motion`.
 *
 * `containerAs`/`itemAs` keep list semantics valid (e.g. ol > li);
 * with reduced motion the children render statically.
 */
type AnimatedListProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  /** seconds between each item */
  stagger?: number;
  /** seconds each item's animation takes */
  duration?: number;
  /** base delay in seconds before the first item */
  delay?: number;
  /** vertical travel distance in px */
  y?: number;
  containerAs?: "div" | "ol" | "ul";
  itemAs?: "div" | "li";
};

export function AnimatedList({
  children,
  className,
  itemClassName,
  stagger = 0.08,
  duration = 0.55,
  delay = 0,
  y = 26,
  containerAs = "div",
  itemAs = "div",
}: AnimatedListProps) {
  const ref = useRef<HTMLDivElement | HTMLOListElement | HTMLUListElement | null>(
    null,
  );
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -32px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = Children.toArray(children);
  const Container =
    containerAs === "ol" ? "ol" : containerAs === "ul" ? "ul" : "div";
  const Item = itemAs === "li" ? motion.li : motion.div;
  const StaticItem = itemAs === "li" ? "li" : "div";

  return (
    <Container ref={ref as never} className={className}>
      {items.map((child, index) =>
        reduced ? (
          <StaticItem key={index} className={itemClassName}>
            {child}
          </StaticItem>
        ) : (
          <Item
            key={index}
            className={cn("animated-list-item", itemClassName)}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{
              duration,
              delay: delay + index * stagger,
              ease: [0.22, 0.9, 0.3, 1],
            }}
          >
            {child}
          </Item>
        ),
      )}
    </Container>
  );
}
