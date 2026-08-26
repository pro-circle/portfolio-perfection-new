import { useRef, type ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  /** Max nudge in px toward the cursor. */
  strength?: number;
  className?: string;
}

/**
 * Nudges an interactive element a few px toward the cursor.
 * Plain CSS transforms (no animation library) so it stays cheap.
 */
export default function Magnetic({ children, strength = 6, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const clamp = (v: number) => Math.max(-1, Math.min(1, v)) * strength;
    el.style.transform = `translate3d(${clamp(dx).toFixed(1)}px, ${clamp(dy).toFixed(1)}px, 0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className ?? ""}`}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </span>
  );
}
