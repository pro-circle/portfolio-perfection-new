import { useEffect, useState } from "react";

type Star = {
  id: number;
  top: number;
  left: number;
  angle: number;
  length: number;
  duration: number;
};

/** Occasional minimal shooting star streaking across the page. */
export const ShootingStar = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let id = 0;

    const schedule = () => {
      const delay = 5000 + Math.random() * 9000;
      timer = window.setTimeout(() => {
        const star: Star = {
          id: id++,
          top: 5 + Math.random() * 55,
          left: Math.random() * 70,
          angle: 15 + Math.random() * 25,
          length: 140 + Math.random() * 160,
          duration: 1.1 + Math.random() * 0.6,
        };
        setStars((prev) => [...prev, star]);
        window.setTimeout(
          () => setStars((prev) => prev.filter((s) => s.id !== star.id)),
          star.duration * 1000 + 100,
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
          className="shooting-star"
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
