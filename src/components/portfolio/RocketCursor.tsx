import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: "flame" | "spark" | "smoke";
};

const TAU = Math.PI * 2;

/**
 * Rocket mouse cursor: 3D-styled rocket SVG that stays fixed pointing slightly
 * above the top-left (like a traditional cursor arrow). The rocket tip is the
 * cursor tip, with a spring-smoothed flame, motion trails, spark particles and a
 * glowing exhaust rendered on a canvas at display refresh rate (up to 120 FPS).
 */
export const RocketCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const canvas = canvasRef.current;
    const rocket = rocketRef.current;
    if (!canvas || !rocket) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    document.documentElement.classList.add("rocket-cursor-active");

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pointer target + rocket position
    let tx = w / 2;
    let ty = h / 2;
    let px = tx;
    let py = ty;
    let vx = 0;
    let vy = 0;
    let thrust = 0;
    let visible = false;

    // Rocket points slightly above the top-left diagonal, like a traditional
    // cursor arrow but angled a touch toward the right/up.
    const angle = -Math.PI * 0.62;
    const tipDistance = 17.8;
    const tipX = Math.cos(angle) * tipDistance;
    const tipY = Math.sin(angle) * tipDistance;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        px = tx;
        py = ty;
        rocket.style.opacity = "1";
      }
    };
    const onLeave = () => {
      visible = false;
      rocket.style.opacity = "0";
    };
    const onEnter = () => {
      visible = true;
      rocket.style.opacity = "1";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    const particles: Particle[] = [];
    const trail: { x: number; y: number; a: number }[] = [];

    let raf = 0;
    let last = performance.now();
    let t = 0;

    const spawn = (
      x: number,
      y: number,
      dirX: number,
      dirY: number,
      speed: number,
      kind: Particle["kind"],
    ) => {
      const spread = kind === "spark" ? 0.9 : 0.45;
      const a = Math.atan2(dirY, dirX) + (Math.random() - 0.5) * spread;
      const s = speed * (0.5 + Math.random());
      particles.push({
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0,
        maxLife: kind === "spark" ? 420 + Math.random() * 320 : kind === "smoke" ? 620 : 260,
        size: kind === "spark" ? 1 + Math.random() * 1.4 : kind === "smoke" ? 5 + Math.random() * 6 : 3 + Math.random() * 4,
        kind,
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 40);
      last = now;
      t += dt;

      // 1:1 pointer tracking (no lag), velocity only drives the flame
      const prevX = px;
      const prevY = py;
      px = tx;
      py = ty;
      const dx = px - prevX;
      const dy = py - prevY;
      const instVx = (dx / dt) * 16.67;
      const instVy = (dy / dt) * 16.67;
      const vSmooth = 1 - Math.pow(0.02, dt / 1000);
      vx += (instVx - vx) * vSmooth;
      vy += (instVy - vy) * vSmooth;

      const speed = Math.hypot(vx, vy);

      // thrust eases in on movement, idles low at rest
      const targetThrust = Math.min(1, speed / 14);
      thrust += (targetThrust - thrust) * Math.min(1, 0.01 * dt);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      // the rocket tip sits on the pointer, so the nozzle is ~30px behind it
      const ex = px - cos * 30;
      const ey = py - sin * 30;

      // motion trail
      if (thrust > 0.12) {
        trail.push({ x: ex, y: ey, a: Math.min(1, thrust) });
        if (trail.length > 26) trail.shift();
      } else if (trail.length) {
        trail.shift();
      }

      // emission
      const flameCount = 1 + Math.round(thrust * 3);
      for (let i = 0; i < flameCount; i++) {
        spawn(ex, ey, -cos, -sin, 0.35 + thrust * 2.4, "flame");
      }
      if (Math.random() < 0.35 + thrust * 0.6) {
        spawn(ex, ey, -cos, -sin, 0.6 + thrust * 3.2, "spark");
      }
      if (thrust > 0.35 && Math.random() < 0.4) {
        spawn(ex, ey, -cos, -sin, 0.3 + thrust, "smoke");
      }

      ctx.clearRect(0, 0, w, h);
      if (!visible) {
        for (const p of particles) p.life += dt * 2;
      }

      ctx.globalCompositeOperation = "lighter";

      // trail ribbon
      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i]!;
          const b = trail[i - 1]!;
          const k = i / trail.length;
          ctx.strokeStyle = `hsla(28, 100%, 62%, ${0.14 * k * a.a})`;
          ctx.lineWidth = 8 * k * a.a;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
      }

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const k = 1 - p.life / p.maxLife;
        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);
        p.vx *= 0.97;
        p.vy *= 0.97;
        if (p.kind === "smoke") p.vy -= 0.004 * dt;

        if (p.kind === "flame") {
          const r = p.size * (0.5 + k);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          g.addColorStop(0, `hsla(52, 100%, 78%, ${0.85 * k})`);
          g.addColorStop(0.45, `hsla(30, 100%, 58%, ${0.55 * k})`);
          g.addColorStop(1, "hsla(12, 100%, 50%, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, TAU);
          ctx.fill();
        } else if (p.kind === "spark") {
          ctx.fillStyle = `hsla(46, 100%, 72%, ${0.9 * k})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * k, 0, TAU);
          ctx.fill();
        } else {
          ctx.fillStyle = `hsla(24, 30%, 70%, ${0.06 * k})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1.6 - k), 0, TAU);
          ctx.fill();
        }
      }

      // glowing exhaust core (idle flicker at rest, long plume on thrust)
      const flicker = 0.85 + Math.sin(t / 90) * 0.1 + Math.sin(t / 37) * 0.05;
      const plume = (10 + thrust * 42) * flicker;
      const cx = ex - cos * plume * 0.35;
      const cy = ey - sin * plume * 0.35;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, plume);
      core.addColorStop(0, `hsla(50, 100%, 92%, ${0.55 + thrust * 0.35})`);
      core.addColorStop(0.35, `hsla(32, 100%, 60%, ${0.35 + thrust * 0.3})`);
      core.addColorStop(1, "hsla(10, 100%, 50%, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, plume, 0, TAU);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";

      // The wrapper is pre-centred with negative margins, so the element centre
      // sits at the translate3d point. Offsetting by the tip vector puts the
      // nose tip exactly on the pointer; scaleY(-1) keeps the mirrored rocket
      // right-side up while pointing top-left.
      rocket.style.transform = `translate3d(${px - tipX}px, ${py - tipY}px, 0) rotate(${angle}rad) scaleY(-1)`;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("rocket-cursor-active");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 hidden md:block" style={{ zIndex: 2147483000 }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        ref={rocketRef}
        style={{ width: 38, height: 38, marginLeft: -19, marginTop: -19 }}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-200 will-change-transform"
      >
        {/* rocket points to +X; rotated ~-112° it points above top-left like a traditional cursor */}
        <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="rc-body" x1="0" y1="18" x2="0" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#f2f5f8" />
              <stop offset="1" stopColor="#b8c2cc" />
            </linearGradient>
            <linearGradient id="rc-fin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4aa8ff" />
              <stop offset="1" stopColor="#0e6fd6" />
            </linearGradient>
            <linearGradient id="rc-nozzle" x1="0" y1="20" x2="0" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#6b7480" />
              <stop offset="1" stopColor="#2b3138" />
            </linearGradient>
            <radialGradient id="rc-glass" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#bfeaff" />
              <stop offset="1" stopColor="#0f9ede" />
            </radialGradient>
          </defs>

          {/* fins */}
          <path d="M26 30 L14 14 L14 28 Z" fill="url(#rc-fin)" />
          <path d="M26 34 L14 50 L14 36 Z" fill="url(#rc-fin)" />

          {/* nozzle */}
          <path d="M12 27 h10 v10 h-10 a3 3 0 0 1 0 -10 Z" fill="url(#rc-nozzle)" />

          {/* body */}
          <path
            d="M20 24 h20 c10 0 18 4 22 8 -4 4 -12 8 -22 8 H20 c-3 0 -5 -3 -5 -8 s2 -8 5 -8 Z"
            fill="url(#rc-body)"
          />
          {/* highlight for the 3D feel */}
          <path
            d="M21 26 h19 c8 0 15 3 19 6 -1 0 -3 -1 -5 -1 -6 -2 -10 -3 -15 -3 H21 Z"
            fill="#ffffff"
            opacity="0.75"
          />
          <path d="M22 37 h20 c6 0 11 -1 15 -3 -4 3 -11 5 -18 5 H22 Z" fill="#8f9aa6" opacity="0.6" />

          {/* window */}
          <circle cx="38" cy="32" r="6" fill="#3a4450" />
          <circle cx="38" cy="32" r="4.4" fill="url(#rc-glass)" />
          <circle cx="36.4" cy="30.4" r="1.3" fill="#ffffff" opacity="0.85" />

          {/* blue nose cone at the tip */}
          <path d="M48 26.4 c8 1.6 13 4.4 14 5.6 -1 1.2 -6 4 -14 5.6 c3 -2 4.4 -3.8 4.4 -5.6 s-1.4 -3.6 -4.4 -5.6 Z" fill="url(#rc-fin)" />

        </svg>
      </div>
    </div>
  );
};
