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

export default function DirectorsList({ directors }: Props) {
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleClickDirector = (name: string) => {
    if (selectedDirector === name) {
      // chiudo
      setSelectedDirector(null);
    } else {
      // chiudo eventualmente quello aperto
      setSelectedDirector(null);
      // dopo l'animazione di chiusura apro il nuovo e resetto lo scroll
      setTimeout(() => {
        setSelectedDirector(name);
        const scroller = scrollerRefs.current[name];
        if (scroller) {
          scroller.scrollLeft = 0; // 👈 reset scroll orizzontale
        }
      }, 400);
    }
  };

  const openProjectGallery = (project: Project) => {
    const images: string[] = [];

    // opzionale: includi la thumbnail come prima immagine
    if (project.thumbnail?.url) {
      images.push(project.thumbnail.url);
    }

    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach((img) => {
        if (img?.url) images.push(img.url);
      });
    }

    if (images.length === 0) return;

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
            <div
              key={director.name}
              style={{
                paddingBottom: "0px",
                transition: "padding-bottom 0.4s",
              }}
            >
              <h2
                onClick={() => handleClickDirector(director.name)}
                className={`nameDirector ${isOpen ? "nameDirector--active" : ""}`}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  alignItems: "center",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {director.name}
              </h2>

              <div
                style={{
                  maxHeight: isOpen ? "60vH" : "0px",
                  overflow: "hidden",
                  transition: isOpen
                    ? "max-height 0.5s ease, opacity 0s ease"
                    : "max-height 0.5s ease, opacity 0.5s ease",
                  marginTop: "6px",
                }}
              >
                
                  <div
                     // ref per poter fare scrollLeft = 0 quando riapro
                  ref={(el) => {
                    scrollerRefs.current[director.name] = el;
                  }}
                    style={{
                      display: "flex",
                      marginTop: "30px",
                      paddingBottom: "30px",
                      overflowX: "auto",
                      fontSize: "14px",
                      lineHeight: 1.4,
                      paddingRight: "8px",
                      gap: "16px",
                      height:'55vH'
                    }}
                  >
                    {/* Colonna About */}
                    <div
                      style={{
                        height: "100%",
                        minWidth: "300px",
                        position: "relative",
                        padding: '0 20px',
                        boxSizing: "border-box",
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        About {director.name}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          paddingRight: "50px",
                        }}
                      >
                        {director.info?.markdown}
                      </div>
                    </div>

                    {/* Projects: thumbnail cliccabile apre la gallery */}
                    {director.projects &&
                      director.projects.map((project, index) => (
                        <div
                          className="projectDiv"
                          key={`${project.title}-${index}`}
                          style={{       
                            cursor: project.thumbnail?.url ? "pointer" : "default",
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
                            {project.title} <br />
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

      {/* Lightbox fullscreen */}
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
