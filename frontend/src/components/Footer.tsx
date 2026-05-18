import { Globe } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[.05]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-400 to-indigo-500">
            <Globe className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-white/60" style={{ fontFamily: 'var(--font-display)' }}>
            Wander<span className="gradient-text">Genie</span>
          </span>
        </Link>

        <p className="font-mono text-xs text-white/20">
          MVP v1.0 · Built with AI
        </p>
      </div>
    </footer>
  )
}
