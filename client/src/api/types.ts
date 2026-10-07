// Mirrors the contracts in issue #1. Change them there first.

export type Condition = 'used-like-new' | 'used-good' | 'used-fair'

export interface Listing {
  id: string
  title: string
  price: number
  category: string
  condition: Condition
  emoji: string
  description: string
  seller: string
  location: string
  postedAt: string
}

export interface Category {
  slug: string
  count: number
}

export interface NewListing {
  title: string
  price: number
  category: string
  condition: Condition
  description: string
  seller: string
  location: string
  emoji?: string
}

export interface ValidationError {
  error: string
  fields: Record<string, string>
}
