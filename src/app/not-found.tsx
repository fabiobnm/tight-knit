import Link from 'next/link'
import Header from '@/components/Header/Header'

export default function NotFound() {
  return (
    <div>
      <Header />
      <main
        style={{
          marginTop: '50vh',
          transform: 'translateY(-50%)',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Page Not Found
        </h1>
        <p style={{ marginBottom: '2rem' }}>
          The page you are looking for does not exist.
        </p>
        <Link href="/" style={{ textDecoration: 'underline', fontSize: '11px' }}>
          BACK TO HOME
        </Link>
      </main>
    </div>
  )
}
