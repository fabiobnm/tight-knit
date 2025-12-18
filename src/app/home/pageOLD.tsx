'use client';

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
     // document.body.style.backgroundColor = '#000';
      setShowHeader(true);
    }, 2000);

    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{background:'red'}}>
      {showHeader && <Header />}

      <main>
        <img className="logoHomePage" src="/Logo.svg" alt="" />
      </main>
    </div>
  );
}
