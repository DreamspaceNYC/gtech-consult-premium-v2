/**
 * Hero3DSection — SSR-safe lazy wrapper for the interactive 3D hero.
 *
 * The prerender pipeline server-renders every route, so on the server (and
 * before client hydration checks complete) this renders a static fallback:
 * the poster image plus the three product captions as plain HTML.
 *
 * On the client the real 3D scene is loaded lazily (React.lazy) inside
 * Suspense, mounted only when the section is near the viewport
 * (IntersectionObserver, 400px root margin). If the user prefers reduced
 * motion, or WebGL context creation fails, the static fallback stays
 * permanently — no canvas is ever created.
 *
 * Headline text and CTA buttons live outside this component (the homepage
 * renders them over/beside it); this section is the visual canvas area only.
 */
import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { BatteryCharging, PlugZap, Sun } from "lucide-react";

const Hero3D = lazy(() => import("./Hero3D"));

const POSTER = "/images/hero3d/solar-panel-1.png";

const CAPTIONS = [
  {
    id: "panel",
    copy: "Solar panels — harvest sunlight and convert it into electricity.",
    Icon: Sun,
  },
  {
    id: "battery",
    copy: "Lithium battery — stores power for nighttime and cloudy days.",
    Icon: BatteryCharging,
  },
  {
    id: "inverter",
    copy: "Hybrid inverter — converts stored power into clean AC for your home and office.",
    Icon: PlugZap,
  },
];

/** Static fallback: poster image + the three captions as plain HTML. */
function StaticFallback() {
  return (
    <div className="flex min-h-[52vh] w-full flex-col items-center justify-center gap-6 px-6 py-10 lg:min-h-[70vh]">
      <img
        src={POSTER}
        alt="G-Tech solar panel, lithium battery and hybrid inverter"
        className="w-full max-w-3xl rounded-2xl object-cover shadow-xl"
        loading="lazy"
        decoding="async"
      />
      <ul className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {CAPTIONS.map(({ id, copy, Icon }) => (
          <li
            key={id}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4"
          >
            <Icon size={20} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
            <p className="text-sm leading-relaxed text-slate-200">{copy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Suspense fallback while the 3D chunk loads: poster image only. */
function PosterFallback() {
  return (
    <div className="flex min-h-[52vh] w-full items-center justify-center px-6 py-10 lg:min-h-[70vh]">
      <img
        src={POSTER}
        alt="G-Tech solar products"
        className="w-full max-w-3xl rounded-2xl object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface BoundaryState {
  failed: boolean;
}

/** Section-scoped error boundary: a failed WebGL context keeps the static fallback. */
class SectionErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero3DSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [canRender3D, setCanRender3D] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);

  // Client-only capability check: reduced motion or no WebGL -> static fallback forever.
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanRender3D(!reducedMotion && webglAvailable());
  }, []);

  // Mount the heavy 3D chunk only when the section is near the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3D = canRender3D && nearViewport;

  return (
    <section
      ref={sectionRef}
      aria-label="G-Tech solar products in 3D"
      className="relative w-full min-h-[52vh] overflow-hidden lg:min-h-[70vh]"
    >
      {show3D ? (
        <SectionErrorBoundary fallback={<StaticFallback />}>
          <Suspense fallback={<PosterFallback />}>
            <Hero3D />
          </Suspense>
        </SectionErrorBoundary>
      ) : (
        <StaticFallback />
      )}
    </section>
  );
}
