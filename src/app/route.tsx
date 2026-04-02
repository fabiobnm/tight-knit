import { promises as fs } from "fs";
import path from "path";

export async function GET(_request: Request) {
  let html = await fs.readFile(
    path.resolve(process.cwd(), "public", "index.html"),
    "utf8"
  );

  // Inject SEO meta tags into <head> (OG, Twitter, canonical, JSON-LD)
  const seoTags = `
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:site_name" content="Tight Knit" />
  <meta property="og:title" content="Tight Knit - Creative Visual Research" />
  <meta property="og:description" content="London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors." />
  <meta property="og:url" content="https://www.tight-knit.co/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Tight Knit - Creative Visual Research" />
  <meta name="twitter:description" content="London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors." />
  <link rel="canonical" href="https://www.tight-knit.co/" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Tight Knit","url":"https://www.tight-knit.co","logo":"https://www.tight-knit.co/Logo.svg","description":"London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors."},{"@type":"WebSite","name":"Tight Knit","url":"https://www.tight-knit.co"}]}
  </script>`;

  html = html.replace("</head>", `${seoTags}\n</head>`);

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}
