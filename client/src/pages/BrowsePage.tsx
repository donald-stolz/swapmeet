import { useEffect, useState } from 'react'
import { getCategories, getListings } from '../api/client'
import type { Category, Listing } from '../api/types'
import { CategoryFilter } from '../components/CategoryFilter'
import { ItemCard } from '../design-system'
import { categoryLabel, conditionBadge, formatPrice } from '../lib/format'

interface BrowsePageProps {
  /** Id of a listing just created on the sell page, to confirm it posted. */
  postedId?: string
}

export function BrowsePage({ postedId }: BrowsePageProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState<string | null>(null)
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([])) // the grid still works; the filter shows only "All"
  }, [])

  useEffect(() => {
    let cancelled = false
    setListings(null)
    getListings(category ?? undefined)
      .then((data) => !cancelled && setListings(data))
      .catch((err: Error) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [category])

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 [font-stretch:87%]">Found it, nearby.</h1>
        <p className="text-body mt-2 text-[var(--text-soft)]">Local gear from people building something.</p>
      </div>

      {postedId && (
        <p role="status" className="text-body rounded-[var(--radius-md)] bg-[var(--secondary)] px-4 py-3 text-[var(--on-secondary)]">
          Posted. Your listing is live — it's first in the grid.
        </p>
      )}

      <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />

      {error && (
        <p role="alert" className="text-body text-[var(--danger)]">
          Couldn't load listings: {error}
        </p>
      )}
      {!error && !listings && <p className="text-body text-[var(--text-soft)]">Loading listings…</p>}
      {listings && listings.length === 0 && (
        <p className="text-body text-[var(--text-soft)]">
          Nothing in {category ? categoryLabel(category) : 'any category'} yet.
        </p>
      )}

      {listings && listings.length > 0 && (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {listings.map((l) => {
            const badge = conditionBadge(l.condition)
            return (
              <li key={l.id} className="flex">
                <a
                  href={`#/listings/${l.id}`}
                  aria-label={`${l.title}, ${formatPrice(l.price)}`}
                  className="flex w-full justify-center rounded-[var(--radius-md)] no-underline focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                >
                  <ItemCard
                    price={formatPrice(l.price)}
                    title={l.title}
                    distance={l.location}
                    note={l.seller}
                    badge={{ label: badge.label, color: badge.color }}
                    className="transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  />
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
