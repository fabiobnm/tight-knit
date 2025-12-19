// src/components/DirectorsList.tsx
"use client";

import { useState, useRef } from "react";
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

  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
                  if (!director.avatar?.url) return;
                  setHoverAvatar({
                    url: director.avatar.url,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onMouseMove={(e) => {
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
                      padding: "0 20px",
                    }}
                  >
                    <div>About {director.name}</div>
                    <div style={{ position: "absolute", bottom: 0 }}>
                      {director.info?.markdown}
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
          src={hoverAvatar.url}
          alt=""
          style={{
            position: "fixed",
            top: hoverAvatar.y - 50,
            left: hoverAvatar.x + 20,
            width: "100px",
            pointerEvents: "none",
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
