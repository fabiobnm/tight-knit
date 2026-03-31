import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tight Knit - Creative Visual Research",
  description: "Tight Knit is a London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors, boasting a diverse range of creative knowledge and skills, across commercial, film & television.",
  keywords: "creative research, visual research, london, AI-collaborators, AI research, AI design, visual editors, writing, writers"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
