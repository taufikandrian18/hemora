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

function isoDate(offsetDays: number, from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + offsetDays);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Local clock for a property; renders a placeholder on the server to avoid hydration drift. */
export function LocalTime({ timeZone, label, className }: { timeZone: string; label: string; className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
    const tick = () => setTime(format.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 15000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [timeZone]);

  return (
    <span className={["local-time", className].filter(Boolean).join(" ")}>
      <i aria-hidden="true" />
      {time ?? "--:--"} {label}
    </span>
  );
}

/**
 * Reservation form. A plain GET form, so the browser itself builds
 * `<action>?check-in=YYYY-MM-DD&check-out=YYYY-MM-DD&adults=N&children=N[&property=id]`,
 * which is the query Mora Club's /product search reads.
 */
export function BookingForm({ action, propertyId }: { action: string; propertyId: string | null }) {
  const checkIn = useRef<HTMLInputElement>(null);
  const checkOut = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = isoDate(0);
    if (checkIn.current) {
      checkIn.current.min = today;
      if (!checkIn.current.value) checkIn.current.value = isoDate(1);
    }
    if (checkOut.current) {
      checkOut.current.min = isoDate(2);
      if (!checkOut.current.value) checkOut.current.value = isoDate(3);
    }
  }, []);

  function syncDeparture() {
    const arrival = checkIn.current?.value;
    const departure = checkOut.current;
    if (!arrival || !departure) return;
    const earliest = isoDate(1, new Date(`${arrival}T00:00:00`));
    departure.min = earliest;
    if (!departure.value || departure.value < earliest) departure.value = earliest;
    departure.setCustomValidity("");
  }

  function validate(event: React.FormEvent<HTMLFormElement>) {
    const arrival = checkIn.current?.value;
    const departure = checkOut.current;
    if (arrival && departure && departure.value <= arrival) {
      event.preventDefault();
      departure.setCustomValidity("Departure must be after arrival.");
      departure.reportValidity();
    }
  }

  return (
    <form className="booking-form" action={action} method="get" onSubmit={validate}>
      <label>
        <span>Arrival</span>
        <input ref={checkIn} name="check-in" type="date" required onChange={syncDeparture} />
      </label>
      <label>
        <span>Departure</span>
        <input ref={checkOut} name="check-out" type="date" required onChange={(event) => event.currentTarget.setCustomValidity("")} />
      </label>
      <label>
        <span>Adults</span>
        <select name="adults" defaultValue="2">
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "adult" : "adults"}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Children</span>
        <select name="children" defaultValue="0">
          {[0, 1, 2, 3, 4].map((count) => (
            <option key={count} value={count}>
              {count === 0 ? "No children" : `${count} ${count === 1 ? "child" : "children"}`}
            </option>
          ))}
        </select>
      </label>
      {propertyId ? <input type="hidden" name="property" value={propertyId} /> : null}
      <button className="primary-action booking-action" type="submit">
        Check Availability
        <span className="hemora-icon hemora-icon-arrow-right" aria-hidden="true" />
      </button>
    </form>
  );
}
