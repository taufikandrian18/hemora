"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "./loading-screen";

export function PageTransition() {
  const pathname = usePathname();
  const firstPath = useRef(true);
  const hideTimer = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }

    window.clearTimeout(hideTimer.current);
    setActive(true);
    hideTimer.current = window.setTimeout(() => setActive(false), 720);
    return () => window.clearTimeout(hideTimer.current);
  }, [pathname]);

  useEffect(() => {
    function show() {
      setActive(true);
    }

    function showForLink(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download")) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      setActive(true);
    }

    window.addEventListener("beforeunload", show);
    document.addEventListener("click", showForLink, true);
    return () => {
      window.removeEventListener("beforeunload", show);
      document.removeEventListener("click", showForLink, true);
    };
  }, []);

  return active ? <LoadingScreen className="page-route-transition" label="Loading HEMORA" /> : null;
}
