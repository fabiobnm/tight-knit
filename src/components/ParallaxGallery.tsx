// src/components/RandomHorizontalScroll.tsx
"use client";

import { useState } from "react";

type Props = {
  images: string[];
};

type Item = {
  src: string;
  width: number;
  height: number;
  marginTopPercent: number;
  baseMarginInline: number;
  marginSpeed: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function RandomHorizontalScroll({ images }: Props) {
  // generazione random una sola volta
  const [items] = useState<Item[]>(() =>
    images.map((src) => ({
      src,
      width: rand(160, 320),            // larghezza random px
      height: rand(140, 260),           // altezza random px
      marginTopPercent: rand(0, 50),    // 0% - 50%
      baseMarginInline: rand(20, 100),  // 20px - 100px
      marginSpeed: rand(-0.06, 0.06),   // quanto cambia il margine con lo scroll
    }))
  );

  const [scrollX, setScrollX] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollX(target.scrollLeft);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        onScroll={handleScroll}
        style={{
          width: "100vw",
          height: "80vh",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            height: "100%",
          }}
        >
          {items.map((item, index) => {
            const dynamicMarginInline =
              item.baseMarginInline + scrollX * item.marginSpeed;

            return (
              <div
                key={index}
                style={{
                  flex: "0 0 auto",
                  width: item.width,
                  height: item.height,
                  marginInline: `${dynamicMarginInline}px`,
                  marginTop: `${item.marginTopPercent}%`,
                  overflow: "hidden",
                  borderRadius: 18,
                  background: "#ddd",
                  transition: "margin-inline 0.03s linear",
                }}
              >
                <img
                  src={item.src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
