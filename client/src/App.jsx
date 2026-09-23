import { useEffect, useState } from 'react'

// v0: SwapMeet works, but it's not pretty. The landing page renders the raw
// listings payload straight from the API. Turning this into a real listings
// page is the feature you'll deliver using parallel lanes.
export default function App() {
  const [listings, setListings] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => {
        if (!res.ok) throw new Error(`API responded ${res.status}`)
        return res.json()
      })
      .then(setListings)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="bg-terracotta text-chalk shadow">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="font-display text-5xl">🛒 SwapMeet</h1>
          <p className="mt-2 text-lg font-bold">Local listings for people building something.</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <p className="rounded-lg border-2 border-ink bg-mustard px-4 py-3 font-bold text-ink">
            Failed to load listings: {error}
          </p>
        )}
        {!error && !listings && <p className="animate-pulse text-ink/70">Loading listings…</p>}

        {listings && (
          <>
            <p className="mb-4 text-ink/80">
              <span className="mr-2 inline-block rounded-full bg-teal px-3 py-1 font-stamp text-sm text-chalk">
                {listings.length} live
              </span>
              Raw payload below — your job is to make this beautiful.
            </p>
            <pre className="overflow-x-auto rounded-xl border border-border bg-chalk p-4 font-stamp text-sm leading-relaxed text-ink">
              {JSON.stringify(listings, null, 2)}
            </pre>
          </>
        )}
      </main>
    </div>
  )
}
