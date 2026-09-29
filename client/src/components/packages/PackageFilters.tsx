import {
  useCallback,
  useId,
  useRef,
  type KeyboardEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./package-filters.css";

export type PackageFilter = { id: string; label: string };

/* Spring constants reused from the 21st animated filter grid. */
const CELL = {
  type: "spring",
  stiffness: 520,
  damping: 34,
  mass: 0.45,
} as const;
const INSTANT = { duration: 0 } as const;

export function PackageFilters({
  filters,
  activeId,
  onChange,
  counts,
}: {
  filters: PackageFilter[];
  activeId: string;
  onChange: (id: string) => void;
  counts?: Record<string, number>;
}) {
  const uid = useId();
  const reduced = useReducedMotion();
  const chips = useRef<(HTMLButtonElement | null)[]>([]);

  const index = Math.max(
    0,
    filters.findIndex(f => f.id === activeId)
  );
  const active = filters[index] ?? filters[0];

  const go = useCallback(
    (i: number) => {
      const n = filters.length;
      if (n === 0) return;
      const next = filters[((i % n) + n) % n];
      if (!next) return;
      chips.current[((i % n) + n) % n]?.focus();
      onChange(next.id);
    },
    [filters, onChange]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(filters.length - 1);
    }
  };

  const swap = reduced ? INSTANT : CELL;

  return (
    <div className="pkg-filters">
      <div
        role="radiogroup"
        aria-label="Filter packages by price"
        className="pkg-chips"
      >
        {filters.map((filter, i) => {
          const on = i === index;
          return (
            <button
              key={filter.id}
              ref={node => {
                chips.current[i] = node;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(filter.id)}
              onKeyDown={e => onKeyDown(e, i)}
              className="pkg-chip"
              style={{ touchAction: "manipulation" }}
            >
              {on ? (
                <motion.span
                  aria-hidden
                  layoutId={reduced ? undefined : `${uid}-thumb`}
                  transition={CELL}
                  className="pkg-chip-thumb"
                />
              ) : null}
              <span className="pkg-chip-labels">
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: on ? 0 : 1 }}
                  transition={swap}
                  className="pkg-chip-text pkg-chip-off"
                >
                  {filter.label}
                  {counts && (
                    <span className="pkg-chip-count">{counts[filter.id] ?? 0}</span>
                  )}
                </motion.span>
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: on ? 1 : 0 }}
                  transition={swap}
                  className="pkg-chip-text pkg-chip-on"
                >
                  {filter.label}
                  {counts && (
                    <span className="pkg-chip-count">{counts[filter.id] ?? 0}</span>
                  )}
                </motion.span>
                <span className="sr-only">
                  {filter.label}
                  {counts
                    ? `, ${counts[filter.id] ?? 0} of ${Object.values(counts).reduce((a, b) => a + b, 0)}`
                    : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {active?.label}: showing packages
      </p>
    </div>
  );
}
