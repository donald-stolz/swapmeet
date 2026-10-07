import type { Category } from '../api/types'
import { categoryLabel } from '../lib/format'

interface CategoryFilterProps {
  categories: Category[]
  /** null = "All" */
  selected: string | null
  onSelect: (slug: string | null) => void
}

const pill =
  'rounded-[var(--radius-pill)] border-[length:var(--hairline)] border-solid px-4 py-2 ' +
  '[font-family:var(--font-sans)] text-sm font-bold cursor-pointer ' +
  'focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]'
const active = 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
const idle = 'bg-[var(--surface)] text-[var(--text)] border-[var(--line-strong)] hover:bg-[var(--panel)]'

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const total = categories.reduce((sum, c) => sum + c.count, 0)
  const options: { slug: string | null; label: string; count?: number }[] = [
    { slug: null, label: 'All', count: categories.length ? total : undefined },
    ...categories.map((c) => ({ slug: c.slug, label: categoryLabel(c.slug), count: c.count }))
  ]
  return (
    <nav aria-label="Filter by category" className="flex flex-wrap gap-2 rounded-[var(--radius-lg)] bg-[var(--panel)] p-3">
      {options.map((o) => {
        const isActive = o.slug === selected
        return (
          <button
            key={o.slug ?? 'all'}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(o.slug)}
            className={`${pill} ${isActive ? active : idle}`}
          >
            {o.label}
            {o.count !== undefined && <span className="opacity-75"> ({o.count})</span>}
          </button>
        )
      })}
    </nav>
  )
}
