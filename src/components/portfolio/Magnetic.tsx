import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  /** Max nudge in px toward the cursor. */
  strength?: number;
  className?: string;
}

/** Wraps an interactive element so it nudges a few px toward the cursor. */
export default function Magnetic({ children, strength = 6, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 20, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 20, mass: 0.4 });

  if (reduce) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      style={{ x, y, display: "inline-flex" }}
      className={className}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        mx.set(Math.max(-1, Math.min(1, dx)) * strength);
        my.set(Math.max(-1, Math.min(1, dy)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
