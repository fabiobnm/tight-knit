'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/Header/Header';
import type { AIImage } from '@/lib/queries/AI';

type Props = {
  images: AIImage[];
   text?: {
    html: string;
  } | null;

};

export default function ScrollImagePage({ images , text}: Props) {
  const imgRefs = useRef<HTMLImageElement[]>([]);
  const speedsRef = useRef<number[]>([]);
  const safeImages = images ?? [];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // assegna una velocità casuale a ciascuna immagine (0.5x - 2x)
    if (speedsRef.current.length === 0) {
      speedsRef.current = safeImages.map(() => 0.5 + Math.random() * 1.5);
    }

    const startX = -0; // tutte partono fuori a sinistra
    const endX = window.innerWidth + 1000; // terminano oltre destra
    const scrollRange = 2000; // quanto scroll serve per completare l’animazione
    const stagger = 250; // sfalsamento verticale / temporale

    const handleScroll = () => {
      const scrollY = window.scrollY;

      imgRefs.current.forEach((img, i) => {
        if (!img) return;

        const speed = speedsRef.current[i];

        // calcolo progress con sfalsamento e velocità
        const progress = Math.min(Math.max((scrollY - i * stagger) / scrollRange * speed, 0), 1);

        const x = startX + (endX - startX) * progress;
        img.style.transform = `translateX(${x}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [safeImages]);

  return (
    <div style={{ height: '800vh', position: 'relative' }}>
      <Header />

         <div
  style={{
    position: 'fixed',
    top: '50vh',
    left: '50vw',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    zIndex: 0,
    pointerEvents: 'none',
  }}
    dangerouslySetInnerHTML={{ __html: text?.html ?? "Nessun contenuto AI trovato." }}
/>

      {safeImages.map((img, i) => (
        <img
          key={i}
          ref={(el) => { if (el) imgRefs.current[i] = el; }}
          src={img.image.url}
          className={`card cardIndex ${img.top} ${img.size}`}
       
          style={{
            position: 'fixed',
            // distanza verticale tra le immagini
            left: '0px',
            
            transform: 'translateX(-500px)', // partenza fuori a sinistra
            transition: 'transform 0.1s linear',
            zIndex:  i - 100 ,
          }}
        />
      ))}
      <style jsx global>{`
      
      

        .top {
          top: 50px;
        }

        .middle {
          top: 25vh;
        }

        .bottom {
          bottom: 0;
        }

        .xl {
          height: 100vh;
          width: fit-content;
        }

        .l {
          height: 50vh;
          width: fit-content;
        }

        .m {
          height: 30vh;
          width: fit-content;
        }

        .s {
          height: 20vh;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}