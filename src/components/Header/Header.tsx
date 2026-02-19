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
        ref={headerRef}
        style={{
          display: "flex",
          padding: "20px",
          paddingBottom: "5px",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: 99,
          alignItems: "center",
          background: menuOpen ? "white" : "url('/gradient.webp') center / cover no-repeat",
        }}
      >
        {/* Logo */}
        <Link style={{ outline: "none",
            boxShadow: "none",
            WebkitTapHighlightColor: "transparent",}} href="/">
          <Image
            
            src="/Logo.svg"
            alt="Logo"
            width={150}
            height={25}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="voiceMenuDesktop">
          {navItems.map((item) => {
            const isCurrent = pathname === item.href;
            const isHovered = hovered === item.href;
            const opacity = isCurrent || isHovered ? 1 : 0.2;

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  opacity,
                  transition: "opacity 0.3s",
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
            top: "53px",
            height: "38px",
            width: "100vw",
            background: menuOpen ? "white" : "transparent",

        }}>
        <button
          className="buttonHeaderMobile"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            position: "fixed",
            top: "53px",
            height: "38px",
            width: "min-content",
            textAlign: "left",
            left: 0,
            paddingLeft: "20px",
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
              top: "90px",
              width: "100%",
              background: "white",
              paddingBottom: "15px",
              left: 0,
              paddingLeft: "20px",
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
