// src/components/LightboxGallery/LightboxGallery.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type LightboxGalleryProps = {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  title: string;
  client: string;
};

export default function LightboxGallery({
  images,
  initialIndex = 0,
  onClose,
  title,
  client,
}: LightboxGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const [videoError, setVideoError] = useState<Record<number, boolean>>({});

  const wheelLocked = useRef(false);
  const lastWheelDir = useRef<1 | -1 | null>(null);

  // scroll to index
  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    const clamped = Math.max(0, Math.min(images.length - 1, i));
    setIndex(clamped);

    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: "smooth",
    });

    wheelLocked.current = true;
    setTimeout(() => {
      wheelLocked.current = false;
      lastWheelDir.current = null;
    }, 350);
  };

  // initial position
  useEffect(() => {
    goTo(initialIndex);
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  // wheel → UNA slide
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (wheelLocked.current) return;

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX)
      ? e.deltaY
      : e.deltaX;

    if (Math.abs(delta) < 10) return;

    const dir: 1 | -1 = delta > 0 ? 1 : -1;

    // evita doppio trigger nello stesso gesto
    if (lastWheelDir.current === dir) return;
    lastWheelDir.current = dir;

    goTo(index + dir);
  };

  if (!images.length) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 1000,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          color: "white",
          fontSize: 14,
          zIndex: 1001,
        }}
      >
        {title}
        <br />
        {client}
      </div>

      {/* CLOSE */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "transparent",
          color: "white",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
          zIndex: 1001,
        }}
      >
        ✕
      </button>

      {/* CAROUSEL */}
      <div
        ref={scrollerRef}
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
        style={{
          height: "100%",
          display: "flex",
          overflow: "hidden",
          overscrollBehavior: "contain",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 100vw",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!videoError[i] ? (
              <video
                src={src}
                autoPlay
                muted
                playsInline
                controls
                preload="metadata"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                }}
                onError={() =>
                  setVideoError((p) => ({ ...p, [i]: true }))
                }
              />
            ) : (
              <img
                src={src}
                alt=""
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* INDICATOR */}
      <div
        style={{
          position: "fixed",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontSize: 11,
          opacity: 0.8,
          zIndex: 1001,
        }}
      >
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
