// src/components/DirectorsList.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import type { Director, Project } from "@/lib/queries/directors";
import LightboxGallery from "@/components/LightboxGallery/LightboxGallery";

type Props = {
  directors: Director[];
};

type LightboxState = {
  images: string[];
  initialIndex: number;
  title: string;
  client: string;
} | null;

type HoverAvatar = {
  url: string;
  x: number;
  y: number;
} | null;



export default function DirectorsList({ directors }: Props) {
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [hoverAvatar, setHoverAvatar] = useState<HoverAvatar>(null);

  const lastPos = useRef<{ x: number; y: number; t: number } | null>(null);
  const velocityRef = useRef(0);

  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const avatarRef = useRef<HTMLImageElement | null>(null);

  const distanceRef = useRef(20);        // distanza attuale
const targetDistanceRef = useRef(20);  // distanza desiderata

useEffect(() => {
  let raf: number;
  let angle = 0;
  let direction = 1;

  const animate = () => {
    if (avatarRef.current && hoverAvatar) {
      // easing distanza
      distanceRef.current +=
        (targetDistanceRef.current - distanceRef.current) * 0.12;

      // oscillazione
      const speed = velocityRef.current || 1;
      angle += direction * speed * 0.15;

      if (angle > speed) direction = -1;
      if (angle < -speed) direction = 1;

      avatarRef.current.style.transform = `
        translate(${distanceRef.current}px, 0)
        rotate(${angle}deg)
      `;
    }

    raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(raf);
}, [hoverAvatar]);



  const handleClickDirector = (name: string) => {
    if (selectedDirector === name) {
      setSelectedDirector(null);
    } else {
      setSelectedDirector(null);
      setTimeout(() => {
        setSelectedDirector(name);
        const scroller = scrollerRefs.current[name];
        if (scroller) scroller.scrollLeft = 0;
      }, 400);
    }
  };

  const openProjectGallery = (project: Project) => {
    const images: string[] = [];

    if (project.thumbnail?.url) {
      images.push(project.thumbnail.url);
    }

    if (project.gallery?.length) {
      project.gallery.forEach((img) => {
        if (img?.url) images.push(img.url);
      });
    }

    if (!images.length) return;

    setLightbox({
      images,
      initialIndex: 0,
      title: project.title,
      client: project.client,
    });
  };

  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {directors.map((director) => {
          const isOpen = selectedDirector === director.name;

          return (
            <div key={director.name}>
              <h2
                className={`nameDirector ${isOpen ? "nameDirector--active" : ""}`}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: 500,
                  margin: 0,
                }}
                onClick={() => handleClickDirector(director.name)}
                onMouseEnter={(e) => {
                      if (isOpen) return; // ← BLOCCO SE È APERTO
                      if (!director.avatar?.url) return;

                      setHoverAvatar({
                        url: director.avatar.url,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}

             onMouseMove={(e) => {
                      const now = performance.now();

                      if (lastPos.current) {
                        const dx = e.clientX - lastPos.current.x;
                        const dy = e.clientY - lastPos.current.y;
                        const dt = now - lastPos.current.t || 16;

                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const velocity = Math.min(dist / dt * 25, 40); // clamp
                        velocityRef.current = velocity;

                        // distanza target (px)
                        targetDistanceRef.current = 20 + velocity * 2;

                        // clamp: evita valori fuori scala
                        velocityRef.current = Math.min(velocity * 20, 30);
                      }

                      lastPos.current = {
                        x: e.clientX,
                        y: e.clientY,
                        t: now,
                      };

                      setHoverAvatar((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: e.clientX,
                              y: e.clientY,
                            }
                          : null
                      );
                    }}


                onMouseLeave={() => setHoverAvatar(null)}
              >
                {director.name}
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
                    scrollerRefs.current[director.name] = el;
                  }}
                  style={{
                    display: "flex",
                    marginTop: "30px",
                    paddingBottom: "30px",
                    overflowX: "auto",
                    gap: "16px",
                    height: "55vH",
                  }}
                >
                  {/* About */}
                  <div
                    style={{
                      minWidth: "25vW",
                      position: "relative",
                      display:'flex',
                      padding: "0 0px 37px 20px",
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>About {director.name}</div>
                     <img className={` ${isOpen ? "avatarBobble" : ""}`} src={director.avatar?.url} style={{width:'40%'}} alt="" />
                    <div style={{ }}>
                     
                      {director.info?.markdown} <br /> <br />
                      to book {director.name.split(" ")[0].toLowerCase()
                      .replace(/^./, c => c.toUpperCase())} please <a href="/contact" style={{textDecoration:'underline'}}>contact us</a>
                    </div>
                  </div>

                  {/* Projects */}
                  {director.projects?.map((project, index) => (
                    <div
                      key={`${project.title}-${index}`}
                      className="projectDiv"
                      style={{
                        cursor: project.thumbnail?.url
                          ? "pointer"
                          : "default",
                      }}
                      onClick={() => openProjectGallery(project)}
                    >
                      {project.thumbnail?.url && (
                        <img
                          className="projectThumbnail"
                          src={project.thumbnail.url}
                          alt={project.title}
                        />
                      )}
                      <div className="projectText">
                        {project.title}
                        <br />
                        {project.client}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </ul>

      {/* Avatar hover che segue il mouse */}
   {hoverAvatar && (
 <img
  ref={avatarRef}
  src={hoverAvatar.url}
  alt=""
  style={{
    position: "fixed",
    top: hoverAvatar.y - 50,
    left: hoverAvatar.x,
    width: "100px",
    pointerEvents: "none",
    transformOrigin: "left center",
    zIndex: 9999,
  }}
/>

)}


      {/* Lightbox */}
      {lightbox && (
        <LightboxGallery
          images={lightbox.images}
          initialIndex={lightbox.initialIndex}
          onClose={() => setLightbox(null)}
          title={lightbox.title}
          client={lightbox.client}
        />
      )}
    </>
  );
}
