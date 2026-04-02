import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tight-knit.co"),
  title: {
    default: "Tight Knit - Creative Visual Research",
    template: "%s | Tight Knit",
  },
  description: "Tight Knit is a London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors, boasting a diverse range of creative knowledge and skills, across commercial, film & television.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Tight Knit",
    title: "Tight Knit - Creative Visual Research",
    description: "London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors.",
    images: [{ url: "/social.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tight Knit - Creative Visual Research",
    description: "London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors.",
    images: ["/social.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
