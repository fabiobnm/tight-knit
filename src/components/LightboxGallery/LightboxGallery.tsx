// src/components/LightboxGallery/LightboxGallery.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  const [videoReady, setVideoReady] = useState<Record<number, boolean>>({});

  // =========================
  // WHEEL LOCK
  // =========================
  const wheelAccum = useRef(0);
  const wheelActive = useRef(false);

  // =========================
  // SWIPE LOCK
  // =========================
  const pointerStartX = useRef<number | null>(null);
  const swipeActive = useRef(false);

  // =========================
  // SCROLL ONLY
  // =========================
  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollTo({
      left: i * el.clientWidth,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // =========================
  // CHANGE SLIDE
  // =========================
  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(images.length - 1, i));
      setIndex(clamped);
      scrollToIndex(clamped);
    },
    [images.length, scrollToIndex]
  );

  // =========================
  // INITIAL POSITION
  // =========================
  useEffect(() => {
    scrollToIndex(initialIndex, false);
  }, [initialIndex, scrollToIndex]);

  // =========================
  // KEYBOARD
  // =========================
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo, onClose]);

  // =========================
  // WHEEL HANDLER
  // =========================
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta =
      Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    if (Math.abs(delta) < 4) return;
    if (wheelActive.current) return;

    wheelAccum.current += delta;

    const THRESHOLD = 120;

    if (Math.abs(wheelAccum.current) >= THRESHOLD) {
      const dir: 1 | -1 = wheelAccum.current > 0 ? 1 : -1;
      wheelActive.current = true;
      wheelAccum.current = 0;
      goTo(index + dir);
    }
  };

  // reset wheel
  useEffect(() => {
    let t: number | null = null;

    const resetWheel = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        wheelActive.current = false;
        wheelAccum.current = 0;
      }, 120);
    };

    window.addEventListener("wheel", resetWheel, { passive: true });
    return () => {
      if (t) window.clearTimeout(t);
      window.removeEventListener("wheel", resetWheel);
    };
  }, []);

  // =========================
  // SWIPE HANDLERS
  // =========================
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    swipeActive.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    if (swipeActive.current) return;

    const deltaX = e.clientX - pointerStartX.current;
    const THRESHOLD = 60;

    if (Math.abs(deltaX) >= THRESHOLD) {
      swipeActive.current = true;
      pointerStartX.current = null;

      const dir: 1 | -1 = deltaX < 0 ? 1 : -1;
      goTo(index + dir);
    }
  };

  const endPointer = () => {
    pointerStartX.current = null;
    swipeActive.current = false;
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onClick={(e) => e.stopPropagation()}
        style={{
          height: "100%",
          display: "flex",
          overflow: "hidden",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
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
                preload="metadata"
                controls={!!videoReady[i]}
                onLoadedMetadata={() =>
                  setVideoReady((p) => ({ ...p, [i]: true }))
                }
                onError={() =>
                  setVideoError((p) => ({ ...p, [i]: true }))
                }
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  opacity: videoReady[i] ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
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
