// src/components/WritersList.tsx
"use client";

import { useState, useRef,  useEffect } from "react";
import type { Writer } from "@/lib/queries/writers";

type Props = {
  writers: Writer[];
};



type HoverAvatar = {
  url: string;
  x: number;
  y: number;
} | null;

export default function WritersList({ writers }: Props) {
  const [selectedWriter, setSelectedWriter] = useState<string | null>(null);
  const [hoverAvatar, setHoverAvatar] = useState<HoverAvatar>(null);

  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});


const rotation = useRef(0);
const velocity = useRef(0);
const avatarEl = useRef<HTMLImageElement | null>(null);
const lastMouse = useRef<{ x: number; t: number } | null>(null);
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));



  const handleClickDirector = (name: string) => {
    if (selectedWriter === name) {
      setSelectedWriter(null);
    } else {
      setSelectedWriter(null);
      setTimeout(() => {
        setSelectedWriter(name);
        const scroller = scrollerRefs.current[name];
        if (scroller) scroller.scrollLeft = 0;
      }, 400);
    }
  };


useEffect(() => {
  let raf: number;

  const SPRING = 0.12;
  const DAMPING = 0.82;
  const MAX_ROTATION = 35;

  const animate = () => {
    const force = -rotation.current * SPRING;

    velocity.current += force;
    velocity.current *= DAMPING;
    rotation.current += velocity.current;

    // clamp
    rotation.current = clamp(
      rotation.current,
      -MAX_ROTATION,
      MAX_ROTATION
    );

    // dissipa energia ai limiti
    if (
      rotation.current === MAX_ROTATION ||
      rotation.current === -MAX_ROTATION
    ) {
      velocity.current *= 0.4;
      
    }

    if (avatarEl.current) {
      avatarEl.current.style.transform =
        `rotate(${rotation.current}deg)`;
    }

    raf = requestAnimationFrame(animate);
  };

  animate();
  return () => cancelAnimationFrame(raf);
}, []);



  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {writers.map((writer) => {
          const isOpen = selectedWriter === writer.name;

          return (
            <div key={writer.name}>
              <h2
                className={`nameDirector ${isOpen ? "nameDirector--active" : ""}`}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: 500,
                  margin: 0,
                  textTransform: 'uppercase'
                }}
                onClick={() => handleClickDirector(writer.name)}
                      onMouseEnter={(e) => {
                      if (isOpen) return; // ← BLOCCO SE È APERTO
                      if (!writer.avatar?.url) return;

                      setHoverAvatar({
                        url: writer.avatar.url,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
               
       onMouseMove={(e) => {
  const now = performance.now();

  if (lastMouse.current) {
    const dx = e.clientX - lastMouse.current.x;
    const dt = now - lastMouse.current.t;

    if (dt > 0) {
      const speed = dx / dt; // segno incluso

      const POWER = 18; // sensibilità
      velocity.current += speed * POWER;
    }
  }

  lastMouse.current = { x: e.clientX, t: now };

  setHoverAvatar((prev) =>
    prev
      ? { ...prev, x: e.clientX, y: e.clientY }
      : null
  );
}}



     onMouseLeave={() => {
  lastMouse.current = null;
  setHoverAvatar(null);
}}


              >
                {writer.name}
              </h2>

              <div
                style={{
                  maxHeight: isOpen ? "60vH" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease",
                  marginTop: "6px",
                }}
              >
                <div
                  ref={(el) => {
                    scrollerRefs.current[writer.name] = el;
                  }}
                  style={{
                    display: "block",
                    marginTop: "30px",
                    paddingBottom: "30px",
                    overflowX: "auto",
                    gap: "16px",
                    minHeight: "15vH",
                    maxHeight:'50vH',
                  }}
                >
                    <div
            style={{ width:'60vW', marginInline:'auto',
              textAlign: "center", 
            }}
            dangerouslySetInnerHTML={{ __html: writer.bio?.html ?? "Nessun contenuto AboutUs trovato." }}
          />

                 <div style={{width:'60vW', marginInline:'auto', textAlign:'center'}}>
                     <br /><br />
                     To get examples of their work please <a href="/contact" style={{textDecoration:'underline'}}>contact us</a>
                 </div>

               
                </div>
              </div>
            </div>
          );
        })}
      </ul>

        {/* Avatar hover che segue il mouse */}
 {hoverAvatar && (
  <img
    ref={avatarEl}
    src={hoverAvatar.url}
    alt=""
    style={{
      position: "fixed",
      top: hoverAvatar.y - 50,
      left: hoverAvatar.x + 20,
      width: "100px",
      pointerEvents: "none",
      zIndex: 9999,
      transformOrigin: "center",
    }}
  />
)}


   
    </>
  );
}
