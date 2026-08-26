import { useEffect } from "react";

export const useScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;

    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      body.style.width = originalBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
};
