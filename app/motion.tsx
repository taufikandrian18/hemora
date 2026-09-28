"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/*
 * Page-wide motion layer. Server-rendered markup stays fully visible without JS;
 * once this runs it adds `motion-ready` to <html>, which lets CSS hide the
 * `[data-reveal]` elements that are still below the fold until they scroll in.
 */
export function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const loadTimer = window.setTimeout(() => root.setAttribute("data-loaded", ""), 2000);

    document.querySelectorAll<HTMLDetailsElement>("details.site-menu[open]").forEach((menu) => {
      menu.open = false;
    });

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    for (const element of reveals) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) element.classList.add("is-visible");
    }
    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    reveals.filter((element) => !element.classList.contains("is-visible")).forEach((element) => observer.observe(element));

    const scrollWords = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-words]"));
    let frame = 0;

    function update() {
      frame = 0;
      root.toggleAttribute("data-scrolled", window.scrollY > 24);

      const viewport = window.innerHeight;
      for (const element of scrollWords) {
        const rect = element.getBoundingClientRect();
        const progress = (viewport * 0.9 - rect.top) / (rect.height + viewport * 0.45);
        element.style.setProperty("--p", Math.min(1, Math.max(0, progress)).toFixed(3));
      }
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.clearTimeout(loadTimer);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return null;
}

export function SliderControls({ targetId, count }: { targetId: string; count: number }) {
  const [index, setIndex] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const track = document.getElementById(targetId);
    if (!track) return;

    function sync() {
      frame.current = 0;
      if (!track) return;
      const card = track.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      setIndex(atEnd ? count - 1 : Math.round(track.scrollLeft / Math.max(step, 1)));
    }

    function onScroll() {
      if (!frame.current) frame.current = window.requestAnimationFrame(sync);
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame.current);
    };
  }, [targetId, count]);

  function move(direction: 1 | -1) {
    const track = document.getElementById(targetId);
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }

  return (
    <div className="slider-controls">
      <span className="slider-count">
        {String(index + 1).padStart(2, "0")}
        <i />
        {String(count).padStart(2, "0")}
      </span>
      <button type="button" aria-label="Previous" aria-controls={targetId} onClick={() => move(-1)} disabled={index === 0}>
        <span className="hemora-icon hemora-icon-arrow-left" aria-hidden="true" />
      </button>
      <button type="button" aria-label="Next" aria-controls={targetId} onClick={() => move(1)} disabled={index >= count - 1}>
        <span className="hemora-icon hemora-icon-arrow-right" aria-hidden="true" />
      </button>
    </div>
  );
}
