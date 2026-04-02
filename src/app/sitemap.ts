import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.tight-knit.co'

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/creatives`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/writers`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/AI`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.8 },
  ]
}
