import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadListings, appendListing } from './store.ts'
import { validateNewListing } from './validate.ts'
import type { Category, Listing } from './types.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIST = path.join(__dirname, '..', '..', 'client', 'dist')

const app = Fastify({ logger: true })

// Newest first; ties broken by id, also descending.
function byNewest(a: Listing, b: Listing): number {
  if (a.postedAt !== b.postedAt) return a.postedAt < b.postedAt ? 1 : -1
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0
}

app.get('/api/health', async () => ({ status: 'ok', service: 'swapmeet-api' }))

app.get<{ Querystring: { category?: string } }>('/api/listings', async (request) => {
  const category = request.query.category ?? null
  const all = await loadListings()
  const listings = (category === null ? all : all.filter((l) => l.category === category)).sort(byNewest)
  request.log.info({ count: listings.length, category }, 'served listings')
  return listings
})

app.get<{ Params: { id: string } }>('/api/listings/:id', async (request, reply) => {
  const listings = await loadListings()
  const listing = listings.find((l) => l.id === request.params.id)
  if (!listing) {
    return reply.code(404).send({ error: 'Listing not found', id: request.params.id })
  }
  return listing
})

app.post('/api/listings', async (request, reply) => {
  const result = validateNewListing(request.body)
  if (!result.ok) {
    request.log.info({ fields: Object.keys(result.fields) }, 'rejected listing')
    return reply.code(400).send({ error: 'Validation failed', fields: result.fields })
  }
  const listing = await appendListing(result.value)
  request.log.info({ id: listing.id }, 'created listing')
  return reply.code(201).send(listing)
})

app.get('/api/categories', async (request) => {
  const counts = new Map<string, number>()
  for (const l of await loadListings()) counts.set(l.category, (counts.get(l.category) ?? 0) + 1)
  const categories: Category[] = [...counts]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0))
  request.log.info({ categories: categories.length }, 'served categories')
  return categories
})

// Serve the built React app when client/dist exists (production mode).
// In development the Vite dev server handles the frontend and proxies /api here.
if (existsSync(CLIENT_DIST)) {
  app.register(fastifyStatic, { root: CLIENT_DIST })
}

const port = Number(process.env.PORT) || 3001
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
