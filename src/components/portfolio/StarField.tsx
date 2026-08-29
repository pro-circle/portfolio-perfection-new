import { useMemo } from "react";

type Star = {
  top: number;
  left: number;
  size: number;
  hue: number;
  duration: number;
  delay: number;
};

/** Minimal ambient glowing stars scattered across the page (fixed, low density). */
export const StarField = () => {
  const stars = useMemo<Star[]>(() => {
    // Deterministic-ish spread: 5 columns x 5 rows, one jittered star per cell-ish, sparse.
    const seeds = [
      [6, 9], [24, 4], [48, 12], [72, 7], [92, 18],
      [12, 33], [37, 27], [63, 38], [86, 30],
      [4, 56], [29, 62], [55, 51], [79, 66], [95, 47],
      [17, 82], [44, 74], [68, 88], [90, 79],
    ];
    return seeds.map(([left, top], i) => ({
      left,
      top,
      size: i % 4 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
      hue: i % 3 === 0 ? 45 : 205,
      duration: 4 + ((i * 7) % 5),
      delay: (i * 0.7) % 6,
    }));
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {stars.map((s, i) => (
        <span
          key={i}
          className="ambient-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            ["--star-hue" as string]: `${s.hue}`,
            ["--star-twinkle-duration" as string]: `${s.duration}s`,
            ["--star-twinkle-delay" as string]: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
