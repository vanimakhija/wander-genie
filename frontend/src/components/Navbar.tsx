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
      </div>
    </nav>
  )
}
