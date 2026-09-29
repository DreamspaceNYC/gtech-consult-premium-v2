import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import { motion, type MotionStyle } from "framer-motion";
import "./blur-text.css";

type AnimationFrom = { filter?: string; opacity?: number; y?: number };
type AnimationTo = { filter?: string; opacity?: number; y?: number };

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "chars";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationFrom;
  animationTo?: AnimationTo | AnimationTo[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  /** Rendered element tag, e.g. "h1" so the animated headline stays semantic. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * React Bits BlurText — blur-to-sharp reveal, triggered by viewport
 * intersection. Respects prefers-reduced-motion (renders plain text).
 */
export function BlurText({
  text = "",
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = t => t * t * (3 - 2 * t),
  onAnimationComplete,
  stepDuration = 0.35,
  as = "p",
}: BlurTextProps) {
  const segments = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy],
  );
  const [inView, setInView] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

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
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom: AnimationFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo: AnimationTo = useMemo(
    () => ({ filter: "blur(0px)", opacity: 1, y: 0 }),
    [],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = useMemo(
    () => (animationTo ? (Array.isArray(animationTo) ? animationTo : [animationTo]) : [defaultTo]),
    [animationTo, defaultTo],
  );

  const stepCount = toSnapshots.length + 1;
  const totalSteps = stepCount * segments.length;

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const completedSteps = Math.min(
        totalSteps,
        Math.floor(elapsed / stepDuration),
      );
      setCompleted(completedSteps);
      if (completedSteps >= totalSteps) {
        onAnimationComplete?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, totalSteps, stepDuration, onAnimationComplete]);

  const getStepStyle = (segmentIndex: number): MotionStyle => {
    if (!inView || reduced) return toSnapshots[toSnapshots.length - 1] as MotionStyle;
    const globalStep = Math.min(completed - segmentIndex * stepCount, stepCount);
    const step = Math.max(0, Math.min(globalStep, toSnapshots.length));
    const snapshot =
      step === 0 ? fromSnapshot : toSnapshots[Math.min(step - 1, toSnapshots.length - 1)];
    const progress = Math.min(globalStep - step, 1);
    const eased = easing(progress);
    const from = step === 0 ? fromSnapshot : toSnapshots[Math.max(step - 2, 0)];
    const style: MotionStyle = {};
    style.filter = progress >= 1 ? snapshot.filter : from.filter;
    style.opacity =
      typeof from.opacity === "number" && typeof snapshot.opacity === "number"
        ? from.opacity + (snapshot.opacity - from.opacity) * eased
        : progress >= 1
          ? snapshot.opacity
          : from.opacity;
    style.y =
      typeof from.y === "number" && typeof snapshot.y === "number"
        ? from.y + (snapshot.y - from.y) * eased
        : progress >= 1
          ? snapshot.y
          : from.y;
    return style;
  };

  const Tag = as as "p";

  return (
    <Tag
      ref={ref as Ref<HTMLParagraphElement>}
      className={`gtr-blur-text ${className}`}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={index}
          className="gtr-blur-text__segment"
          style={getStepStyle(index)}
          transition={{ delay: (index * delay) / 1000 }}
          aria-hidden="true"
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < segments.length - 1 && "\u00A0"}
        </motion.span>
      ))}
      <span className="gtr-blur-text__sr">{text}</span>
    </Tag>
  );
}
