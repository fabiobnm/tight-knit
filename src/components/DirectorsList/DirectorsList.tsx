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
  const [isDragging, setIsDragging] = useState(false);

  // ref per scroll orizzontale e per scroll verticale
  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* ================= AVATAR WOBBLE ================= */
  const rotation = useRef(0);
  const velocity = useRef(0);
  const avatarEl = useRef<HTMLImageElement | null>(null);
  const lastMouse = useRef<{ x: number; t: number } | null>(null);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  /* ================= DRAG SCROLL ================= */
  const dragStartX = useRef<number | null>(null);
  const scrollStartX = useRef(0);
  const dragDistance = useRef(0);
  const DRAG_THRESHOLD = 6;

  /* ================= HOVER DETECTION ================= */
  const [canHover, setCanHover] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ================= CLICK DIRECTOR ================= */
  const handleClickDirector = (name: string) => {
    setHoverAvatar(null);

    const isSame = selectedDirector === name;
    setSelectedDirector(isSame ? null : name);

    // Delay per transizione max-height
{ /*   setTimeout(() => {
      if (!isSame) {
        // scroll verticale al centro della viewport
        const section = sectionRefs.current[name];
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }

        // reset scroll orizzontale del contenitore creativo
        const scroller = scrollerRefs.current[name];
        if (scroller) scroller.scrollLeft = 0;
      }
    }, 350);
    */}
  };

  /* ================= OPEN LIGHTBOX ================= */
  const openProjectGallery = (project: Project) => {
    const images: string[] = [];
    project.gallery?.forEach((img) => {
      if (img?.url) images.push(img.url);
    });
    if (!images.length) return;

    setLightbox({
      images,
      initialIndex: 0,
      title: project.title,
      client: project.client,
    });
  };

  /* ================= AVATAR SPRING ================= */
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
      rotation.current = clamp(rotation.current, -MAX_ROTATION, MAX_ROTATION);

      if (rotation.current === MAX_ROTATION || rotation.current === -MAX_ROTATION) {
        velocity.current *= 0.4;
      }

      if (avatarEl.current) {
        avatarEl.current.style.transform = `rotate(${rotation.current}deg)`;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {directors.map((director) => {
          const isOpen = selectedDirector === director.name;

          return (
          <div
  key={director.name}
  ref={(el) => {
    sectionRefs.current[director.name] = el; // assegna ma non ritorna nulla
  }}
>
              <h2
                className={`nameDirector ${isOpen ? "nameDirector--active" : ""}`}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: 500,
                  margin: 0,
                  marginInline: "auto",
                  width: "fit-content",
                }}
                onClick={() => handleClickDirector(director.name)}
                onMouseEnter={(e) => {
                  if (!canHover || isOpen || !director.avatar?.url) return;
                  setHoverAvatar({
                    url: director.avatar.url,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onMouseMove={(e) => {
                  if (!canHover) return;
                  const now = performance.now();
                  if (lastMouse.current) {
                    const dx = e.clientX - lastMouse.current.x;
                    const dt = now - lastMouse.current.t;
                    if (dt > 0) velocity.current += (dx / dt) * 18;
                  }
                  lastMouse.current = { x: e.clientX, t: now };
                  setHoverAvatar((prev) =>
                    prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                  );
                }}
                onMouseLeave={() => {
                  lastMouse.current = null;
                  setHoverAvatar(null);
                }}
              >
                {director.name}
              </h2>

              <div className="questoDesktop"
                style={{
                  maxHeight: isOpen ? "60vh" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease-in",
                  marginTop: "6px",
                }}
              >
                <div
                  className="creativeDiv"
                  ref={(el) => {
                     scrollerRefs.current[director.name] = el; // solo assegnamento
                      }}
                  style={{
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                  onMouseDown={(e) => {
                    const el = scrollerRefs.current[director.name];
                    if (!el) return;
                    dragStartX.current = e.clientX;
                    scrollStartX.current = el.scrollLeft;
                    dragDistance.current = 0;
                    setIsDragging(false);
                  }}
                  onMouseMove={(e) => {
                    const el = scrollerRefs.current[director.name];
                    if (!el || dragStartX.current === null) return;
                    const dx = e.clientX - dragStartX.current;
                    dragDistance.current = Math.abs(dx);
                    if (dragDistance.current > DRAG_THRESHOLD) {
                      setIsDragging(true);
                      el.scrollLeft = scrollStartX.current - dx;
                    }
                  }}
                  onMouseUp={() => {
                    dragStartX.current = null;
                    setIsDragging(false);
                  }}
                  onMouseLeave={() => {
                    dragStartX.current = null;
                    setIsDragging(false);
                  }}
                >
                  {/* About */}
                  <div className="creativeAbout">
                    <div>About {director.name}</div>
                    <img
                      className={isOpen ? "avatarBobble" : ""}
                      src={director.avatar?.url}
                      style={{ width: "26%" }}
                      alt=""
                    />
                    <div>

        <div
            style={{
              
            }}
            dangerouslySetInnerHTML={{ __html: director.info?.html ?? "Nessun contenuto AboutUs trovato." }}
          />
                      <br />
                      <br />
                      To book {director.name.split(" ")[0]} please{" "}
                      <a href="/contact" style={{ textDecoration: "underline" }}>
                        contact us
                      </a>
                    </div>
                  </div>

                  {/* Projects */}
                  {director.projects?.map((project, index) => (
                    <div
                      key={`${project.title}-${index}`}
                      className="projectDiv"
                      onMouseUp={() => {
                        if (isDragging) return;
                        openProjectGallery(project);
                      }}
                    >
                      {project.thumbnail?.url && (
                        <img
                          className="projectThumbnail"
                          src={project.thumbnail.url}
                          alt={project.title}
                          loading="eager"
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



              <div className="questoMobile"
                style={{
                  maxHeight: isOpen ? "90vh" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease-in",
                  marginTop: "6px",
                }}
              >
                <div
                  className="creativeDiv"
                 
                  style={{  height:'90vH', overflowY:'hidden',
                    cursor: isDragging ? "grabbing" : "grab", display:'block'
                  }}
                  onMouseDown={(e) => {
                    const el = scrollerRefs.current[director.name];
                    if (!el) return;
                    dragStartX.current = e.clientX;
                    scrollStartX.current = el.scrollLeft;
                    dragDistance.current = 0;
                    setIsDragging(false);
                  }}
                  onMouseMove={(e) => {
                    const el = scrollerRefs.current[director.name];
                    if (!el || dragStartX.current === null) return;
                    const dx = e.clientX - dragStartX.current;
                    dragDistance.current = Math.abs(dx);
                    if (dragDistance.current > DRAG_THRESHOLD) {
                      setIsDragging(true);
                      el.scrollLeft = scrollStartX.current - dx;
                    }
                  }}
                  onMouseUp={() => {
                    dragStartX.current = null;
                    setIsDragging(false);
                  }}
                  onMouseLeave={() => {
                    dragStartX.current = null;
                    setIsDragging(false);
                  }}
                >
                  {/* About */}
                  <div className="creativeAbout">
                    <div>About {director.name}</div>
                    <img
                      className={isOpen ? "avatarBobble" : ""}
                      src={director.avatar?.url}
                      style={{ width: "26%", marginInline:'auto' }}
                      alt=""
                    />
                    <div>
                      <div
            style={{
            
            }}
            dangerouslySetInnerHTML={{ __html: director.info?.html ?? "Nessun contenuto AboutUs trovato." }}
          />
                      <br />
                      <br />
                      To book {director.name.split(" ")[0]} please{" "}
                      <a href="/contact" style={{ textDecoration: "underline" }}>
                        contact us
                      </a>
                    </div>
                  </div>

                  {/* Projects */}

               <div style={{display:'flex', gap:16, overflowX:'auto', paddingInline:'10px'}}>
                  {director.projects?.map((project, index) => (
                    <div 
                      key={`${project.title}-${index}`}
                      className="projectDiv"
                      onMouseUp={() => {
                        if (isDragging) return;
                        openProjectGallery(project);
                      }}
                    >
                      {project.thumbnail?.url && (
                        <img style={{maxHeight:'25vH'}}
                          className="projectThumbnail"
                          src={project.thumbnail.url}
                          alt={project.title}
                          loading="eager"
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


            </div>
          );
        })}
      </ul>

      {/* Avatar hover */}
      {canHover && hoverAvatar && (
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
