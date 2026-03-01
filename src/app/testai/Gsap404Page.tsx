// src/app/AI/Gsap404Page.tsx

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/all';
import Header from '@/components/Header/Header';
import type { AIImage } from '@/lib/queries/AI';
import { log } from 'console';

type Props = {
  images: AIImage[];
  text?: {
    html: string;
  } | null;

};

export default function Gsap404Page({ images, text }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const safeImages = images ?? [];

    // 🔥 log per debug
  console.log("text prop:", text);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Observer);

    const ctx = gsap.context(() => {
      /* ================= WRAPPER SCROLL ================= */

      gsap.to('.wrapper-404', {
        x: '750vw',
        ease: 'none',
        scrollTrigger: {
          trigger: '.wrapper-404',
          start: 'top top',
          end: '+=3000',
          scrub: true,
          pin: true,
        },
      });

      /* ================= CARDS ================= */

      safeImages.forEach((img, index) => {
        const id = `#card-${index + 1}`;

  const speedMap: Record<string, number> = {
    slow: Math.floor(Math.random() * (1000 - 500 + 1)) + 500,
  mid: Math.floor(Math.random() * (1900 - 1500 + 1)) + 1500,
  fast: Math.floor(Math.random() * (2000 - 1800 + 1)) + 1800,
  };

  const endTranslateX = speedMap[img.speed ?? 'mid'] ?? '';

  console.log('rererere'+ endTranslateX)

        ScrollTrigger.create({
          trigger: id,
          start: 'top top',
          end: '+=3200',
          scrub: 1,

          onUpdate: (self) => {
            gsap.to(id, {
              x: endTranslateX * self.progress,
              duration: 0.4,
              ease: 'power3.out',
            });
          },
        });
      });

      /* ================= TRACKPAD ORIZZONTALE =================

      Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        tolerance: 8,
        preventDefault: false,
        onChange: (self) => {
          const dx = self.deltaX;
          const dy = self.deltaY;

          // intercetta solo intento orizzontale
          if (Math.abs(dx) > Math.abs(dy)) {
            window.scrollBy({
              top: dx * 1.2, // 🔥 regola QUI la velocità
              behavior: 'auto',
            });
          }
        },
      });

       */

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, [safeImages]);

  return (
    <div>
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

      <div ref={rootRef} className="container" >
        <nav className="navvino" />

        <section className="wrapper-404">
        
          {safeImages.map((img, index) => (
            <div
              key={index}
              id={`card-${index + 1}`}
              className={`card ${img.top} ${img.size}`}
              style={{
                left: `calc(${-(index+1) * 50}vW - 100px)`,
                
              }}
            >
              <img src={img.image.url} alt="" />
              <a href="">{img.top}</a>
            </div>

          ))}
        </section>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          background: white;
          overflow-x: hidden;
            overscroll-behavior-x: contain; /* evita back/forward */
  overscroll-behavior-y: contain; /* evita scroll “rubato” */
        }

        .container {
          width: 100%;
          height: 1200vh;
        }

        .navvino {
          position: fixed;
          top: 0;
          padding: 1em;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 10;
        }

        .wrapper-404 {
          position: absolute;
          top: 0;
          width: 400vw;
          height: 100vh;
          will-change: transform;
        }

        h1 {
          width: 100%;
          color: black;
          font-size: 48vw;
          text-align: center;
        }

        .card {
          position: absolute;
          overflow: hidden;
        }

        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card:hover {
          z-index: 99;
        }

        .top, .middle {
          top: 50px;
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
