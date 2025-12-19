// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";


export default function Header() {
  const pathname = usePathname();
    const [hovered, setHovered] = useState<string | null>(null);


  const navItems = [
    { href: "/directors", label: "DIRECTORS" },
    { href: "/about", label: "ABOUT" },
    { href: "/AI", label: "AI" },
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
        <nav
          style={{ position:'fixed', display:'flex', gap:'10vw', paddingRight:'10vw', fontSize:'11px', marginLeft:'50%', top:'20px'}}
        >
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
      </div>
    </header>
  );
}
















