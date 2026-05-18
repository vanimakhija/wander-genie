'use client'
import Link from 'next/link'
import { Globe, Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 glass border-b border-white/[.06]">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" style={{ height: '60px' }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-indigo-500 shadow-glow-brand">
              <Globe className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-yellow-300" />
          </div>
          <span className="font-[\'Playfair_Display\'] text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Wander<span className="gradient-text">Genie</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="hidden items-center gap-4 sm:flex">
          <span className="text-sm text-white/35" style={{ fontFamily: 'var(--font-body)' }}>AI-Powered Travel</span>
          <div className="h-4 w-px bg-white/10" />
          <span className="flex items-center gap-1.5 rounded-full border border-brand-400/25 bg-brand-500/10 px-3 py-1.5 font-mono text-[11px] text-brand-300 tracking-widest">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            BETA
          </span>
        </div>
      </div>
    </nav>
  )
}
