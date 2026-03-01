// src/app/AI/Gsap404Page.tsx

'use client';

import { useEffect, useRef } from 'react';
import { gsap, random } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header/Header';
import type { AIImage } from '@/lib/queries/AI';

type Props = {
  images: AIImage[];
};

export default function Gsap404Page({ images }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const safeImages = images ?? [];

  function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // crea i "cards" in base al numero di immagini
      const cards = safeImages.map((_, index) => {
        const i = index + 1;
        // pattern a caso per endTranslateX/rotate, puoi customizzarlo
        const endTranslateX =  gsap.utils.random(0, 5000);
        const rotate = 0;

        return {
          id: `#card-${i}`,
          endTranslateX,
          rotate,
        };
      });

      // wrapper che si sposta in orizzontale mentre scorri
      gsap.to('.wrapper-404', {
        x: '350vw',
        ease: 'none',
        scrollTrigger: {
          trigger: '.wrapper-404',
          start: 'top top',
          end: '+=3000', // px
          scrub: true,
          pin: true,
        },
      });

      


    


      // animazioni singole card
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card.id,
          start: 'top top',
          end: '+=1200',
          scrub: 1,
          onUpdate: (self) => {
            gsap.to(card.id, {
              x: `${card.endTranslateX * self.progress}px`,
              rotate: `${card.rotate * self.progress * 2}`,
              duration: 0.5,
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
    <div>
      <Header />
      <div ref={rootRef} className="container">
        <nav className="navvino" />

        <section className="wrapper-404">
          <h1 className='AText'>AI Projects</h1>

          {safeImages.map((img, index) => (
            <div
              key={index}
              className={"card " + img.top +" "+img.size }//prima era {"card " + img.top +" "+ img.left+" "+img.size }
              id={`card-${index + 1}`}
              style={{
                // se vuoi usare top/left/size dalla query:
                 left: -(index*400)+'px',
                 




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
        }

        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }



        .navvino a {
          text-decoration: none;
          color: white;
          font-size: 20px;
        }
        h1 {
          width: 100%;
          color: black;
          font-size: 48vw;
          text-align: center;
          margin: 0;
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

        .card:hover{
        z-index:99;
        

        }

        .top{
        top:0px
        }
        .middle{
        top:25vH
        }
        .bottom{
        bottom:0px
        }

        .small{
        margin-right: -20vW;
        
        }
        .medium{
        margin-right: -50vW;
        
        }
        .large{
        margin-right: -100vW;
        
        }
        .xl{
        height:100vH;
            width: fit-content;
        }
        .l{
        height:50vH;
            width: fit-content;
        }
        .m{
        height:30vH;
            width: fit-content;

        }
        .s{
        height:20vH;
            width: fit-content;

        }
      `}</style>
    </div>
  );
}
