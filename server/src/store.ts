import { readFile, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Listing, NewListing } from './types.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'listings.json')

const DEFAULT_EMOJI = '📦'

export async function loadListings(): Promise<Listing[]> {
  const raw = await readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw) as Listing[]
}

// Writes run one at a time: each append waits for the previous one, so id
// assignment and the read-modify-write never interleave.
let writeQueue: Promise<unknown> = Promise.resolve()

export function appendListing(input: NewListing): Promise<Listing> {
  const next = writeQueue.then(() => doAppend(input))
  writeQueue = next.catch(() => {})
  return next
}

async function doAppend(input: NewListing): Promise<Listing> {
  const listings = await loadListings()
  const listing: Listing = {
    id: nextId(listings),
    title: input.title,
    price: input.price,
    category: input.category,
    condition: input.condition,
    emoji: input.emoji ?? DEFAULT_EMOJI,
    description: input.description,
    seller: input.seller,
    location: input.location,
    postedAt: localDate(new Date()),
  }
  listings.push(listing)

  // Atomic replace: a crash mid-write leaves the old file intact.
  const tmp = `${DATA_FILE}.${process.pid}.tmp`
  await writeFile(tmp, JSON.stringify(listings, null, 2) + '\n', 'utf8')
  await rename(tmp, DATA_FILE)
  return listing
}

function nextId(listings: Listing[]): string {
  const max = listings.reduce((m, l) => {
    const n = Number(/^lst-(\d+)$/.exec(l.id)?.[1] ?? 0)
    return n > m ? n : m
  }, 0)
  return `lst-${String(max + 1).padStart(3, '0')}`
}

function localDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
