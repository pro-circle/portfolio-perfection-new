import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}

/** Subtle perspective tilt with a light sheen that follows the pointer. */
export default function TiltCard({ children, className, max = 4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--tilt-x", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--sheen-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-y", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-o", "1");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--sheen-o", "0");
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className ?? ""}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      <div className="tilt-card__inner">
        {children}
        <span className="tilt-card__sheen" aria-hidden="true" />
      </div>
    </div>
  );
}
