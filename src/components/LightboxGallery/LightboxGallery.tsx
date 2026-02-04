'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // Aggiorna larghezza viewport
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload immagini
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Scroll iniziale
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) {
      el.scrollTo({ left: initialIndex * viewportWidth, behavior: 'auto' });
    }
  }, [initialIndex, viewportWidth]);

  // Aggiorna indice corrente al scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const newIndex = Math.round(el.scrollLeft / viewportWidth);
      setIndex(newIndex);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [viewportWidth]);

  // Pulsanti avanti/indietro
  const goNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: viewportWidth, behavior: 'smooth' });
  };
  const goPrev = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: -viewportWidth, behavior: 'smooth' });
  };

  if (!images.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: 1000,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          color: 'white',
          fontSize: 14,
          zIndex: 1001,
        }}
      >
        {title} <br />
        {client}
      </div>

      {/* CLOSE */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          background: 'transparent',
          color: 'white',
          border: 'none',
          fontSize: 20,
          cursor: 'pointer',
          zIndex: 1001,
        }}
      >
        ✕
      </button>

      {/* Pulsanti avanti/indietro */}
      <button
        onClick={goPrev}
        style={{
          position: 'fixed',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)',
          color: 'white',
          border: 'none',
          fontSize: 28,
          cursor: 'pointer',
          padding: '8px 12px',
          zIndex: 1001,
        }}
      >
        ‹
      </button>
      <button
        onClick={goNext}
        style={{
          position: 'fixed',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)',
          color: 'white',
          border: 'none',
          fontSize: 28,
          cursor: 'pointer',
          padding: '8px 12px',
          zIndex: 1001,
        }}
      >
        ›
      </button>

      {/* CAROUSEL */}
      <div
        ref={scrollerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          width: '100%',
          height: '100%',
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
          overscrollBehaviorY: 'contain',
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              flex: `0 0 ${viewportWidth}px`,
              scrollSnapAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={src}
              alt=""
              draggable={false}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              loading="eager"
              onClick={onClose}
            />
          </div>
        ))}
      </div>

      {/* INDICATORE */}
      <div
        style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
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
