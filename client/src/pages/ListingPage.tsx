import { useEffect, useState } from 'react'
import { getListing } from '../api/client'
import type { Listing } from '../api/types'
import { Badge, Icon } from '../design-system'
import { categoryLabel, conditionBadge, formatDate, formatPrice } from '../lib/format'

type State = { status: 'loading' } | { status: 'found'; listing: Listing } | { status: 'missing' } | { status: 'error'; message: string }

const backLink = 'text-body font-bold text-[var(--primary)]'

export function ListingPage({ id }: { id: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    getListing(id)
      .then((listing) => !cancelled && setState(listing ? { status: 'found', listing } : { status: 'missing' }))
      .catch((err: Error) => !cancelled && setState({ status: 'error', message: err.message }))
    return () => {
      cancelled = true
    }
  }, [id])

  if (state.status === 'loading') return <p className="text-body text-[var(--text-soft)]">Loading listing…</p>
  if (state.status === 'error')
    return (
      <p role="alert" className="text-body text-[var(--danger)]">
        Couldn't load this listing: {state.message}
      </p>
    )
  if (state.status === 'missing') return <NotFound what={`No listing with id "${id}".`} />

  const l = state.listing
  const badge = conditionBadge(l.condition)
  return (
    <article className="flex flex-col gap-6">
      <a href="#/" className={backLink}>
        ← All listings
      </a>
      <div className="grid gap-8 md:grid-cols-2">
        <div
          role="img"
          aria-label={l.title}
          className="flex aspect-square items-center justify-center rounded-[var(--radius-lg)] border-[length:var(--outline)] border-solid border-[var(--line)] bg-[var(--panel)] text-[9rem] leading-none"
        >
          {l.emoji}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge color={badge.color}>{badge.label}</Badge>
            <Badge color="denim">{categoryLabel(l.category)}</Badge>
          </div>
          <h1 className="text-h1 [font-stretch:87%]">{formatPrice(l.price)}</h1>
          <h2 className="text-h3">{l.title}</h2>
          <p className="text-body whitespace-pre-line">{l.description}</p>
          <dl className="text-body-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-[var(--radius-md)] border-[length:var(--hairline)] border-solid border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
            <dt className="text-label uppercase text-[var(--text-soft)]">Seller</dt>
            <dd>{l.seller}</dd>
            <dt className="text-label uppercase text-[var(--text-soft)]">Where</dt>
            <dd className="inline-flex items-center gap-1">
              <Icon name="local" size={16} className="text-[var(--primary)]" />
              {l.location}
            </dd>
            <dt className="text-label uppercase text-[var(--text-soft)]">Posted</dt>
            <dd>{formatDate(l.postedAt)}</dd>
          </dl>
        </div>
      </div>
    </article>
  )
}

export function NotFound({ what }: { what: string }) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] bg-[var(--panel)] p-8">
      <h1 className="text-h2">Not found</h1>
      <p className="text-body">{what} It may have sold or never existed.</p>
      <a href="#/" className={backLink}>
        ← Back to all listings
      </a>
    </section>
  )
}
