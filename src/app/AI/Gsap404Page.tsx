// src/app/AI/Gsap404Page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
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
  
  // Stato per far scomparire il testo
  const [scompare, setScompare] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Observer);

    const ctx = gsap.context(() => {

      /* ================= WRAPPER SCROLL ================= */
      gsap.to('.wrapper-404', {
        x: '300vw',
        ease: 'none',
        scrollTrigger: {
          trigger: '.wrapper-404',
          start: 'top top',
          end: '+=3000',
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            const percent = self.progress * 100;
            console.log('Scroll percent:', percent.toFixed(1));

      // gestisci l'opacità direttamente con GSAP
      if (percent >= 15 ) {
        gsap.set('.textAI', { opacity: 0 });
      } else {
        gsap.set('.textAI', { opacity: 1 });
      }
    },
        },
      });

      /* ================= CARDS ================= */
      safeImages.forEach((img, index) => {
        const id = `#card-${index + 1}`;

        const speedMap: Record<string, number> = {
          slow: Math.floor(Math.random() * (1000 - 500 + 1)) + 500,
          mid: Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000,
          fast: Math.floor(Math.random() * (2500 - 2000 + 1)) + 2000,
        };

        const endTranslateX = speedMap[img.speed ?? 'mid'] ?? '';

        console.log('questo è numero'+endTranslateX)
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

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, [safeImages]);

  return (
    <div className='opacityAnimLong'>
      <Header />

      {/* Testo AI che scompare */}
      <div
        className='textAI'
        style={{
          position: 'fixed',
          top: '50vh',
          left: '50vw',
          width:'65vW',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: scompare ? 0 : 1, // cambia opacità in base allo stato
          transition: 'opacity 0.3s ease',
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
                left: `calc(${-(index+1) * 25}vW - 100px)`,
              }}
            >
              <img src={img.image.url} alt="" />
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

        html, body {
          width: 100%;
          height: 100%;
          background: white;
          overflow-x: hidden;
          overscroll-behavior-x: contain;
          overscroll-behavior-y: contain;
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

        .card {
          position: absolute;
          overflow: hidden;
        }

        .card img {
          height: 100%;
          width:auto;
          object-fit: cover;
        }
    

        .card:hover {
          z-index: 99;
        }

        .top { top: 50px; }
        .middleTop { top: 25vh; }
        .middleBottom { bottom: 25vh; } 
        .bottom { bottom: 0; }

        .xl { height: 100vh; width: fit-content; }
        .l { height: 30vh; width: fit-content; }
        .m { height: 20vh; width: fit-content; }
        .s { height: 15vh; width: fit-content; }


@media (max-width: 600px) {


}
     
      `}</style>
    </div>
  );
}