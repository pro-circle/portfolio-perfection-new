import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Short opacity-only fade between routes. No transforms, so it never creates a
 * containing block that would break `position: sticky` inside pages.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
}
