"use client";

import { useEffect, useState } from "react";
import Image from "@/components/Image";
import { resolveMediaUrl } from "@/lib/media-url";

const SLIDES = [
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792422090/photo_2026-10-19_17-56-23.jpg",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792422090/photo_2026-10-19_17-56-28.jpg",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792422099/photo_2026-10-19_17-57-19.jpg",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792422085/photo_2026-10-19_17-57-12.jpg",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792422086/photo_2026-10-19_17-57-16.jpg",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792422089/photo_2026-10-19_17-57-06.jpg",
  "https://res.cloudinary.com/ps4gvvqu/image/upload/v1792422084/photo_2026-10-19_17-57-02.jpg",
] as const;

const HOLD_MS = 7000;

export function HomeHeroMedia({ alt }: { alt: string }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    setAnimate(true);
    let timer: ReturnType<typeof setInterval> | null = null;

    const stop = () => {
      if (timer === null) return;
      clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (timer !== null) return;
      timer = setInterval(() => {
        setIndex((current) => (current + 1) % SLIDES.length);
      }, HOLD_MS);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const shown = animate ? SLIDES : SLIDES.slice(0, 1);

  return (
    <div className="hero__media">
      {shown.map((src, i) => (
        <div
          key={src}
          className={`hero__slide${i === index ? " is-active" : ""}${i % 2 ? " hero__slide--out" : ""}`}
          aria-hidden={i === 0 ? undefined : true}
        >
          <Image
            src={resolveMediaUrl(src)}
            alt={i === 0 ? alt : ""}
            fill
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : undefined}
            loading={i <= 1 ? "eager" : undefined}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="hero__veil" />
      <div className="hero__grain" />
    </div>
  );
}
