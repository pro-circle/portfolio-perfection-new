import { useEffect, useState } from "react";

type Variant = "fire" | "smoke" | "blue";

type Star = {
  id: number;
  top: number;
  left: number;
  angle: number;
  length: number;
  duration: number;
  variant: Variant;
};

const VARIANTS: Variant[] = ["fire", "smoke", "blue"];

/** Occasional realistic shooting star streaking across the page (3 random looks). */
export const ShootingStar = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let id = 0;

    const schedule = () => {
      const delay = 11000 + Math.random() * 16000;
      timer = window.setTimeout(() => {
        const variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]!;
        const star: Star = {
          id: id++,
          top: 3 + Math.random() * 55,
          left: Math.random() * 60,
          angle: 14 + Math.random() * 28,
          length:
            variant === "blue"
              ? 220 + Math.random() * 260
              : variant === "fire"
                ? 150 + Math.random() * 180
                : 190 + Math.random() * 220,
          duration: (variant === "blue" ? 4.2 : 5.2) + Math.random() * 2.2,
          variant,
        };
        setStars((prev) => [...prev, star]);
        window.setTimeout(
          () => setStars((prev) => prev.filter((s) => s.id !== star.id)),
          star.duration * 1000 + 300,
        );
        schedule();
      }, delay);
    };
    schedule();

    return () => window.clearTimeout(timer);
  }, []);

  if (!stars.length) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 5 }}>
      {stars.map((s) => (
        <span
          key={s.id}
          className={`shooting-star shooting-star--${s.variant}`}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.length}px`,
            ["--star-angle" as string]: `${s.angle}deg`,
            ["--star-duration" as string]: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ShootingStar;
