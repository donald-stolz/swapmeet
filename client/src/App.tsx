import { useEffect, useState } from 'react'

// v0: SwapMeet works, but it's not pretty. The landing page renders the raw
// listings payload straight from the API. Turning this into a real listings
// page is the feature you'll deliver using parallel lanes.
export default function App() {
  const [listings, setListings] = useState<unknown[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => {
        if (!res.ok) throw new Error(`API responded ${res.status}`)
        return res.json()
      })
      .then(setListings)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>🛒 SwapMeet</h1>
      <p>Local listings for people building something.</p>

      {error && <p style={{ color: 'crimson' }}>Failed to load listings: {error}</p>}
      {!error && !listings && <p>Loading listings…</p>}

      {listings && (
        <>
          <p>
            <strong>{listings.length}</strong> listings live. Raw payload below — your job is to make
            this beautiful.
          </p>
          <pre
            style={{
              background: '#f4f4f4',
              padding: '1rem',
              borderRadius: 8,
              overflowX: 'auto',
              fontSize: 13
            }}
          >
            {JSON.stringify(listings, null, 2)}
          </pre>
        </>
      )}
    </main>
  )
}
