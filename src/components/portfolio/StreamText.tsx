import { cn } from "@/lib/utils";
import { createElement, type CSSProperties, type ElementType } from "react";

// Change this value to adjust the word-by-word streaming speed everywhere.
export const STREAM_WORD_DELAY_MS = 45;

interface StreamTextProps {
  text: string;
  start: boolean;
  as?: ElementType;
  className?: string;
  /** ms per word — lower = faster typing (default 45) */
  wordMs?: number;
  /** clamp total delay so long paragraphs don't drag (default 2000ms) */
  maxDelayMs?: number;
  /** initial delay before first word appears (default 0) */
  startDelayMs?: number;
  /** render immediately without word-by-word animation */
  instant?: boolean;
}

/**
 * Renders `text` as word-by-word LLM-style stream when `start` is true.
 * Each word fades + un-blurs in sequence via CSS animation.
 *
 * Speed knobs:
 *  - `wordMs`  (per-word delay) → smaller = faster. Try 25 (fast) … 80 (slow).
 *  - `maxDelayMs` caps total stagger for long paragraphs.
 *  - The per-word fade duration itself lives in `src/styles.css` → `.stream-word`
 *    (currently 220ms). Increase for a slower, smoother fade.
 */
const StreamText = ({
  text,
  start,
  as = "span",
  className,
  wordMs = STREAM_WORD_DELAY_MS,
  maxDelayMs = 2000,
  startDelayMs = 0,
  instant = false,
}: StreamTextProps) => {
  if (instant) {
    return createElement(as, { className: cn(className) }, text);
  }

  const tokens = text.split(/(\s+)/);
  let wordIdx = 0;

  const children = tokens.map((tok, i) => {
    if (/^\s+$/.test(tok) || tok === "") {
      return <span key={i}>{tok}</span>;
    }
    const delay = Math.min(startDelayMs + wordIdx * wordMs, startDelayMs + maxDelayMs);
    wordIdx += 1;
    const style: CSSProperties = start
      ? { animationDelay: `${delay}ms` }
      : { opacity: 0 };
    return (
      <span
        key={i}
        className={start ? "stream-word" : undefined}
        style={style}
      >
        {tok}
      </span>
    );
  });

  return createElement(as, { className: cn(className), "data-streaming": start || undefined }, children);
};

export default StreamText;
