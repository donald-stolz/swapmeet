// The only module that calls fetch. Endpoints and shapes are the issue #1 contracts.
import type { Category, Listing, NewListing, ValidationError } from './types'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
  return res.json() as Promise<T>
}

export function getListings(category?: string): Promise<Listing[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return getJson<Listing[]>(`/api/listings${query}`)
}

/** Resolves to null when the listing does not exist (404). */
export async function getListing(id: string): Promise<Listing | null> {
  const res = await fetch(`/api/listings/${encodeURIComponent(id)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`/api/listings/${id} responded ${res.status}`)
  return res.json() as Promise<Listing>
}

export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>('/api/categories')
}

export type CreateResult =
  | { ok: true; listing: Listing }
  | { ok: false; fields: ValidationError['fields'] }

/** A 400 resolves with the server's field errors; anything else unexpected throws. */
export async function createListing(input: NewListing): Promise<CreateResult> {
  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  if (res.status === 201) return { ok: true, listing: (await res.json()) as Listing }
  if (res.status === 400) {
    const body = (await res.json()) as ValidationError
    return { ok: false, fields: body.fields ?? {} }
  }
  throw new Error(`POST /api/listings responded ${res.status}`)
}
