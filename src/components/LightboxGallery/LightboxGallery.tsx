'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  const isTransitioning = useRef(false);

  // wheel
  const wheelAccum = useRef(0);
  const WHEEL_THRESHOLD = 120;

  // swipe
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const SWIPE_THRESHOLD = 50;

  // drag vs click
  const isDragging = useRef(false);

  /* -------------------------
   * GO TO SLIDE
   * ------------------------ */
  const goTo = useCallback(
    (i: number) => {
      const el = scrollerRef.current;
      if (!el) return;

      const clamped = Math.max(0, Math.min(images.length - 1, i));
      if (clamped === index) return;

      isTransitioning.current = true;
      setIndex(clamped);

      el.scrollTo({
        left: clamped * el.clientWidth,
        behavior: 'smooth',
      });
    },
    [images.length, index]
  );

  /* -------------------------
   * INITIAL SCROLL
   * ------------------------ */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({
      left: initialIndex * el.clientWidth,
      behavior: 'auto',
    });
  }, [initialIndex]);

  /* -------------------------
   * UNLOCK after scroll
   * ------------------------ */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let timeout: number | null = null;

    const onScroll = () => {
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        isTransitioning.current = false;
        wheelAccum.current = 0;
      }, 80);
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  /* -------------------------
   * WHEEL
   * ------------------------ */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (isTransitioning.current) return;

      e.preventDefault();
      wheelAccum.current += e.deltaX || e.deltaY;

      if (wheelAccum.current > WHEEL_THRESHOLD) {
        wheelAccum.current = 0;
        goTo(index + 1);
      } else if (wheelAccum.current < -WHEEL_THRESHOLD) {
        wheelAccum.current = 0;
        goTo(index - 1);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [goTo, index]);

  /* -------------------------
   * TOUCH / SWIPE
   * ------------------------ */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchDeltaX.current = 0;
      isDragging.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
      if (Math.abs(touchDeltaX.current) > 6) isDragging.current = true;
    };

    const onTouchEnd = () => {
      if (isTransitioning.current) return;

      if (touchDeltaX.current > SWIPE_THRESHOLD) goTo(index - 1);
      else if (touchDeltaX.current < -SWIPE_THRESHOLD) goTo(index + 1);

      touchDeltaX.current = 0;
      isDragging.current = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [goTo, index]);

  /* -------------------------
   * KEYBOARD
   * ------------------------ */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTransitioning.current) return;
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index, onClose]);

  /* -------------------------
   * IMAGE CLICK
   * ------------------------ */
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    onClose();
  };

  /* -------------------------
   * RENDER
   * ------------------------ */
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

      {/* CAROUSEL */}
      <div
        ref={scrollerRef}
        style={{
          display: 'flex',
          overflowX: 'hidden',
          scrollSnapType: 'x mandatory',
          width: '100%',
          height: '100%',
          touchAction: 'pan-y',
           overscrollBehaviorX: 'contain', // ← blocca back/forward
    overscrollBehaviorY: 'contain', // blocca scroll rubato
        }}
        onClick={handleClick}
      >
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              flex: '0 0 100%',
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
                maxWidth: '90vw',
                maxHeight: '80vh',
                userSelect: 'none',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            />
          </div>
        ))}
      </div>

      {/* INDICATOR */}
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
