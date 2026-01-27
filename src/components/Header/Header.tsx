// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";


export default function Header() {
  const pathname = usePathname();
    const [hovered, setHovered] = useState<string | null>(null);
      const [menuOpen, setMenuOpen] = useState(false);



  const navItems = [
    { href: "/creatives", label: "CREATIVES" },
    { href: "/writers", label: "WRITERS" },
    { href: "/AI", label: "AI" },
    { href: "/about", label: "ABOUT" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <header>
      <div
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
        }}
      >
        {/* Logo / Brand */}
        <Link href="/">
          <Image src="/Logo.svg" alt="Next.js logo" width={150} height={25} priority />
        </Link>

        {/* Nav */}
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
                  cursor: "pointer",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>



        {/* Toggle button */}
        <button className="buttonHeaderMobile"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
             position: "fixed",
              top: "60px",
              left: "20px",
            color:'black',
            marginLeft: "auto",
            fontSize: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? "−" : "+"}
        </button>

        {/* Nav */}
        {menuOpen && (
          <nav className="HeaderMobile"
            style={{
              position: "fixed",
              top: "90px",
              lineHeight:'3',
              width:'100%',
              background:'white',
              paddingBottom:'15px',
              left: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "11px",
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
                    cursor: "pointer",
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
















