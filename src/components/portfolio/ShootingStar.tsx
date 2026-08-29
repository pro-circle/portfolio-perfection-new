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
      const delay = 9000 + Math.random() * 14000;
      timer = window.setTimeout(() => {
        const star: Star = {
          id: id++,
          top: 3 + Math.random() * 60,
          left: Math.random() * 65,
          angle: 12 + Math.random() * 30,
          length: 180 + Math.random() * 220,
          duration: 2.6 + Math.random() * 1.8,
        };
        setStars((prev) => [...prev, star]);
        window.setTimeout(
          () => setStars((prev) => prev.filter((s) => s.id !== star.id)),
          star.duration * 1000 + 200,
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
