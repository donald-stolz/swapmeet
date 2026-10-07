import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'swapmeet-theme'
const darkQuery = '(prefers-color-scheme: dark)'

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function osTheme(): Theme {
  return window.matchMedia(darkQuery).matches ? 'dark' : 'light'
}

/**
 * Day/Night toggle. With no stored choice, no data-theme attribute is set and
 * tokens.css follows the OS. Clicking stores an explicit choice.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? osTheme())
  const [explicit, setExplicit] = useState(() => storedTheme() !== null)

  // Follow live OS changes until the user picks a theme.
  useEffect(() => {
    if (explicit) return
    const media = window.matchMedia(darkQuery)
    const onChange = () => setTheme(osTheme())
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [explicit])

  useEffect(() => {
    if (explicit) document.documentElement.setAttribute('data-theme', theme)
  }, [explicit, theme])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the choice lasts for this page only.
    }
    setExplicit(true)
    setTheme(next)
  }

  const nextLabel = theme === 'dark' ? 'Day' : 'Night'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${nextLabel} theme`}
      className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border-[length:var(--hairline)] border-solid border-[var(--line-strong)] bg-transparent px-3 py-2 [font-family:var(--font-sans)] text-sm font-bold text-[var(--text)] cursor-pointer focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
      {nextLabel}
    </button>
  )
}
