import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import LoadingImage from "./LoadingImage";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
  watermark?: string;
}

/**
 * Image that opens in a full-screen lightbox on click, showing the whole
 * image with no cropping. A soft watermark hints at the interaction.
 */
const ZoomableImage = ({
  src,
  alt,
  className,
  rounded = "rounded-none",
  watermark = "Click to view",
}: ZoomableImageProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${alt} larger`}
        className={`group relative block w-full h-full cursor-zoom-in ${className ?? ""}`}
      >
        <LoadingImage src={src} alt={alt} rounded={rounded} />
        <span className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/55 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground/70 backdrop-blur-sm opacity-70 transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn size={12} />
            {watermark}
          </span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 md:p-10 animate-fade-in cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close image"
            className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-accent transition-colors"
          >
            <X size={18} />
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl animate-scale-in"
          />
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
