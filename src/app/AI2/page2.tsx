'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from "@/components/Header/Header";

export default function Gsap404Page() {
  const rootRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {



      const cards = [
        { id: '#card-1',  endTranslateX: -2000, rotate:  5 },
        { id: '#card-2',  endTranslateX: -1000, rotate: -2 },
        { id: '#card-3',  endTranslateX: -1500, rotate:  2 },
        { id: '#card-4',  endTranslateX: -1500, rotate: -1 },
        { id: '#card-5',  endTranslateX:  -500,  rotate:  2 },
        { id: '#card-6',  endTranslateX: -2000, rotate: -3 },
        { id: '#card-7',  endTranslateX: -1000, rotate:  2 },
        { id: '#card-8',  endTranslateX: -2000, rotate: -1 },
        { id: '#card-9',  endTranslateX: -1500, rotate:  1 },
        { id: '#card-10', endTranslateX:  -500,  rotate: -1 },
      ];

      // wrapper che si sposta in orizzontale mentre scorri
      gsap.to('.wrapper-404', {
        x: '-350vw',
        ease: 'none',
        scrollTrigger: {
          trigger: '.wrapper-404',
          start: 'top top',
          end: '+=3000',   // PX, NON vh
          scrub: true,
          pin: true,
        },
      });

      cards.forEach((card)=>{
    ScrollTrigger.create({
      trigger:card.id,
      start:'top top',
      end:"+=1200vH",
      scrub:1,
      onUpdate: (self)=>{
        gsap.to(card.id, {
          x:`${card.endTranslateX * self.progress}px`,
          rotate:`${card.rotate * self.progress * 2}px`,
          duration:.5,
          ease:'power3.out'
        } )
      }

    })
  })

      ScrollTrigger.refresh();
    }, rootRef);


    

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <Header/>
    <div ref={rootRef} className="container">
      
      <nav className='navvino'>
      </nav>

      <section  className="wrapper-404">
        <h1>AI Projects</h1>

        <div className="card" id="card-1">
          <img src="https://picsum.photos/400/600?random=1" alt="" />
        </div>

        <div className="card box" id="card-2">
          <img src="https://picsum.photos/400/600?random=2" alt="" />
        </div>

        <div className="card" id="card-3">
          <img src="https://picsum.photos/400/600?random=3" alt="" />
        </div>

        <div className="card" id="card-4">
          <img src="https://picsum.photos/400/600?random=4" alt="" />
        </div>

        <div className="card" id="card-5">
          <img src="https://picsum.photos/400/600?random=5" alt="" />
        </div>

        <div className="card" id="card-6">
          <img src="https://picsum.photos/400/600?random=6" alt="" />
        </div>

        <div className="card" id="card-7">
          <img src="https://picsum.photos/400/600?random=7" alt="" />
        </div>

        <div className="card" id="card-8">
          <img src="https://picsum.photos/400/600?random=8" alt="" />
        </div>

        <div className="card" id="card-9">
          <img src="https://picsum.photos/400/600?random=9" alt="" />
        </div>

        <div className="card" id="card-10">
          <img src="https://picsum.photos/400/600?random=10" alt="" />
        </div>
      </section>
    </div>
     <style jsx global>{`
       *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
          html,body{
        width: 100%;
        height: 100%;
        background: white;
        overflow-x: hidden;
      }

     .card img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

     .navvino a{
        text-decoration: none;
        color: white;
        font-size: 20px;
      }
      h1{
        width: 100%;
        color: black;
        font-size: 48vW;
        text-align: center;
        margin: 0;
      }
      .container{
        width: 100%;
        height: 1200vH;
      }
      .navvino{
        position: fixed;
        top: 0;
        padding: 1em;
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .wrapper-404{
        position:absolute;
        top: 0;
        width: 400vW;
        height: 100vH;
        will-change: transform;
  
      }
      .card{
        position: absolute;
        width: auto;
        height: auto;
        overflow: hidden;
      }
      #card-1{
        top:5%;
        height:100vH;
        left: 5%;
        border:10px solid red

      }
       #card-2{
        bottom:0px;
        left: 15%;
        border:10px solid orange

      }
       #card-3{
        top:0%;
        left: 25%;
        border:10px solid yellow

      }
       #card-4{
        top:65%;
        left: 35%;
        border:10px solid green

      }
       #card-5{
        top:35%;
        left: 45%;
        border:10px solid blue

      }
        #card-6{
        top:5%;
        left: 59%;
        border:10px solid purple

      }
       #card-7{
        bottom:5%;
        left: 70%;

      }
       #card-8{
        top:25%;
        left: 90%;

      }
       #card-9{
        top:65%;
        left: 95%;

      }
       #card-10{
        top:35%;
        left: 90%;

      }
      .outro{
        position: absolute;
        top: 270vH;
        width: 100%;
        height: 100vH;
      }
      .outro h1{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: max-content;
        font-size: 40px;
        text-align: center;
      }
      `}</style>
    </div>
  );
}
