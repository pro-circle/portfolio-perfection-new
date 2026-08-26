import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  rounded?: string;
}

/**
 * Image with a "Loading..." overlay shown until the image finishes loading.
 * Fills the parent container; use object-cover to fully fill landscape placeholders.
 *
 * SSR-safe: if the browser finishes loading the image before React hydrates,
 * the `onLoad` listener never fires. We check `img.complete` in an effect.
 */
const LoadingImage = ({
  containerClassName,
  rounded = "rounded-xl",
  className,
  onLoad,
  onError,
  alt = "",
  ...imgProps
}: LoadingImageProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-secondary", rounded, containerClassName)}>
      <img
        {...imgProps}
        ref={imgRef}
        alt={alt}
        loading={imgProps.loading ?? "lazy"}
        decoding={imgProps.decoding ?? "async"}
        fetchPriority={imgProps.fetchPriority ?? "auto"}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
        className={cn(
          "w-full h-full object-cover block transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingImage;
