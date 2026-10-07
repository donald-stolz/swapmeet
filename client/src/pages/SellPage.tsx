import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { createListing, getCategories } from '../api/client'
import type { Category, Condition } from '../api/types'
import { Button } from '../design-system'
import { categoryLabel, conditions } from '../lib/format'

interface FormState {
  title: string
  price: string
  category: string
  condition: Condition
  description: string
  seller: string
  location: string
  emoji: string
}

const empty: FormState = {
  title: '',
  price: '',
  category: '',
  condition: 'used-good',
  description: '',
  seller: '',
  location: '',
  emoji: ''
}

const control =
  'text-body w-full rounded-[var(--radius-sm)] border-[length:var(--hairline)] border-solid bg-[var(--surface)] px-3 py-2 text-[var(--text)] ' +
  'focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]'

export function SellPage() {
  const [form, setForm] = useState<FormState>(empty)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [failure, setFailure] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([])) // suggestions only; the form still works
  }, [])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setFailure(null)
    try {
      // Validation is the server's job (issue #1 contract); the form shows what it returns.
      const result = await createListing({
        title: form.title,
        price: form.price.trim() === '' ? NaN : Number(form.price),
        category: form.category.trim(),
        condition: form.condition,
        description: form.description,
        seller: form.seller,
        location: form.location,
        ...(form.emoji.trim() ? { emoji: form.emoji.trim() } : {})
      })
      if (result.ok) {
        window.location.hash = `#/?posted=${encodeURIComponent(result.listing.id)}`
        return
      }
      setFields(result.fields)
    } catch (err) {
      setFailure((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const errorCount = Object.keys(fields).length

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6">
      <a href="#/" className="text-body font-bold text-[var(--primary)]">
        ← All listings
      </a>
      <div>
        <h1 className="text-h1 [font-stretch:87%]">Sell something</h1>
        <p className="text-body mt-2 text-[var(--text-soft)]">Plain words, fair price. Neighbors will find it.</p>
      </div>

      {errorCount > 0 && (
        <p role="alert" className="text-body rounded-[var(--radius-md)] bg-[var(--danger)] px-4 py-3 text-[var(--on-danger)]">
          Fix {errorCount === 1 ? 'one field' : `${errorCount} fields`} below and post again.
        </p>
      )}
      {failure && (
        <p role="alert" className="text-body rounded-[var(--radius-md)] bg-[var(--danger)] px-4 py-3 text-[var(--on-danger)]">
          Couldn't post your listing: {failure}
        </p>
      )}

      <form
        noValidate
        onSubmit={submit}
        className="flex flex-col gap-5 rounded-[var(--radius-lg)] border-[length:var(--outline)] border-solid border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]"
      >
        <Field id="title" label="Title" error={fields.title}>
          <input id="title" className={controlFor(fields.title)} value={form.title} onChange={(e) => set('title', e.target.value)} aria-invalid={!!fields.title} aria-describedby={fields.title ? 'title-error' : undefined} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="price" label="Price (USD)" error={fields.price}>
            <input id="price" type="number" inputMode="numeric" min={0} step={1} className={controlFor(fields.price)} value={form.price} onChange={(e) => set('price', e.target.value)} aria-invalid={!!fields.price} aria-describedby={fields.price ? 'price-error' : undefined} />
          </Field>
          <Field id="condition" label="Condition" error={fields.condition}>
            <select id="condition" className={controlFor(fields.condition)} value={form.condition} onChange={(e) => set('condition', e.target.value as Condition)} aria-invalid={!!fields.condition} aria-describedby={fields.condition ? 'condition-error' : undefined}>
              {(Object.keys(conditions) as Condition[]).map((c) => (
                <option key={c} value={c}>
                  {conditions[c].label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="category" label="Category" hint="Pick one or type a new one, like maker-tools." error={fields.category}>
          <input id="category" list="category-options" className={controlFor(fields.category)} value={form.category} onChange={(e) => set('category', e.target.value)} aria-invalid={!!fields.category} aria-describedby={fields.category ? 'category-error' : 'category-hint'} />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {categoryLabel(c.slug)}
              </option>
            ))}
          </datalist>
        </Field>

        <Field id="description" label="Description" error={fields.description}>
          <textarea id="description" rows={5} className={controlFor(fields.description)} value={form.description} onChange={(e) => set('description', e.target.value)} aria-invalid={!!fields.description} aria-describedby={fields.description ? 'description-error' : undefined} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="seller" label="Your name or shop" error={fields.seller}>
            <input id="seller" className={controlFor(fields.seller)} value={form.seller} onChange={(e) => set('seller', e.target.value)} aria-invalid={!!fields.seller} aria-describedby={fields.seller ? 'seller-error' : undefined} />
          </Field>
          <Field id="location" label="Neighborhood" error={fields.location}>
            <input id="location" className={controlFor(fields.location)} value={form.location} onChange={(e) => set('location', e.target.value)} aria-invalid={!!fields.location} aria-describedby={fields.location ? 'location-error' : undefined} />
          </Field>
        </div>

        <Field id="emoji" label="Emoji (optional)" hint="Shown in place of a photo. Defaults to 📦." error={fields.emoji}>
          <input id="emoji" className={`${controlFor(fields.emoji)} max-w-24`} value={form.emoji} onChange={(e) => set('emoji', e.target.value)} aria-invalid={!!fields.emoji} aria-describedby={fields.emoji ? 'emoji-error' : 'emoji-hint'} />
        </Field>

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Posting…' : 'Post listing'}
          </Button>
        </div>
      </form>
    </section>
  )
}

function controlFor(error: string | undefined): string {
  return `${control} ${error ? 'border-[var(--danger)]' : 'border-[var(--line-strong)]'}`
}

interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label uppercase text-[var(--text)]">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-meta text-[var(--text-soft)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-meta font-bold text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  )
}
