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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="text-4xl font-extrabold tracking-tight">🛒 SwapMeet</h1>
          <p className="mt-2 text-lg text-emerald-50">Local listings for people building something.</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            Failed to load listings: {error}
          </p>
        )}
        {!error && !listings && <p className="animate-pulse text-slate-500">Loading listings…</p>}

        {listings && (
          <>
            <p className="mb-4 text-slate-600">
              <span className="mr-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                {listings.length} live
              </span>
              Raw payload below — your job is to make this beautiful.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-[13px] leading-relaxed text-emerald-200 shadow-inner">
              {JSON.stringify(listings, null, 2)}
            </pre>
          </>
        )}
      </main>
    </div>
  )
}
