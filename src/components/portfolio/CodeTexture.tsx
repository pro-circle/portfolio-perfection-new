import { useEffect, useRef } from "react";

interface CodeTextureProps {
  className?: string;
}

// Elegant "code-as-texture" hero visual.
// Renders faint, monospaced lines of code that slowly drift upward,
// with occasional token highlights in the accent color. Purely
// decorative — no literal branding, no photo.
const SNIPPETS = [
  "const build = (idea) => ship(idea);",
  "async function think(input) {",
  "  const ctx = await embed(input);",
  "  return model.generate(ctx);",
  "}",
  "type Vector = Float32Array;",
  "for (const token of stream) yield token;",
  "export interface Agent {",
  "  reason(): Promise<Plan>;",
  "  act(plan: Plan): Promise<Result>;",
  "}",
  "// craft. iterate. deploy.",
  "if (curious) keepLearning();",
  "const design = form + function;",
  "await Promise.all(ideas.map(build));",
  "return elegance;",
  "pipeline(parse, plan, execute);",
  "const answer = await ask(question);",
  "graph.traverse((node) => visit(node));",
  "0x1A 0x2F 0xE4 0x91 0x7C 0x03",
  "[INFO] context window: 128k tokens",
  "→ retrieval · reasoning · response",
];

export default function CodeTexture({ className }: CodeTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const getHsl = (name: string, alpha = 1) => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return raw ? `hsl(${raw} / ${alpha})` : `hsl(0 0% 50% / ${alpha})`;
    };

    type Line = {
      y: number;
      text: string;
      highlight: boolean;
      alpha: number;
    };

    const lineHeight = 18;
    let lines: Line[] = [];

    const makeText = () => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rows = Math.ceil(height / lineHeight) + 4;
      lines = new Array(rows).fill(0).map((_, i) => ({
        y: i * lineHeight,
        text: makeText(),
        highlight: Math.random() < 0.18,
        alpha: 0.25 + Math.random() * 0.55,
      }));
    };

    const speed = 0.18;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const base = getHsl("--muted-foreground", 1);
      const accent = getHsl("--accent", 1);

      ctx.font =
        "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textBaseline = "top";

      for (const line of lines) {
        line.y -= speed;
        if (line.y + lineHeight < 0) {
          line.y = height + Math.random() * lineHeight;
          line.text = makeText();
          line.highlight = Math.random() < 0.18;
          line.alpha = 0.25 + Math.random() * 0.55;
        }

        // subtle vertical vignette — fade near top/bottom edges
        const edgeFade =
          Math.min(1, line.y / 40) *
          Math.min(1, (height - line.y) / 40);

        ctx.globalAlpha = line.alpha * edgeFade * (line.highlight ? 0.9 : 0.55);
        ctx.fillStyle = line.highlight ? accent : base;
        ctx.fillText(line.text, 14, line.y);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full rounded-2xl"
      />
      {/* soft radial mask for editorial feel */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, transparent 40%, hsl(var(--secondary) / 0.85) 100%)",
        }}
      />
    </div>
  );
}