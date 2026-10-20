"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/Image";
import { resolveMediaUrl } from "@/lib/media-url";

const SLIDES = [
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792521895/Simien_Mountains.png",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792521903/Axum.png",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792521900/Gondar.png",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792521898/Blue_Nile_Falls.png",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792521896/Danakil_Depression.png",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792521897/Harar.png",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792521901/Bale_Mountains.png",
] as const;

const HOLD_MS = 7000;

export function HomeHeroMedia({ alt }: { alt: string }) {
  const [{ index, previous }, setFrame] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });
  const [animate, setAnimate] = useState(false);
  const loaded = useRef(new Set<number>());

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | null = null;

    const stop = () => {
      if (timer === null) return;
      clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (timer !== null || document.hidden || motion.matches) return;
      timer = setInterval(() => {
        setFrame((current) => {
          const next = (current.index + 1) % SLIDES.length;
          // Keep the current photograph visible until the next one is ready.
          if (!loaded.current.has(next)) return current;
          return { index: next, previous: current.index };
        });
      }, HOLD_MS);
    };

    const onMotion = () => {
      setAnimate(!motion.matches);
      if (motion.matches) {
        stop();
        setFrame({ index: 0, previous: null });
      } else start();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    onMotion();
    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const shown = animate ? SLIDES : SLIDES.slice(0, 1);

  return (
    <div className="hero__media">
      {shown.map((src, i) => (
        <div
          key={src}
          className={`hero__slide${i === index ? " is-active" : ""}${animate && (i === index || i === previous) ? " is-moving" : ""}${i % 2 ? " hero__slide--alternate" : ""}`}
          aria-hidden={i === 0 ? undefined : true}
        >
          <Image
            src={resolveMediaUrl(src)}
            onLoad={() => loaded.current.add(i)}
            alt={i === 0 ? alt : ""}
            fill
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : undefined}
            loading={i === index || i === (index + 1) % SLIDES.length ? "eager" : undefined}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="hero__veil" />
      <div className="hero__grain" />
    </div>
  );
}
