// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";


export default function Header() {
  return (
    <header>
      <div style={{display:'flex', padding:'20px',paddingBottom:'5px', position:'fixed', top:0,left:0,width:'100vW', zIndex:99}} >
        {/* Logo / Brand */}
        <Link href="/">
          <Image
          src="/Logo.svg"
          alt="Next.js logo"
          width={150}
          height={25}
          priority
        />
        </Link>

        {/* Nav */}
        <nav style={{ position:'fixed', display:'flex', gap:'10vw', paddingRight:'10vw', fontSize:'11px', marginLeft:'50%'}}>
          <Link href="/directors" className="hover:underline">
            DIRECTORS
          </Link>
          <Link href="/about" className="hover:underline">
            ABOUT
          </Link>
          <Link href="/AI" className="hover:underline">
            AI
          </Link>
          <Link href="/contact" className="hover:underline">
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
}
