import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'listings.json')
const CLIENT_DIST = path.join(__dirname, '..', '..', 'client', 'dist')

const app = Fastify({ logger: true })

async function loadListings() {
  const raw = await readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw)
}

app.get('/api/health', async () => ({ status: 'ok', service: 'swapmeet-api' }))

app.get('/api/listings', async (request) => {
  const listings = await loadListings()
  request.log.info({ count: listings.length }, 'served listings')
  return listings
})

app.get<{ Params: { id: string } }>('/api/listings/:id', async (request, reply) => {
  const listings = await loadListings()
  const listing = listings.find((l: { id: string }) => l.id === request.params.id)
  if (!listing) {
    return reply.code(404).send({ error: 'Listing not found', id: request.params.id })
  }
  return listing
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
