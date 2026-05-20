'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 glass border-b border-white/[.06]">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" style={{ height: '60px' }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="WanderGenie Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
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
