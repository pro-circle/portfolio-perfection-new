import { useEffect } from "react";
import { projects } from "@/data/projects";
import { experienceData } from "@/data/experience";

const EXTRA = [
  "/images/achievement/genai_ach.webp",
  "/images/achievement/karpagam_paper.webp",
  "/images/achievement/Hack2skill-AIML.webp",
  "/images/resume/page-1.webp",
  "/images/resume/page-2.webp",
  "/images/resume/page-3.webp",
  "/images/blog/hack-blog.webp",
  "/images/blog/blog-uptor.webp",
  "/images/blog/gateway-blog.webp",
  "/images/blog/ksr-blog.webp",
];

/**
 * Warms the browser cache for internal-page imagery once the site is idle,
 * so /projects/$slug and /experience/$slug open instantly on static hosting.
 */
export const PreloadAssets = () => {
  useEffect(() => {
    const urls = new Set<string>(EXTRA);
    for (const p of projects) {
      if (p.thumbnail) urls.add(p.thumbnail);
      for (const s of p.screenshots ?? []) urls.add(s.src);
    }
    for (const e of experienceData) {
      for (const img of e.images ?? []) urls.add(img);
    }

    const list = [...urls];
    let i = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      // Fetch a few at a time so we never fight with visible content.
      for (let n = 0; n < 3 && i < list.length; n++, i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = list[i]!;
      }
      if (i < list.length) window.setTimeout(step, 250);
    };

    const start = window.setTimeout(step, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, []);

  return null;
};

export default PreloadAssets;
