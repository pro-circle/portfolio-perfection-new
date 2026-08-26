import { cn } from "@/lib/utils";
import type { GeneratingPhase } from "@/hooks/use-section-generating";


interface SectionLabelProps {
  label: string;
  phase: GeneratingPhase;
  onClick?: () => void;
  className?: string;
  anchorId?: string;
  instant?: boolean;
  /** Hide the trailing AI sparkle icon (default: shown when section is ready). */
  hideSpark?: boolean;
}

const SectionLabel = ({ label, phase, onClick, className, anchorId, instant = false, hideSpark = false }: SectionLabelProps) => {
  const generating = phase === "generating";

  const labelNode = generating ? (
    <span className="inline-flex items-center gap-1.5">
      <span>Generating</span>
      <span className="inline-flex">
        <span className="generating-dot" />
        <span className="generating-dot" />
        <span className="generating-dot" />
      </span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn(instant ? undefined : "label-reveal")} data-ai-anchor={anchorId}>
        <span className="section-shimmer" data-label={label}>{label}</span>
      </span>
      
    </span>
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-8 h-[2px] bg-accent" />
      <p className="text-lg font-semibold text-accent tracking-widest uppercase">
        {onClick ? (
          <button
            onClick={onClick}
            className="select-none cursor-default text-accent uppercase tracking-widest"
          >
            {labelNode}
          </button>
        ) : (
          labelNode
        )}
      </p>
    </div>
  );
};

export default SectionLabel;
