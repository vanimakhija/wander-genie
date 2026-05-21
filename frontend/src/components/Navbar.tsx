'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, Sparkles, LogOut, LayoutDashboard, LogIn } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { signOut } from '@/lib/supabase'

export default function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 glass border-b border-white/[.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" style={{ height: '60px' }}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-indigo-500 shadow-glow-brand">
              <Globe className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-yellow-300" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Wander<span className="gradient-text">Genie</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <>
                  {/* User email */}
                  <span className="hidden text-xs text-white/40 sm:block">
                    {user.email}
                  </span>

                  {/* Dashboard */}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    My Trips
                  </Link>

                  {/* Sign out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-all hover:bg-red-500/20"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <span className="hidden text-sm text-white/35 sm:block">AI-Powered Travel</span>
                  <div className="h-4 w-px bg-white/10" />
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-lg border border-brand-400/30 bg-brand-500/10 px-3 py-1.5 text-xs text-brand-300 transition-all hover:bg-brand-500/20"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}