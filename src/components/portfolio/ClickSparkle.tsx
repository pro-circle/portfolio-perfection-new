import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

/** Mini sparkle burst wherever the user clicks. */
export const ClickSparkle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let sparks: Spark[] = [];
    let raf = 0;

    const onDown = (e: PointerEvent) => {
      const count = 12;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 1.2 + Math.random() * 2.6;
        const maxLife = 320 + Math.random() * 260;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          size: 1 + Math.random() * 1.8,
          hue: Math.random() < 0.5 ? 45 : 205,
        });
      }
    };
    window.addEventListener("pointerdown", onDown);

    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 40);
      last = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (!sparks.length) return;

      ctx.globalCompositeOperation = "lighter";
      sparks = sparks.filter((s) => {
        s.life -= dt;
        if (s.life <= 0) return false;
        s.x += s.vx * (dt / 16);
        s.y += s.vy * (dt / 16);
        s.vx *= 0.94;
        s.vy = s.vy * 0.94 + 0.045 * (dt / 16);

        const t = s.life / s.maxLife;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 100%, ${65 + 20 * t}%, ${t})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${s.hue}, 100%, 70%, ${t})`;
        ctx.arc(s.x, s.y, s.size * t + 0.4, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 2147483001 }}
    />
  );
};

export default ClickSparkle;
