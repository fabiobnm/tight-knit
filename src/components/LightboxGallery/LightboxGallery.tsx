// src/components/LightboxGallery.tsx
"use client";

import { useEffect, useState } from "react";

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

  const hasImages = images && images.length > 0;
  const safeIndex = hasImages ? ((current % images.length) + images.length) % images.length : 0;

  const handleNext = () => {
    if (!hasImages) return;
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (!hasImages) return;
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // ESC per chiudere
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

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

              {/* HEADER INFO (title + client) in alto a sinistra */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          color: "white",
          zIndex: 1001,
          maxWidth: "40vw",
        }}
      >
        <div
          style={{
            fontSize: 14,
          }}
        >
          {title} <br />
          {client}
        </div>
       
      </div>


      {/* blocco contenuto, clic qui non chiude */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* immagine */}
        <img
          src={images[safeIndex]}
          alt={`Image ${safeIndex + 1}`}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />

        {/* close */}
        <button
          onClick={onClose}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            background: "transparent",
            color: "white",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          X
        </button>

        {/* prev */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: 8,
              width:'50%',
              height:'80vH',
              background: "transparent",
              color: "white",
              border: "none",
              padding: "8px 10px",
              cursor: "w-resize",
              fontSize: 12,
            }}
          >
            
          </button>
        )}

        {/* next */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: 8,
              width:'50%',
              height:'80vh',
              
              background: "transparent",
              color: "white",
              border: "none",
              padding: "8px 10px",
              cursor: "e-resize",
              fontSize: 12,
            }}
          >
            
          </button>
        )}

        {/* indicator */}
        {images.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: '50px',
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              fontSize: 11,
              opacity: 0.8,
            }}
          >
            {safeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
