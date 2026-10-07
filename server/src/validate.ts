import { CONDITIONS, type Condition, type NewListing } from './types.ts'

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

export type ValidationResult =
  | { ok: true; value: NewListing }
  | { ok: false; fields: Record<string, string> }

// Validates a POST /api/listings body. Unknown extra fields are dropped.
export function validateNewListing(body: unknown): ValidationResult {
  const b = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>
  const fields: Record<string, string> = {}

  const title = text(b.title, 'title', 3, 80, fields)
  const description = text(b.description, 'description', 10, 1000, fields)
  const seller = text(b.seller, 'seller', 1, 60, fields)
  const location = text(b.location, 'location', 1, 60, fields)

  const price = b.price
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0 || price > 100000) {
    fields.price = 'Price must be a whole number from 0 to 100000'
  }

  const category = b.category
  if (typeof category !== 'string' || !SLUG.test(category)) {
    fields.category = 'Category must be a lowercase slug, e.g. "maker-tools"'
  }

  const condition = b.condition
  if (typeof condition !== 'string' || !CONDITIONS.includes(condition as Condition)) {
    fields.condition = `Condition must be one of: ${CONDITIONS.join(', ')}`
  }

  let emoji: string | undefined
  if (b.emoji !== undefined) {
    if (typeof b.emoji !== 'string') fields.emoji = 'Emoji must be a string'
    else if (b.emoji.trim()) emoji = b.emoji.trim()
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields }

  return {
    ok: true,
    value: {
      title: title!,
      price: price as number,
      category: category as string,
      condition: condition as Condition,
      description: description!,
      seller: seller!,
      location: location!,
      ...(emoji ? { emoji } : {}),
    },
  }
}

function text(
  v: unknown,
  name: string,
  min: number,
  max: number,
  fields: Record<string, string>,
): string | undefined {
  const s = typeof v === 'string' ? v.trim() : undefined
  if (s === undefined || s.length < min || s.length > max) {
    fields[name] = `${cap(name)} must be ${min}–${max} characters`
    return undefined
  }
  return s
}

function cap(s: string): string {
  return s[0].toUpperCase() + s.slice(1)
}
