import { useState, useCallback, type ReactNode } from "react";

interface CursorTooltipProps {
  children: ReactNode;
  label?: string;
}

export const CursorTooltip = ({ children, label = "click to view" }: CursorTooltipProps) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX + 14, y: e.clientY + 14 });
  }, []);

  const onMouseEnter = useCallback(() => setVisible(true), []);
  const onMouseLeave = useCallback(() => setVisible(false), []);

  return (
    <>
      <div
        className="inline-block w-full"
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
      {visible && (
        <div
          className="fixed z-[9999] pointer-events-none select-none px-2.5 py-1 rounded-md bg-accent text-accent-foreground text-xs font-medium shadow-lg whitespace-nowrap"
          style={{
            left: pos.x,
            top: pos.y,
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};
