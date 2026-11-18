"use client";

import { useEffect, useRef, useState } from "react";

function parse(value: string) {
  const match = value.match(/^(\D*)([\d\s.,]+)(.*)$/);
  if (!match) return null;
  const target = Number(match[2].replace(/[\s.,]/g, ""));
  if (!Number.isFinite(target)) return null;
  return { prefix: match[1], target, suffix: match[3] };
}

export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const parsed = parse(value);
  const target = parsed?.target ?? null;
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || target == null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(target * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setCurrent(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  if (!parsed) return <span>{value}</span>;
  const shown = current == null ? parsed.target : current;
  return (
    <span ref={ref} className="tabular-nums">
      {parsed.prefix}
      {new Intl.NumberFormat("fr-FR").format(shown)}
      {parsed.suffix}
    </span>
  );
}
