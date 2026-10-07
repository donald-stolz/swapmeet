import { Button, Icon } from '../design-system'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="border-b-[length:var(--outline)] border-solid border-[var(--line-strong)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#/" className="text-h2 text-[var(--text)] no-underline [font-stretch:87%]">
          Swap<span className="text-[var(--primary)]">Meet</span>
        </a>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button onClick={() => (window.location.hash = '#/sell')}>
            <Icon name="sell" size={18} />
            Sell
          </Button>
        </div>
      </div>
    </header>
  )
}
