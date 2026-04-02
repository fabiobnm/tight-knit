export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Tight Knit',
        url: 'https://www.tight-knit.co',
        logo: 'https://www.tight-knit.co/Logo.svg',
        description:
          'London based team of Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors.',
      },
      {
        '@type': 'WebSite',
        name: 'Tight Knit',
        url: 'https://www.tight-knit.co',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
