// src/components/LightboxGallery/LightboxGallery.tsx
"use client";

import { useEffect, useState, useRef } from "react";

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
  const [current, setCurrent] = useState(initialIndex);
  const [videoError, setVideoError] = useState(false);
  const wheelLock = useRef(false);

  const hasImages = images && images.length > 0;
  const safeIndex = hasImages
    ? ((current % images.length) + images.length) % images.length
    : 0;

  const src = images[safeIndex];

  const handleNext = () => {
    if (!hasImages) return;
    setCurrent((p) => (p + 1) % images.length);
    setVideoError(false);
  };

  const handlePrev = () => {
    if (!hasImages) return;
    setCurrent((p) => (p - 1 + images.length) % images.length);
    setVideoError(false);
  };

  // 🔥 SCROLL ORIZZONTALE
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (wheelLock.current || images.length <= 1) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      ? e.deltaX
      : e.deltaY;

    if (Math.abs(delta) < 30) return;

    wheelLock.current = true;

    if (delta > 0) {
      handleNext();
    } else {
      handlePrev();
    }

    setTimeout(() => {
      wheelLock.current = false;
    }, 400); // debounce
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!hasImages) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          zIndex: 1001,
          fontSize: 14,
        }}
      >
        {title}
        <br />
        {client}
      </div>

      {/* CONTENT */}
      <div
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!videoError ? (
          <video
            key={safeIndex}
            src={src}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
            }}
            onError={() => setVideoError(true)}
          />
        ) : (
          <img
            src={src}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        )}

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
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          X
        </button>

        {/* PREV */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: 0,
              width: "50%",
              height: "80vh",
              background: "transparent",
              border: "none",
              cursor: "w-resize",
            }}
          />
        )}

        {/* NEXT */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: 0,
              width: "50%",
              height: "80vh",
              background: "transparent",
              border: "none",
              cursor: "e-resize",
            }}
          />
        )}

        {/* INDICATOR */}
        <div
          style={{
            position: "fixed",
            bottom: 50,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: 11,
            opacity: 0.8,
          }}
        >
          {safeIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
