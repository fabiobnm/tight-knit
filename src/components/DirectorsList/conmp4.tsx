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
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  /* ================= AVATAR SPRING ================= */
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

  /* ================= DRAG SCROLL ================= */
  const dragStartX = useRef<number | null>(null);
  const scrollStartX = useRef(0);
  const dragDistance = useRef(0);
  const DRAG_THRESHOLD = 6;

  /* ================= CLICK DIRECTOR ================= */
  const handleClickDirector = (name: string, index: number) => {
    setHoverAvatar(null);
    const isMobile = window.innerWidth <= 768;
    const scrollMultiplier = isMobile ? 31 : 62;
    const targetScroll = index * scrollMultiplier;
    const duration = 500;
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;
    let startTime: number | null = null;

    function scrollStep(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      window.scrollTo(0, startScroll + distance * easeInOutQuad(progress));
      if (progress < 1) window.requestAnimationFrame(scrollStep);
    }

    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    window.setTimeout(() => {
      window.requestAnimationFrame(scrollStep);
    }, 350);

    const isSame = selectedDirector === name;
    setSelectedDirector(isSame ? null : name);
  };

  /* ================= OPEN LIGHTBOX ================= */
  const openProjectGallery = (project: Project) => {
    const images: string[] = [];
    project.gallery?.forEach((img) => {
      if (img?.url && img.mimeType?.startsWith("image/")) images.push(img.url);
    });
    if (!images.length) return;

    setLightbox({
      images,
      initialIndex: 0,
      title: project.title,
      client: project.client,
    });
  };

  /* ================= IFRAME SCROLL OVERLAY ================= */
  useEffect(() => {
    if (!iframeUrl) return;
    document.body.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      if (!iframeRef.current) return;
      const iframeWindow = iframeRef.current.contentWindow;
      if (!iframeWindow) return;
      iframeWindow.scrollBy({ left: e.deltaY, behavior: "auto" });
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
    };
  }, [iframeUrl]);

  const handleProjectClick = (project: Project) => {
    if (!project.thumbnail?.url) return;
    const isVideo = project.thumbnail.mimeType?.startsWith("video/");
    if (isVideo) {
      setIframeUrl(project.thumbnail.url);
    } else if (project.linkGallery) {
      setIframeUrl(project.linkGallery);
    }
  };

  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {directors.map((director, i) => {
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

              {/* Desktop */}
              <div
                className="questoDesktop"
                style={{
                  maxHeight: isOpen ? "60vh" : "0px",
                  overflow: "hidden",
                  transition: "max-height .6s ease-in-out",
                  marginTop: "6px",
                }}
              >
                <div
                  className="creativeDiv"
                  ref={(el) => {(scrollerRefs.current[director.name] = el)}}
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
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          director.info?.html ?? "Nessun contenuto AboutUs trovato.",
                      }}
                    />
                    <br />
                    To book {director.name.split(" ")[0]} please{" "}
                    <a href="/contact" style={{ textDecoration: "underline" }}>
                      contact us
                    </a>
                  </div>

                  {/* Projects */}
                  <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
                    {director.projects?.map((project, index) => {
                      const isVideo = project.thumbnail?.mimeType?.startsWith(
                        "video/"
                      );
                      return (
                        <div
                          key={`${project.title}-${index}`}
                          className="projectDiv"
                          onMouseUp={() => {
                            if (isDragging) return;
                            handleProjectClick(project);
                          }}
                        >
                          {project.thumbnail?.url && !isVideo && (
                            <img
                              className="projectThumbnail"
                              src={project.thumbnail.url}
                              alt={project.title}
                              loading="eager"
                              
                            />
                          )}
                          {isVideo && (
                            <video
                              src={project?.thumbnail?.url}
                              style={{maxHeight:'100%'}}
  autoPlay
  muted
  loop
  playsInline
                            />
                          )}
                          <div className="projectText">
                            {project.title}
                            <br />
                            {project.client}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile */}
              <div
                className="questoMobile"
                style={{
                  maxHeight: isOpen ? "85vh" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease-in",
                  marginTop: "6px",
                }}
              >
                <div
                  className="creativeDiv"
                  style={{
                    height: "85vh",
                    overflowY: "hidden",
                    cursor: isDragging ? "grabbing" : "grab",
                    display: "block",
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
                      style={{ width: "26%", marginInline: "auto" }}
                      alt=""
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          director.info?.html ?? "Nessun contenuto AboutUs trovato.",
                      }}
                    />
                    <br />
                    To book {director.name.split(" ")[0]} please{" "}
                    <a href="/contact" style={{ textDecoration: "underline" }}>
                      contact us
                    </a>
                  </div>

                  {/* Projects */}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      overflowX: "auto",
                      paddingInline: "10px",
                    }}
                  >
                    {director.projects?.map((project, index) => {
                      const isVideo = project.thumbnail?.mimeType?.startsWith(
                        "video/"
                      );
                      return (
                        <div
                          key={`${project.title}-${index}`}
                          className="projectDiv"
                          onMouseUp={() => {
                            if (isDragging) return;
                            handleProjectClick(project);
                          }}
                        >
                          {project.thumbnail?.url && !isVideo && (
                            <img
                             
                              className="projectThumbnail"
                              src={project.thumbnail.url}
                              alt={project.title}
                              loading="eager"
                            />
                          )}
                          {isVideo && (
                            <video
                              src={project?.thumbnail?.url}
                              style={{ maxHeight: "100%" }}
                              
  autoPlay
  muted
  loop
  playsInline
                            />
                          )}
                          <div className="projectText">
                            {project.title}
                            <br />
                            {project.client}
                          </div>
                        </div>
                      );
                    })}
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

      {/* Iframe overlay */}
      {iframeUrl && (
        <div
          onClick={() => setIframeUrl(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setIframeUrl(null)}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 10000,
              background: "white",
              border: "none",
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>

          <iframe
            ref={iframeRef}
            src={iframeUrl}
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{
              width: "100vw",
              height: "100vh",
              border: "none",
              background: "white",
            }}
          />
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <LightboxGallery
          images={lightbox.images}
          initialIndex={lightbox.initialIndex}
          title={lightbox.title}
          client={lightbox.client}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
