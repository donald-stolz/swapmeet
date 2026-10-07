import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { BrowsePage } from './pages/BrowsePage'
import { ListingPage, NotFound } from './pages/ListingPage'
import { SellPage } from './pages/SellPage'

// Hash routes: #/  #/listings/:id  #/sell. Hash routing keeps prod deep links
// working with no server fallback route and no router dependency.
type Route =
  | { page: 'browse'; postedId?: string }
  | { page: 'listing'; id: string }
  | { page: 'sell' }
  | { page: 'not-found'; path: string }

function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  if (path === '' || path === '/') {
    const postedId = new URLSearchParams(query).get('posted') ?? undefined
    return { page: 'browse', postedId }
  }
  if (path === '/sell') return { page: 'sell' }
  const match = /^\/listings\/([^/]+)$/.exec(path)
  if (match) return { page: 'listing', id: decodeURIComponent(match[1]) }
  return { page: 'not-found', path }
}

function useHashRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export default function App() {
  const route = useHashRoute()
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {route.page === 'browse' && <BrowsePage key={route.postedId ?? ''} postedId={route.postedId} />}
        {route.page === 'listing' && <ListingPage id={route.id} />}
        {route.page === 'sell' && <SellPage />}
        {route.page === 'not-found' && <NotFound what={`Nothing lives at "${route.path}".`} />}
      </main>
    </>
  )
}
