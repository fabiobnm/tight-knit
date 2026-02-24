"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ================= SORT UMANO ================= */

  const normalize = (s: string) =>
    s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

  const sortedDirectors = useMemo(() => {
    return [...directors].sort((a, b) =>
      normalize(a.name).localeCompare(normalize(b.name), "en")
    );
  }, [directors]);

  /* ================= STATE ================= */

  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [hoverAvatar, setHoverAvatar] = useState<HoverAvatar>(null);
  const [isDragging, setIsDragging] = useState(false);

  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
   const [canHover, setCanHover] = useState(false);

  /* ================= CUSTOM SCROLL (TUO) ================= */

  const smoothScrollToIndex = (index: number) => {
    const isMobile = window.innerWidth <= 768;
    const scrollMultiplier = isMobile ? 31 : 62;

    const targetScroll = index * scrollMultiplier;

    const duration = 500;
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;
    let startTime: number | null = null;

    function easeInOutQuad(t: number) {
      return t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
    }

    function scrollStep(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      window.scrollTo(0, startScroll + distance * easeInOutQuad(progress));
      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  };

  /* ================= OPEN FROM URL ================= */

useEffect(() => {
  const param = searchParams.get("c");
  if (!param) return;

  // sostituisci _ con spazio
  const decoded = param.replace(/_/g, " ").toLowerCase();
  const index = sortedDirectors.findIndex(
    d => d.name.toLowerCase() === decoded
  );
  if (index === -1) return;
  const match = sortedDirectors[index];

  const t = setTimeout(() => {
    setSelectedDirector(match.name);
    smoothScrollToIndex(index);
  }, 0);

  return () => clearTimeout(t);
}, [searchParams, sortedDirectors]);

/* ================= HOVER DETECTION ================= */
useEffect(() => {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  const t = setTimeout(() => setCanHover(mq.matches), 0);

  const handler = (e: MediaQueryListEvent) =>
    setCanHover(e.matches);

  mq.addEventListener("change", handler);
  return () => {
    clearTimeout(t);
    mq.removeEventListener("change", handler);
  };
}, []);

  /* ================= CLICK DIRECTOR ================= */

  const handleClickDirector = (name: string, index: number) => {
    setHoverAvatar(null);

    const isSame = selectedDirector === name;
    const newValue = isSame ? null : name;

    setSelectedDirector(newValue);

 if (newValue) {
    const slug = newValue.replace(/\s+/g, "_");
    router.replace(`/creatives?c=${slug}`, { scroll: false });

    setTimeout(() => {
      smoothScrollToIndex(index);
    }, 350);
  } else {
    router.replace(`/creatives`, { scroll: false });
  }

  const scroller = scrollerRefs.current[name];
  if (scroller) scroller.scrollLeft = 0;
};
  /* ================= LIGHTBOX ================= */

  const openProjectGallery = (project: Project) => {
    const images: string[] = [];
    project.gallery?.forEach(img => {
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

  /* ================= AVATAR WOBBLE ================= */

  const rotation = useRef(0);
  const velocity = useRef(0);
  const avatarEl = useRef<HTMLImageElement | null>(null);
  const lastMouse = useRef<{ x: number; t: number } | null>(null);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

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

  /* ================= HOVER DETECTION ================= */

 

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
     setTimeout(() => setCanHover(mq.matches), 0); // ✅ defer state update
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ================= DRAG ================= */

  const dragStartX = useRef<number | null>(null);
  const scrollStartX = useRef(0);
  const dragDistance = useRef(0);
  const DRAG_THRESHOLD = 6;

  /* ================= RENDER ================= */

  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {sortedDirectors.map((director, i) => {
          const isOpen = selectedDirector === director.name;

          return (
            <div
              key={director.name}
              ref={(el) => {(sectionRefs.current[director.name] = el)}}
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
                onClick={() => handleClickDirector(director.name, i)}
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
                  setHoverAvatar(prev =>
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

              {/* DESKTOP */}
              <div
                className="questoDesktop"
                style={{
                  maxHeight: isOpen ? "60vh" : "0px",
                  overflow: "hidden",
                  transition: "max-height .6s ease-in-out",
                  marginTop: 6,
                }}
              >
                <div
                  className="creativeDiv"
                  ref={(el) => {(scrollerRefs.current[director.name] = el)}}
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
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
                  <div className="creativeAbout">
                    <div>About {director.name}</div>

                    <img
                      className={isOpen ? "avatarBobble" : ""}
                      src={director.avatar?.url}
                      style={{ width: "26%" }}
                      alt=""
                    />

                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          director.info?.html ??
                          "Nessun contenuto AboutUs trovato.",
                      }}
                    />

                    <br />
                    <br />

                    To book {director.name.split(" ")[0]} please{" "}
                    <a href="/contact" style={{ textDecoration: "underline" }}>
                      contact us
                    </a>
                  </div>

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
            </div>
          );
        })}
      </ul>

      {canHover && hoverAvatar && (
        <img
          ref={avatarEl}
          src={hoverAvatar.url}
          alt=""
          style={{
            position: "fixed",
            top: hoverAvatar.y - 50,
            left: hoverAvatar.x + 20,
            width: 100,
            pointerEvents: "none",
            zIndex: 9999,
            transformOrigin: "center",
          }}
        />
      )}

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