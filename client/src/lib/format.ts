import type { BadgeColor } from '../design-system'
import type { Condition } from '../api/types'

export function formatPrice(price: number): string {
  return '$' + price.toLocaleString('en-US')
}

export const conditions: Record<Condition, { label: string; color: BadgeColor }> = {
  'used-like-new': { label: 'Like new', color: 'leaf' },
  'used-good': { label: 'Good', color: 'teal' },
  'used-fair': { label: 'Fair', color: 'marigold' }
}

export function conditionBadge(condition: Condition): { label: string; color: BadgeColor } {
  return conditions[condition] ?? { label: condition, color: 'marigold' }
}

/** "maker-tools" → "Maker tools" */
export function categoryLabel(slug: string): string {
  const words = slug.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** "2026-07-28" → "Jul 28, 2026" (parsed as a calendar date, not UTC midnight). */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
