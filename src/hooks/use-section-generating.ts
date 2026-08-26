import { useEffect, useRef, useState } from "react";

export type GeneratingPhase = "idle" | "generating" | "ready";

// Change this value to make the section "Generating..." state faster/slower.
export const GENERATING_DURATION_MS = 500;
const RETURN_BLOCK_PREFIX = "section_return_block__";

interface Options {
  /** ms to stay in "generating" before flipping to "ready". */
  duration?: number;
  /** IntersectionObserver rootMargin. */
  rootMargin?: string;
  /** Optional section id — used to block this section once when returning from its detail page. */
  sectionId?: string;
}

export function blockSectionGenerationOnce(sectionId: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RETURN_BLOCK_PREFIX + sectionId, "1");
  } catch {
    /* noop */
  }
}

function consumeSectionGenerationBlock(sectionId?: string) {
  if (!sectionId || typeof window === "undefined") return false;
  try {
    const key = RETURN_BLOCK_PREFIX + sectionId;
    const shouldBlock = sessionStorage.getItem(key) === "1";
    if (shouldBlock) sessionStorage.removeItem(key);
    return shouldBlock;
  } catch {
    return false;
  }
}

export function useSectionGenerating<T extends HTMLElement>(opts: Options = {}) {
  const { duration = GENERATING_DURATION_MS, rootMargin = "0px 0px -5% 0px", sectionId } = opts;
  const [blockedOnReturn] = useState(() => consumeSectionGenerationBlock(sectionId));
  const ref = useRef<T | null>(null);
  const [phase, setPhase] = useState<GeneratingPhase>(() => (blockedOnReturn ? "ready" : "idle"));
  const hasTriggeredRef = useRef<boolean>(blockedOnReturn);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (hasTriggeredRef.current) return;

    let armTimer = 0;
    let io: IntersectionObserver | null = null;

    const trigger = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setPhase("generating");
    };

    // Arm 1s AFTER this section first becomes visible in the viewport.
    const armFromVisible = () => {
      if (armTimer || hasTriggeredRef.current) return;
      armTimer = window.setTimeout(() => {
        trigger();
      }, 250);
    };


    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            armFromVisible();
            break;
          }
        }
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);

    return () => {
      if (armTimer) window.clearTimeout(armTimer);
      if (io) io.disconnect();
    };
  }, [rootMargin]);

  useEffect(() => {
    if (phase !== "generating") return;
    const t = window.setTimeout(() => {
      setPhase("ready");
    }, duration);
    return () => window.clearTimeout(t);
  }, [phase, duration]);

  return { ref, phase, skipAnimation: blockedOnReturn };
}

