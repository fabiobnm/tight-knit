'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main
      style={{
        marginTop: '50vh',
        transform: 'translateY(-50%)',
        textAlign: 'center',
        padding: '0 20px',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Something went wrong
      </h1>
      <button
        onClick={reset}
        style={{
          textDecoration: 'underline',
          fontSize: '11px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        TRY AGAIN
      </button>
    </main>
  )
}
