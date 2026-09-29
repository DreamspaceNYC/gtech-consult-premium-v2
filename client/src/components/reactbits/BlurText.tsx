import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BlurText — React Bits text reveal, copied into the repo.
 * Splits text into words/characters and reveals them with a blur + rise,
 * staggered, when the element scrolls into view.
 *
 * Adapted: `motion/react` imports rewritten to `framer-motion`
 * (the installed package). Renders the semantic tag via the `as` prop
 * and renders plain text when the user prefers reduced motion.
 */
type BlurTextProps = {
  text: string;
  /** ms between each word/character step */
  delay?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  /** seconds each step takes */
  stepDuration?: number;
  className?: string;
  id?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

const PLAIN_TAGS = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
  span: "span",
} as const;

export function BlurText({
  text,
  delay = 70,
  animateBy = "words",
  direction = "top",
  stepDuration = 0.45,
  className,
  id,
  as = "p",
}: BlurTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  const segments = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const from =
    direction === "top"
      ? { filter: "blur(12px)", opacity: 0, y: -26 }
      : { filter: "blur(12px)", opacity: 0, y: 26 };
  const to = { filter: "blur(0px)", opacity: 1, y: 0 };

  if (reduced) {
    const Plain = PLAIN_TAGS[as] as "p";
    return (
      <Plain id={id} className={className}>
        {text}
      </Plain>
    );
  }

  const MotionTag = MOTION_TAGS[as];

  return (
    <MotionTag
      // framer-motion polymorphic refs are loosely typed; the host tag matches `as`.
      ref={ref as never}
      id={id}
      className={cn("blur-text", className)}
      aria-label={text}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${index}-${segment}`}
          className="blur-text-segment"
          aria-hidden="true"
          initial={from}
          animate={inView ? to : from}
          transition={{
            duration: stepDuration,
            delay: (delay / 1000) * index,
            ease: [0.22, 0.9, 0.3, 1],
          }}
        >
          {segment === " " ? " " : segment}
          {animateBy === "words" && index < segments.length - 1 ? " " : null}
        </motion.span>
      ))}
    </MotionTag>
  );
}
