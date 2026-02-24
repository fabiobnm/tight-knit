"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { href: "/creatives", label: "CREATIVES" },
    { href: "/writers", label: "WRITERS" },
   
    { href: "/about", label: "ABOUT" },
    { href: "/contact", label: "CONTACT" },
  ];

  /* ===== CLICK OUTSIDE ===== */
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header>
      <div
      className="gradientHeader"
        ref={headerRef}
        style={{
          display: "flex",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: 99,
          alignItems: "center",
          background: menuOpen ? "white" : "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 45%, rgba(255, 255, 255, 0.96) 55%, rgba(255, 255, 255, 0.85) 65%, rgba(255, 255, 255, 0.65) 75%, rgba(255, 255, 255, 0.35) 88%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        {/* Logo */}
        <Link style={{ outline: "none",
            boxShadow: "none",
            WebkitTapHighlightColor: "transparent",}} href="/">
          <img
    
            src="/Logo.svg"
            alt="Logo"
            style={{height:'20px'}}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="voiceMenuDesktop">
          {navItems.map((item) => {
            const isCurrent = pathname === item.href;
            const isHovered = hovered === item.href;
            const opacity = isCurrent || isHovered ? 1 : 0.2;
            const color = isCurrent || isHovered ? 'black' : '#8b8b8b';

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  color,
                  transition: "color .3s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Toggle button */}
        <div className="noDesktop" style={{
           position: "fixed",
            top: "42px",
            height: "38px",
            left:'0',
            width: "101vw",
            background: menuOpen ? "white" : "transparent",

        }}>
        <button
          className="buttonHeaderMobile"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            position: "fixed",
            top: "7px",
            height: "38px",
            width: "min-content",
            textAlign: "center",
            right: 0,
            paddingRight: "20px",
            color: "black",
            fontSize: "20px",
            background: menuOpen ? "white" : "transparent",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
            zIndex: 100,
            outline: "none",
            boxShadow: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? "−" : "+"}
        </button>
        </div>
        

        {/* Mobile nav */}
        {menuOpen && (
          <nav
            className="HeaderMobile"
            style={{
              position: "fixed",
              top: "79px",
              width: "100%",
              background: "white",
              paddingBottom: "15px",
              left: 0,
              textAlign:'center',
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "11px",
              lineHeight: 3,
            }}
          >
            {navItems.map((item) => {
              const isCurrent = pathname === item.href;
              const isHovered = hovered === item.href;
              const opacity = isCurrent || isHovered ? 1 : 0.3;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    opacity,
                    transition: "opacity 0.3s",
                     outline: "none",
            boxShadow: "none",
            WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
