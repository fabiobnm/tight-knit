'use client';

import { useState, useRef, useEffect } from "react";
import type { Director, Project } from "@/lib/queries/directors";

type Props = {
  directors: Director[];
};

type HoverAvatar = {
  url: string;
  x: number;
  y: number;
} | null;

export default function DirectorsList({ directors }: Props) {
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [hoverAvatar, setHoverAvatar] = useState<HoverAvatar>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

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

  const handleClickDirector = (name: string, index: number) => {
    setSelectedDirector((prev) => (prev === name ? null : name));

    // scroll verticale con easing
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
      if (progress < 1) {
        window.requestAnimationFrame(scrollStep);
      }
    }

    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    setTimeout(() => {
      window.requestAnimationFrame(scrollStep);
    }, 350);
  };

  const handleProjectClick = (project: Project) => {
    if (project.linkGallery) {
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
                  setHoverAvatar({ url: director.avatar.url, x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  if (!canHover) return;
                  setHoverAvatar((prev) =>
                    prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                  );
                }}
                onMouseLeave={() => setHoverAvatar(null)}
              >
                {director.name}
              </h2>

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
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                >
                  {/* Projects */}
                  {director.projects?.map((project, index) => (
                    <div
                      key={`${project.title}-${index}`}
                      className="projectDiv"
                      onMouseUp={() => handleProjectClick(project)}
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

      {/* Avatar hover */}
      {canHover && hoverAvatar && (
        <img
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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setIframeUrl(null)}
        >
          <iframe
            src={iframeUrl}
            style={{ width: "80%", height: "80%", border: "none", borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
