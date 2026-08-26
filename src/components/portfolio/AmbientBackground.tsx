import { useEffect, useRef } from "react";

/**
 * Very slow-moving mesh gradient + faint grid that drifts toward the cursor.
 * Purely decorative, sits behind all content at low opacity.
 */
export default function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0.5;
    let targetY = 0.4;
    let x = 0.5;
    let y = 0.4;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };

    const tick = () => {
      x += (targetX - x) * 0.025;
      y += (targetY - y) * 0.025;
      el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
      el.style.setProperty("--gx", `${((x - 0.5) * -18).toFixed(2)}px`);
      el.style.setProperty("--gy", `${((y - 0.5) * -18).toFixed(2)}px`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="ambient-bg">
      <div className="ambient-bg__mesh" />
      <div className="ambient-bg__grid" />
    </div>
  );
}
